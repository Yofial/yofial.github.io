// GET/PUT /api/progress — the signed-in user's progress bitset, stored in D1.
// Auth: a Firebase ID token in "Authorization: Bearer …", verified here against Google's public keys.
// Bindings (wrangler.toml / Pages settings): DB = D1 database, FIREBASE_PROJECT_ID = Firebase project id.

const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const BITS_RE = /^[A-Za-z0-9_-]{1,200}$/;
let jwks = null, jwksExp = 0;

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});
const b64url = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));

async function keys() {
  if (jwks && Date.now() < jwksExp) return jwks;
  const r = await fetch(JWKS_URL);
  if (!r.ok) throw new Error('jwks');
  const age = +((r.headers.get('cache-control') || '').match(/max-age=(\d+)/) || [])[1] || 3600;
  jwks = (await r.json()).keys; jwksExp = Date.now() + age * 1000;
  return jwks;
}

async function verify(token, projectId) {
  const [h, p, s] = String(token || '').split('.');
  if (!s) return null;
  const header = JSON.parse(new TextDecoder().decode(b64url(h)));
  const claims = JSON.parse(new TextDecoder().decode(b64url(p)));
  if (header.alg !== 'RS256') return null;
  const jwk = (await keys()).find(k => k.kid === header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(s), new TextEncoder().encode(h + '.' + p));
  const now = Math.floor(Date.now() / 1000);
  if (!ok || claims.aud !== projectId || claims.iss !== 'https://securetoken.google.com/' + projectId ||
      !claims.sub || claims.exp < now || claims.iat > now + 300) return null;
  return claims;
}

export async function onRequest({ request, env }) {
  if (!env.DB || !env.FIREBASE_PROJECT_ID) return json({ error: 'not configured' }, 503);
  let user;
  try { user = await verify((request.headers.get('authorization') || '').replace(/^Bearer\s+/i, ''), env.FIREBASE_PROJECT_ID); }
  catch (e) { return json({ error: 'auth unavailable' }, 503); }
  if (!user) return json({ error: 'unauthorized' }, 401);

  if (request.method === 'GET') {
    const row = await env.DB.prepare('SELECT bits, updated_at FROM progress WHERE uid = ?').bind(user.sub).first();
    return json({ bits: row ? row.bits : '', updated: row ? row.updated_at : 0 });
  }
  if (request.method === 'PUT') {
    let body; try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
    if (!BITS_RE.test(body.bits || '')) return json({ error: 'bad bits' }, 400);
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO progress (uid, email, name, bits, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)
       ON CONFLICT(uid) DO UPDATE SET email = ?2, name = ?3, bits = ?4, updated_at = ?5`
    ).bind(user.sub, user.email || null, user.name || null, body.bits, now).run();
    return json({ ok: true, updated: now });
  }
  return json({ error: 'method not allowed' }, 405);
}
