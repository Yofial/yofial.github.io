// משנה בקביעותא – weekly Mishnah schedule, texts from Sefaria, podcast, and progress (local + optional cloud).

// [Hebrew name, chapters, Sefaria Mishnah title]. Order and chapter counts define the progress bitset,
// so changing them would scramble saved progress.
const TR = [
  ["ברכות",9,"Mishnah Berakhot"],["פאה",8,"Mishnah Peah"],["דמאי",7,"Mishnah Demai"],["כלאיים",9,"Mishnah Kilayim"],
  ["שביעית",10,"Mishnah Sheviit"],["תרומות",11,"Mishnah Terumot"],["מעשרות",5,"Mishnah Maasrot"],["מעשר שני",5,"Mishnah Maaser Sheni"],
  ["חלה",4,"Mishnah Challah"],["ערלה",3,"Mishnah Orlah"],["ביכורים",4,"Mishnah Bikkurim"],
  ["שבת",24,"Mishnah Shabbat"],["עירובין",10,"Mishnah Eruvin"],["פסחים",10,"Mishnah Pesachim"],["שקלים",8,"Mishnah Shekalim"],
  ["יומא",8,"Mishnah Yoma"],["סוכה",5,"Mishnah Sukkah"],["ביצה",5,"Mishnah Beitzah"],["ראש השנה",4,"Mishnah Rosh Hashanah"],
  ["תענית",4,"Mishnah Taanit"],["מגילה",4,"Mishnah Megillah"],["מועד קטן",3,"Mishnah Moed Katan"],["חגיגה",3,"Mishnah Chagigah"],
  ["יבמות",16,"Mishnah Yevamot"],["כתובות",13,"Mishnah Ketubot"],["נדרים",11,"Mishnah Nedarim"],["נזיר",9,"Mishnah Nazir"],
  ["סוטה",9,"Mishnah Sotah"],["גיטין",9,"Mishnah Gittin"],["קידושין",4,"Mishnah Kiddushin"],
  ["בבא קמא",10,"Mishnah Bava Kamma"],["בבא מציעא",10,"Mishnah Bava Metzia"],["בבא בתרא",10,"Mishnah Bava Batra"],
  ["סנהדרין",11,"Mishnah Sanhedrin"],["מכות",3,"Mishnah Makkot"],["שבועות",8,"Mishnah Shevuot"],["עדויות",8,"Mishnah Eduyot"],
  ["עבודה זרה",5,"Mishnah Avodah Zarah"],["אבות",6,"Pirkei Avot"],["הוריות",3,"Mishnah Horayot"],
  ["זבחים",14,"Mishnah Zevachim"],["מנחות",13,"Mishnah Menachot"],["חולין",12,"Mishnah Chullin"],["בכורות",9,"Mishnah Bekhorot"],
  ["ערכין",9,"Mishnah Arakhin"],["תמורה",7,"Mishnah Temurah"],["כריתות",6,"Mishnah Keritot"],["מעילה",6,"Mishnah Meilah"],
  ["תמיד",7,"Mishnah Tamid"],["מידות",5,"Mishnah Middot"],["קינים",3,"Mishnah Kinnim"],
  ["כלים",30,"Mishnah Kelim"],["אהלות",18,"Mishnah Oholot"],["נגעים",14,"Mishnah Negaim"],["פרה",12,"Mishnah Parah"],
  ["טהרות",10,"Mishnah Tahorot"],["מקוואות",10,"Mishnah Mikvaot"],["נידה",10,"Mishnah Niddah"],["מכשירין",6,"Mishnah Makhshirin"],
  ["זבים",5,"Mishnah Zavim"],["טבול יום",4,"Mishnah Tevul Yom"],["ידיים",4,"Mishnah Yadayim"],["עוקצין",3,"Mishnah Oktzin"]
];
const SEDER = [["זרעים",0,11],["מועד",11,23],["נשים",23,30],["נזיקין",30,40],["קדשים",40,51],["טהרות",51,63]];
const CH = [], OFF = [];
TR.forEach(([, c], t) => { OFF.push(CH.length); for (let i = 1; i <= c; i++) CH.push([t, i]); });
const N = CH.length;

const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function heb(n) {
  if (n === 15) return "טו"; if (n === 16) return "טז";
  return ["", "י", "כ", "ל"][Math.floor(n / 10)] + ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"][n % 10];
}
const lab = g => TR[CH[g][0]][0] + " " + heb(CH[g][1]);
const ICON = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5v13"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2A9.7 9.7 0 0 0 3.7 16.9L2.3 21.7l4.9-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7c-1.5 0-3-.4-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.3z"/></svg>',
  headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5"/></svg>',
  scroll: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 4h11a2 2 0 0 1 2 2v1H9"/><path d="M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7"/><path d="M9 11h7M9 15h5"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12"/><path d="M12 8C10 4 6.5 5 7.5 7c.5 1 4.5 1 4.5 1zm0 0c2-4 5.5-3 4.5-1-.5 1-4.5 1-4.5 1z"/></svg>',
  spotify: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4a.6.6 0 0 1-.9.2c-2.4-1.5-5.3-1.8-8.8-1a.6.6 0 1 1-.3-1.2c3.8-.9 7.1-.5 9.8 1.1.3.2.4.6.2.9zm1.2-2.7a.8.8 0 0 1-1.1.3c-2.7-1.7-6.9-2.2-10.1-1.2a.8.8 0 0 1-.5-1.5c3.7-1.1 8.3-.6 11.4 1.4.4.2.5.7.3 1zm.1-2.8C14.7 9 9.4 8.8 6.3 9.7a1 1 0 1 1-.5-1.8c3.5-1.1 9.4-.9 13.1 1.3a1 1 0 0 1-1 1.7z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>'
};

// ---------------- data ----------------
const getJSON = async (u) => { try { const r = await fetch(u, { cache: "no-cache" }); return r.ok ? await r.json() : null; } catch (e) { return null; } };
const [C, S, E] = await Promise.all([getJSON("config.json"), getJSON("schedule.json"), getJSON("episodes.json")]);
const CFG = C || {}, LINKS = Object.fromEntries(Object.entries(CFG.links || {}).filter(([, v]) => /^https:\/\//i.test(String(v))));
const WEEKS = [];
{ let g = 0; for (const w of (S && S.weeks) || []) { const n = Math.max(0, Math.min(+w.chapters || 0, N - g)); WEEKS.push({ ...w, a: g, b: g + n }); g += n; } }

const tIndex = name => { const k = String(name).replace(/[\s"״'׳]/g, ""); return TR.findIndex(([h]) => h.replace(/\s/g, "") === k); };
function parseCh(s) { // "ברכות 5" -> global chapter index
  const m = String(s || "").trim().match(/^(.+?)\s+(\d+)$/); if (!m) return -1;
  const t = tIndex(m[1]); if (t < 0 || +m[2] < 1 || +m[2] > TR[t][1]) return -1;
  return OFF[t] + +m[2] - 1;
}
const spotifyId = (s, kind) => { const m = String(s || "").match(new RegExp(kind + "[/:]([A-Za-z0-9]{22})")); return m ? m[1] : (/^[A-Za-z0-9]{22}$/.test(s || "") ? s : ""); };
const EPISODES = ((E && E.episodes) || []).map(e => {
  const a = parseCh(e.from), b = parseCh(e.to || e.from), id = spotifyId(e.spotify, "episode");
  return a >= 0 && b >= a && id ? { a, b, id, title: e.title || "" } : null;
}).filter(Boolean);
const SHOW = spotifyId(LINKS.podcast, "show");
const epFor = g => EPISODES.find(e => e.a <= g && g <= e.b);
const epsFor = (a, b) => EPISODES.filter(e => e.a < b && e.b >= a);

// ---------------- dates ----------------
const pad = n => String(n).padStart(2, "0");
const now = new Date();
const qDate = new URLSearchParams(location.search).get("date");
const TODAY = /^\d{4}-\d{2}-\d{2}$/.test(qDate || "") ? qDate : `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const CW = WEEKS.findIndex(w => w.shabbat >= TODAY); // current week = the first whose Shabbat hasn't passed
const gd = iso => { const [y, m, d] = iso.split("-"); return `${+d}.${+m}.${y}`; };
const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
const wName = w => /^(חול|ראש|יום|סוכות|שמחת|פסח|שבועות)/.test(w.parasha) ? w.parasha : "פרשת " + w.parasha;

// ---------------- progress (bitset, same encoding as the earlier static site) ----------------
const KEY = "mishna-bekviuta-v3";
let D = new Uint8Array(N);
function enc(a = D) { let b = ""; for (let i = 0; i < N; i += 8) { let v = 0; for (let j = 0; j < 8; j++) if (a[i + j]) v |= 1 << j; b += String.fromCharCode(v); } return btoa(b).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function dec(s) {
  try { s = String(s).trim().replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; const b = atob(s);
    if (b.length !== Math.ceil(N / 8)) return null; const a = new Uint8Array(N); for (let i = 0; i < N; i++) a[i] = (b.charCodeAt(i >> 3) >> (i & 7)) & 1; return a; }
  catch (e) { return null; }
}
try { const s = localStorage.getItem(KEY); if (s) D = dec(s) || D; } catch (e) {}
let cloudPush = () => {};
function save() { try { localStorage.setItem(KEY, enc()); } catch (e) {} cloudPush(); }
{ const m = location.hash.match(/p=([\w-]+)/); if (m) { const a = dec(m[1]); if (a) { if (!D.some(x => x) || confirm("נמצאה התקדמות בקישור. להחליף בה את ההתקדמות שבמכשיר הזה?")) { D = a; save(); } } history.replaceState(null, "", location.pathname + location.search); } }
const countRange = (a, b) => { let c = 0; for (let g = a; g < b; g++) c += D[g]; return c; };

function toast(t) { const el = document.createElement("div"); el.className = "toast"; el.textContent = t; document.body.appendChild(el); setTimeout(() => el.remove(), 2200); }

// ---------------- Sefaria ----------------
const API = "https://www.sefaria.org/api";
const memo = new Map();
const cached = (k, f) => { if (!memo.has(k)) memo.set(k, f().catch(e => { memo.delete(k); throw e; })); return memo.get(k); };
async function fetchJSON(u) { const r = await fetch(u, { headers: { accept: "application/json" } }); if (!r.ok) { const e = new Error(r.status); e.status = r.status; throw e; } return r.json(); }
// Sefaria text is third-party HTML: parse it inertly and rebuild it from text plus a few attribute-less tags.
const KEEP = new Set(["B", "STRONG", "BIG", "SMALL", "BR"]), DROP = new Set(["SUP", "SCRIPT", "STYLE", "TEMPLATE", "SVG", "MATH"]);
function clean(html) {
  const walk = n => [...n.childNodes].map(c => {
    if (c.nodeType === 3) return esc(c.nodeValue);
    if (c.nodeType !== 1 || DROP.has(c.nodeName.toUpperCase()) || c.classList.contains("footnote")) return "";
    const tag = c.nodeName.toUpperCase();
    if (tag === "BR") return "<br>";
    return KEEP.has(tag) ? `<${tag.toLowerCase()}>${walk(c)}</${tag.toLowerCase()}>` : walk(c);
  }).join("");
  return walk(new DOMParser().parseFromString(String(html || ""), "text/html").body).trim();
}
async function segments(ref) {
  const d = await fetchJSON(`${API}/v3/texts/${encodeURIComponent(ref)}?version=hebrew`);
  let raw = d.versions && d.versions.length ? d.versions[0].text : (d.he || null);
  if (raw == null) return null;
  raw = (Array.isArray(raw) ? raw : [raw]).flat(2).filter(x => typeof x === "string" && x.trim());
  return raw.length ? raw : null;
}
const mishnah = g => cached("m" + g, () => segments(`${TR[CH[g][0]][2]} ${CH[g][1]}`));
// Tosefta chapters don't line up with Mishnah chapters, so follow Sefaria's Mishnah→Tosefta links
// and show each linked Tosefta chapter whole, preferring Lieberman's edition where it exists.
const tosefta = g => cached("t" + g, async () => {
  const ref = `${TR[CH[g][0]][2]} ${CH[g][1]}`;
  const links = await fetchJSON(`${API}/links/${encodeURIComponent(ref)}?with_text=0`);
  const chapters = new Map(); // "Tosefta Berakhot" -> Set(chapter)
  for (const l of Array.isArray(links) ? links : []) {
    const r = l.ref || l.sourceRef || "";
    if (l.category !== "Tosefta" && !/^Tosefta /.test(r)) continue;
    const m = r.match(/^(Tosefta .+?)(?: \(Lieberman\))? (\d+)(?::|$)/); if (!m) continue;
    if (!chapters.has(m[1])) chapters.set(m[1], new Set());
    chapters.get(m[1]).add(+m[2]);
  }
  const out = [];
  const lieberman = (CFG.toseftaEdition || "Lieberman") === "Lieberman";
  for (const [title, set] of chapters) for (const c of [...set].sort((x, y) => x - y)) {
    let segs = null, edition = "";
    if (lieberman) { try { segs = await segments(`${title} (Lieberman) ${c}`); edition = "נוסח ליברמן"; } catch (e) {} }
    if (!segs) { try { segs = await segments(`${title} ${c}`); edition = "נוסח ספריא"; } catch (e) {} }
    if (segs) out.push({ title, c, segs, edition });
  }
  return out;
});
const sefariaUrl = ref => "https://www.sefaria.org.il/" + encodeURIComponent(ref.replace(/ (\d+)$/, ".$1").replace(/ /g, "_")) + "?lang=he";

// ---------------- rendering ----------------
let view = "home", allTab = "weeks";
const open = { g: -1, tab: "" };

function renderHeader() {
  if (CFG.title) { $("title").textContent = CFG.title; document.title = CFG.title; }
  if (CFG.dedication) $("ded").textContent = CFG.dedication;
  if (CFG.dedicationNote !== undefined) $("dedNote").textContent = CFG.dedicationNote;
  $("cycle").textContent = CFG.cycle || "";
  $("footDed").textContent = CFG.dedication || "";
  const A = CFG.about || {};
  const pts = (A.points || []).map(p => Array.isArray(p) ? p : ["book", p]);
  $("about").innerHTML = `
    <h2 id="aboutH">${esc(A.headline || "")}</h2>
    ${A.intro ? `<p>${esc(A.intro)}</p>` : ""}
    <ul class="points">${pts.map(([i, t]) => `<li><span class="ico">${ICON[i] || ICON.book}</span><span>${esc(t)}</span></li>`).join("")}</ul>
    <div class="ctas">
      ${LINKS.whatsapp ? `<a class="btn wa" href="${esc(LINKS.whatsapp)}" target="_blank" rel="noopener">${ICON.whatsapp}הצטרפות לקבוצה</a>` : ""}
      ${LINKS.podcast ? `<a class="btn o" href="${esc(LINKS.podcast)}" target="_blank" rel="noopener">${ICON.spotify}הפודקאסט</a>` : ""}
    </div>
    <details class="about-more"><summary>הלוח המלא והפלייר</summary>
      ${LINKS.schedule ? `<p><a href="${esc(LINKS.schedule)}" target="_blank" rel="noopener">תיאור התוכנית ולוח הזמנים המלא</a></p>` : ""}
      <img class="flyer" src="flyer.jpg" alt="פלייר משנה בקביעותא" loading="lazy">
    </details>`;
  $("footLinks").innerHTML =
    (LINKS.whatsapp ? `<a class="btn wa" href="${esc(LINKS.whatsapp)}" target="_blank" rel="noopener">${ICON.whatsapp}קבוצת הוואטסאפ</a>` : "") +
    (LINKS.podcast ? `<a class="btn o" href="${esc(LINKS.podcast)}" target="_blank" rel="noopener">${ICON.spotify}הפודקאסט</a>` : "") +
    (LINKS.schedule ? `<a class="btn o" href="${esc(LINKS.schedule)}" target="_blank" rel="noopener">${ICON.calendar}הלוח המלא</a>` : "");
}

function chapterItem(g) {
  const ep = epFor(g);
  return `<div class="ch${D[g] ? " done" : ""}" data-ch="${g}">
    <div class="ch-row">
      <button class="tick" type="button" data-g="${g}" aria-pressed="${!!D[g]}" aria-label="סימון ${esc(lab(g))} כנלמד">${ICON.check}</button>
      <span class="ch-name">${esc(lab(g))}</span>
      <span class="tabs" role="tablist">
        <button class="tab" type="button" role="tab" data-open="mishnah" aria-selected="false">משנה</button>
        <button class="tab" type="button" role="tab" data-open="tosefta" aria-selected="false">תוספתא</button>
        <button class="tab i" type="button" role="tab" data-open="audio" aria-selected="false" aria-label="${ep ? "שיעור על הפרק" : "הפודקאסט"}" title="${ep ? "שיעור על הפרק" : "הפודקאסט"}">${ICON.headphones}</button>
      </span>
    </div>
  </div>`;
}

function weekStatus(i) {
  const w = WEEKS[i], n = w.b - w.a, c = countRange(w.a, w.b);
  const done = n > 0 && c === n, past = CW < 0 || i < CW;
  return { n, c, done, past, cur: i === CW, late: past && !done && n > 0 };
}

function renderHome() {
  if (!WEEKS.length) { $("weekHead").innerHTML = ""; $("week").innerHTML = '<div class="box">לא נמצא לוח לימוד.</div>'; return; }
  if (CW < 0) {
    $("weekHead").innerHTML = "<h2>המחזור הסתיים</h2>";
    $("week").innerHTML = `<div class="box"><h3>סיימנו את הש״ס! 🎉</h3><p class="sub">אפשר לראות את כל ההתקדמות בלשונית למטה.</p></div>`;
    $("catchup").innerHTML = catchupBox(); $("next").innerHTML = ""; return;
  }
  const w = WEEKS[CW], st = weekStatus(CW), left = days(TODAY, w.shabbat);
  const before = CW === 0 && days(TODAY, w.shabbat) > 6;
  $("weekHead").innerHTML = `
    <div><h2>${before ? "השבוע הראשון" : "השבוע"} · ${esc(wName(w))}</h2>
      <div class="when">עד שבת ${esc(w.hebrew || "")} (${gd(w.shabbat)})${before ? "" : left === 0 ? " · היום שבת" : left === 1 ? " · מחר שבת" : ` · עוד ${left} ימים`}</div></div>
    ${st.n ? `<span class="count">${st.c} / ${st.n} פרקים</span>` : ""}`;
  let h = st.n ? `<div class="wbar"><i style="width:${st.c / st.n * 100}%"></i></div>` : "";
  h += lessonBar(w);
  h += st.n ? `<div class="chapters">${range(w.a, w.b).map(chapterItem).join("")}</div>`
            : `<div class="box">השבוע אין פרקים חדשים בלוח — זמן טוב להשלמות ולחזרה.</div>`;
  $("week").innerHTML = h;
  $("catchup").innerHTML = catchupBox();
  const nx = WEEKS[CW + 1];
  $("next").innerHTML = nx && nx.b > nx.a ? `<details class="box"><summary><span>בשבוע הבא · ${esc(wName(nx))}</span><span class="sm">${esc(lab(nx.a))} – ${esc(lab(nx.b - 1))}</span></summary>
    <div class="chapters">${range(nx.a, nx.b).map(chapterItem).join("")}</div></details>` : "";
  restorePanel();
}
const range = (a, b) => Array.from({ length: b - a }, (_, i) => a + i);

function lessonBar(w) {
  const eps = epsFor(w.a, w.b);
  if (eps.length) return eps.map(e => `<div class="lesson" data-embed="episode/${e.id}" data-h="152">
      <span class="ico">${ICON.headphones}</span><span class="t"><b>שיעור השבוע</b>${esc(e.title || lab(e.a) + " – " + lab(e.b))}</span>
      <button class="btn" type="button" data-play>האזנה</button></div>`).join("");
  if (!SHOW) return "";
  return `<div class="lesson" data-embed="show/${SHOW}" data-h="352">
      <span class="ico">${ICON.headphones}</span><span class="t"><b>השיעורים המוקלטים</b>שיעור שבועי בעיון בנושאים מהפרקים</span>
      <button class="btn" type="button" data-play>האזנה</button></div>`;
}
const embed = (path, h) => `<iframe class="embed" src="https://open.spotify.com/embed/${path}?utm_source=generator&theme=0" height="${h}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="נגן ספוטיפיי"></iframe>`;

function catchupBox() {
  const end = CW < 0 ? N : (WEEKS[CW] ? WEEKS[CW].a : 0), miss = [];
  for (let g = 0; g < end; g++) if (!D[g]) miss.push(g);
  if (!miss.length) return "";
  const shown = miss.slice(0, 40);
  return `<details class="box late"><summary><span>להשלמה משבועות קודמים</span><span class="sm">${miss.length} פרקים</span></summary>
    <div class="chips">${shown.map(g => `<button class="chip" type="button" data-g="${g}">${esc(lab(g))}</button>`).join("")}</div>
    ${miss.length > shown.length ? `<p class="sub">ועוד ${miss.length - shown.length} — ראו ב<button class="lnk" type="button" data-go="all">כל ההתקדמות</button></p>` : ""}</details>`;
}

// ----- chapter panel with tabs: משנה / תוספתא / שיעור -----
function restorePanel() { if (open.g >= 0) { const el = document.querySelector(`[data-ch="${open.g}"]`); if (el) showPanel(el, open.tab); else open.g = -1; } }
function closePanels() { document.querySelectorAll(".ch .panel").forEach(p => p.remove()); document.querySelectorAll(".tab[aria-selected=true]").forEach(t => t.setAttribute("aria-selected", "false")); }
function showPanel(el, tab) {
  const g = +el.dataset.ch;
  closePanels(); open.g = g; open.tab = tab;
  el.querySelector(`[data-open="${tab}"]`).setAttribute("aria-selected", "true");
  const p = document.createElement("div"); p.className = "panel"; el.appendChild(p);
  if (tab === "audio") {
    const ep = epFor(g);
    p.innerHTML = ep ? embed("episode/" + ep.id, 152) + (ep.title ? `<p class="src-note">${esc(ep.title)}</p>` : "")
      : SHOW ? `<p class="src-note">עוד לא שויך שיעור מוקלט לפרק הזה. אפשר להאזין לכל השיעורים של התוכנית:</p>` + embed("show/" + SHOW, 352)
      : `<p class="src-note">עוד לא שויך שיעור מוקלט לפרק הזה.</p>`;
    return;
  }
  p.innerHTML = '<p class="loading">טוען מספריא…</p>';
  const ref = `${TR[CH[g][0]][2]} ${CH[g][1]}`;
  const done = html => { if (p.isConnected) p.innerHTML = html; };
  const fail = () => done(`<p class="loading">לא הצלחנו לטעון את הטקסט. בדקו את החיבור ונסו שוב, או <a href="${sefariaUrl(ref)}" target="_blank" rel="noopener">פתחו בספריא</a>.</p>`);
  if (tab === "mishnah") {
    mishnah(g).then(segs => done(segs
      ? `<div class="text">${segs.map((s, i) => `<p><span class="n">${heb(i + 1)}</span>${clean(s)}</p>`).join("")}</div>
         <div class="panel-foot"><a href="${sefariaUrl(ref)}" target="_blank" rel="noopener">לפרק בספריא</a>${markBtn(g)}</div>`
      : fail()), fail);
  } else {
    tosefta(g).then(list => done(list.length
      ? list.map(({ title, c, segs, edition }) => `<div class="text"><h4>תוספתא ${esc(TR[CH[g][0]][0])} פרק ${heb(c)} <span class="sm">· ${edition}</span></h4>
          ${segs.map((s, i) => `<p><span class="n">${heb(i + 1)}</span>${clean(s)}</p>`).join("")}</div>`).join("") +
        `<div class="panel-foot"><a href="${sefariaUrl(list[0].title + (list[0].edition === "נוסח ליברמן" ? " (Lieberman)" : "") + " " + list[0].c)}" target="_blank" rel="noopener">לתוספתא בספריא</a>${markBtn(g)}</div>`
      : `<p class="loading">לא נמצאה בספריא תוספתא המקבילה לפרק הזה.</p>`), fail);
  }
}
const markBtn = g => D[g] ? "" : `<button class="lnk" type="button" data-g="${g}" data-from-panel>סיימתי את הפרק ✓</button>`;

function setDone(g, v) {
  D[g] = v; save();
  document.querySelectorAll(`[data-ch="${g}"]`).forEach(el => { el.classList.toggle("done", !!v); el.querySelector(".tick").setAttribute("aria-pressed", String(!!v)); });
  document.querySelectorAll(`[data-from-panel][data-g="${g}"]`).forEach(b => b.remove());
  refreshCounts();
}
function refreshCounts() {
  if (view === "home") {
    if (CW >= 0 && WEEKS[CW]) {
      const st = weekStatus(CW), c = document.querySelector("#weekHead .count"), bar = document.querySelector("#week .wbar i");
      if (c) c.textContent = `${st.c} / ${st.n} פרקים`; if (bar) bar.style.width = (st.c / st.n * 100) + "%";
      if (st.done && st.n) toast("כל הכבוד! סיימת את פרקי השבוע");
    }
    const keep = $("catchup").querySelector("details")?.open; $("catchup").innerHTML = catchupBox();
    if (keep && $("catchup").querySelector("details")) $("catchup").querySelector("details").open = true;
  } else renderAll();
}

// ----- all progress -----
function renderAll() {
  let d = 0; for (let i = 0; i < N; i++) d += D[i];
  let t = 0; TR.forEach(([, c], x) => { if (countRange(OFF[x], OFF[x] + c) === c) t++; });
  const due = CW < 0 ? N : WEEKS[CW].a, late = due - countRange(0, due);
  $("summary").innerHTML = `<div class="sum"><div class="row"><span class="big">${d} / ${N} פרקים</span><span class="sm">${t} / ${TR.length} מסכתות</span></div>
    <div class="bar"><i style="width:${d / N * 100}%"></i></div>
    <div class="sm" style="margin-top:6px">${CW >= 0 ? (late ? `להשלמה מהשבועות הקודמים: ${late} פרקים` : "בקצב הלוח ✓") : ""}</div></div>`;
  document.querySelectorAll("#allTabs button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.all === allTab)));
  if (allTab === "weeks") {
    $("allBody").innerHTML = WEEKS.map((w, i) => {
      if (w.b === w.a) return "";
      const st = weekStatus(i);
      const tag = st.done ? '<span class="tag t-done">הושלם</span>' : st.cur ? '<span class="tag t-cur">השבוע</span>' : st.late ? `<span class="tag t-late">חסרים ${st.n - st.c}</span>` : "";
      return `<div class="wk${st.done ? " done" : ""}${st.cur ? " cur" : ""}${st.late ? " late" : ""}" id="w${i}">
        <h3>שבוע ${i + 1} · ${esc(wName(w))} ${tag}</h3><div class="dt">שבת ${esc(w.hebrew || "")} · ${gd(w.shabbat)}</div>
        <div class="chips">${range(w.a, w.b).map(g => `<button class="chip${D[g] ? " on" : ""}" type="button" data-g="${g}">${esc(lab(g))}</button>`).join("")}</div></div>`;
    }).join("");
  } else {
    $("allBody").innerHTML = SEDER.map(([s, a, b]) => {
      let tt = 0, dd = 0; for (let x = a; x < b; x++) { tt += TR[x][1]; dd += countRange(OFF[x], OFF[x] + TR[x][1]); }
      return `<details class="sd"${s === "זרעים" ? " open" : ""}><summary><span>סדר ${s}</span><span class="sm">${dd} / ${tt}</span></summary><div class="sb">` +
        TR.slice(a, b).map(([n, c], k) => { const x = a + k, dn = countRange(OFF[x], OFF[x] + c);
          return `<div class="wk${dn === c ? " done" : ""}"><h3>מסכת ${esc(n)} ${dn === c ? '<span class="tag t-done">הושלמה</span>' : ""}<span class="sm">${dn}/${c}</span></h3>
            <div class="chips">${range(0, c).map(i => `<button class="chip sq${D[OFF[x] + i] ? " on" : ""}" type="button" data-g="${OFF[x] + i}" aria-label="${esc(n)} ${heb(i + 1)}">${heb(i + 1)}</button>`).join("")}</div></div>`; }).join("") +
        "</div></details>";
    }).join("");
  }
}

function go(v, scroll = true) {
  view = v === "all" ? "all" : "home";
  $("home").hidden = view !== "home"; $("all").hidden = view !== "all";
  if (view === "all") { renderAll(); if (scroll) { $("all").scrollIntoView(); const c = $("w" + CW); if (c && allTab === "weeks") setTimeout(() => c.scrollIntoView({ block: "center" }), 0); } }
  else { renderHome(); if (scroll) $("home").scrollIntoView(); }
}

// ---------------- events ----------------
document.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.g !== undefined) {
    const g = +b.dataset.g;
    if (b.classList.contains("chip")) { D[g] ^= 1; save(); if (view === "all") renderAll(); else { b.classList.toggle("on", !!D[g]); setDone(g, D[g]); } return; }
    setDone(g, D[g] ? 0 : 1); return;
  }
  if (b.dataset.open) {
    const el = b.closest("[data-ch]");
    if (open.g === +el.dataset.ch && open.tab === b.dataset.open && el.querySelector(".panel")) { closePanels(); open.g = -1; }
    else showPanel(el, b.dataset.open);
    return;
  }
  if (b.dataset.play !== undefined) { const l = b.closest(".lesson"); l.outerHTML = embed(l.dataset.embed, l.dataset.h); return; }
  if (b.dataset.go) { location.hash = b.dataset.go === "all" ? "all" : ""; if (b.dataset.go !== "all") go("home"); return; }
  if (b.dataset.all) { allTab = b.dataset.all; renderAll(); return; }
  if (b.id === "openBackup") { $("backup").showModal(); return; }
  if (b.id === "copyLink") { const t = location.origin + location.pathname + "#p=" + enc(); navigator.clipboard.writeText(t).then(() => toast("הקישור הועתק"), () => prompt("העתיקו את הקישור:", t)); return; }
  if (b.id === "loadCode") { const v = $("codeIn").value, m = v.match(/p=([\w-]+)/), a = dec(m ? m[1] : v); if (!a) { toast("הקוד אינו תקין"); return; } D = a; save(); go(view, false); $("backup").close(); toast("ההתקדמות נטענה"); return; }
  if (b.id === "reset") { if (confirm("למחוק את כל ההתקדמות?")) { D = new Uint8Array(N); save(); go(view, false); $("backup").close(); } return; }
});
window.addEventListener("hashchange", () => go(location.hash === "#all" ? "all" : "home"));

renderHeader();
go(location.hash === "#all" ? "all" : "home", false);
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

// ---------------- sign-in (Firebase) + cloud progress (Cloudflare D1) ----------------
const F = CFG.firebase || {};
if (F.apiKey) {
  const acct = $("account");
  try {
    const V = "10.14.1";
    const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
    const { getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect, GoogleAuthProvider, signOut } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`);
    const auth = getAuth(initializeApp({ apiKey: F.apiKey, authDomain: F.authDomain, projectId: F.projectId, appId: F.appId }));
    let user = null, timer = null, state = "";
    const api = async (method, body) => {
      const r = await fetch("api/progress", { method, headers: { authorization: "Bearer " + await user.getIdToken(), "content-type": "application/json" }, body: body && JSON.stringify(body) });
      if (!r.ok) throw new Error(r.status); return r.json();
    };
    const paint = () => {
      acct.innerHTML = user
        ? `<span>${user.photoURL ? `<img src="${esc(user.photoURL)}" alt="" referrerpolicy="no-referrer">` : ""}ההתקדמות נשמרת בחשבון של ${esc(user.displayName || user.email || "")}${state ? " · " + state : ""}</span> · <button class="lnk m" type="button" id="signOut">התנתקות</button>`
        : `<div>ההתקדמות נשמרת כרגע רק במכשיר הזה.</div><button class="btn o" type="button" id="signIn">התחברות עם Google לשמירה בכל המכשירים</button>`;
    };
    cloudPush = () => { if (!user) return; clearTimeout(timer); timer = setTimeout(() => api("PUT", { bits: enc() }).then(() => { state = ""; paint(); }, () => { state = "לא נשמר בענן, ננסה שוב"; paint(); }), 700); };
    acct.addEventListener("click", e => {
      if (e.target.id === "signIn") { const p = new GoogleAuthProvider(); signInWithPopup(auth, p).catch(err => { if (/popup/.test(err.code || "")) signInWithRedirect(auth, p); }); }
      if (e.target.id === "signOut") signOut(auth);
    });
    onAuthStateChanged(auth, async u => {
      user = u; state = ""; paint(); if (!u) return;
      try {
        const remote = dec((await api("GET")).bits || "");
        const local = D.slice(); let changed = false;
        if (remote) for (let i = 0; i < N; i++) { const v = local[i] | remote[i]; if (v !== remote[i]) changed = true; D[i] = v; }
        else changed = local.some(x => x);
        try { localStorage.setItem(KEY, enc()); } catch (e) {}
        if (changed) cloudPush();
        go(view, false);
      } catch (e) { state = "השמירה בענן לא זמינה כרגע"; paint(); }
    });
  } catch (e) { acct.textContent = ""; }
}
