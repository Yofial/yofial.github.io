# Mishna Bekviuta: remaining work to launch mishna.kviuta.com

The goal is mishna.kviuta.com on Cloudflare Pages, with Google sign-in through Firebase and progress saved in Cloudflare D1. Everything stays on free plans. Guests can still use the site without signing in.

## Where things stand

**Done, merged to `main` (PRs #1–#3)**
- The weekly site in `mishna-bekviuta/`:
  - Program background, then this week's chapters, catch-up from earlier weeks and next week.
  - A full-progress view, by week or by tractate.
  - For each chapter: Mishnah and Tosefta (Lieberman edition) from Sefaria, and the podcast lesson.
  - WhatsApp and podcast links.
  - Flyer styling, logo, favicon, PWA and dark mode.
- Site settings in `config.json`, `schedule.json` and `episodes.json`.
- `functions/api/progress.js`: a Pages Function. It checks the Firebase sign-in token against Google's public keys, then reads or writes that user's progress in D1.
- Guest progress uses the same `localStorage` key and encoding as the previous static site, so existing users keep what they've marked.
- XSS fix for the Sefaria text (PR #3).

**Already created in Cloudflare**
- D1 database `mishna-bekviuta` (id `d56597d4-3f8e-4dea-874c-7367983506a7`, region EEUR), with the `progress` table from `schema.sql` applied.

**Live today**
- https://yofial.github.io/mishna-bekviuta/ serves the new site from `main` (GitHub Pages, guest mode only).
- mishna.kviuta.com still serves the previous static site. Where it's hosted is unknown; see D1 below.

**Never tested against the real services.** Sefaria, Spotify, Firebase, Pinecast, the Google Sheet and the live domain couldn't be reached from the build environment. All testing so far used mocked responses.

---

## A. Content and data (blocks launch)

| # | Item | What's needed | Owner |
|---|---|---|---|
| A1 | **Real schedule.** `schedule.json` currently has 5 chapters in every week (105 weeks × 5 = 525). The real schedule is calculated by hand per cycle, and some weeks differ. | The schedule sheet exported as CSV, or set `chapters` for each week that differs. | You → me |
| A2 | **Podcast episode mapping.** `episodes.json` is empty, so every chapter falls back to the whole show. | The episode list, as a real RSS file from https://pinecast.com/feed/mishna saved in a browser, or the titles. Then I fill `from`/`to`/`spotify` for each episode. | You → me |
| A3 | **Background text.** Check the wording of `about` in `config.json`: headline, intro and points. | Review and edit. | You |
| A4 | **Teen track.** Mentioned in one sentence only. | Decide whether it needs its own schedule or page. | You |

## B. Development left

### Must do before launch
- **B1. Login only where the API exists.** Once `firebase.apiKey` is filled in, the github.io copy will show a "sign in" button, but `/api/progress` doesn't exist there. Signing in would end in "cloud save unavailable". Fix: show sign-in only on the production host (for example a `cloudHosts: ["mishna.kviuta.com"]` setting in `config.json`). Or retire the github.io copy (see D7).
- **B2. Sign-in on iOS and the installed app.** `signInWithPopup` often fails in an iOS home-screen app, and the redirect fallback breaks in Safari when `authDomain` is `*.firebaseapp.com`, because Safari blocks third-party storage. Fix: set `authDomain` to `mishna.kviuta.com` and proxy `/__/auth/*` to `<project>.firebaseapp.com` with a small Pages Function. This follows Firebase's "redirect best practices", option 3.
- **B3. Keep devices in sync.** Today the site merges local and server progress only once, at sign-in. After that, each device overwrites the server's copy with its own whole copy (last writer wins). So if device A unmarks a chapter, device B can mark it again with its next save. Minimal fix: re-fetch from the server when the tab regains focus (`visibilitychange`), before pushing. Better: send only the changed chapters with a timestamp, and resolve conflicts per chapter on the server.
- **B4. Security headers.** Add a Content-Security-Policy to `_headers` as a second line of defence after the XSS fix. Allow:
  - `script-src`: `'self'` and `www.gstatic.com`
  - `connect-src`: `'self'`, `www.sefaria.org`, `*.googleapis.com` and `securetoken.googleapis.com`
  - `frame-src`: `open.spotify.com` and the Firebase auth domain
  - `img-src`: `'self'`, `data:` and `lh3.googleusercontent.com` (profile photos)
  - `style-src` and `font-src`: Google Fonts

  Also add `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.

### Should do
- **B5. Sefaria mapping check.** Run a one-off script over all 525 chapters, from a network that can reach Sefaria, to confirm:
  - each Mishnah reference returns text (watch `Pirkei Avot` and the spelling of the tractate names);
  - which chapters have Mishnah→Tosefta links;
  - where the Lieberman edition exists.

  Fix any names that don't match.
- **B6. Sign-out on shared devices.** Progress stays in `localStorage` after sign-out. Decide whether sign-out should clear it, or ask.
- **B7. Delete my data.** Add `DELETE /api/progress` and a short privacy note in the footer: what is stored (Google id, email, name, an 88-character progress string) and how to delete it.
- **B8. Automatic podcast matching (optional, depends on A2).** A Pages Function that fetches the RSS and matches episodes to chapters by title, with `episodes.json` as a manual override. Risk: Pinecast's Cloudflare protection may block requests from Cloudflare's servers too. Test before relying on it.

### Nice to have
- **B9.** A cache version bump in `sw.js` on each release, so the offline cache picks up new files quickly.
- **B10.** Remove the unused `favicon-32.png`.
- **B11.** `README.md` and `schema.sql` are publicly downloadable from the site root. They're harmless, but they could move out of the deployed folder.

## C. Testing

### C1. Local, with a real D1 and Functions
```bash
cd mishna-bekviuta
npx wrangler d1 execute mishna-bekviuta --local --file=schema.sql
npx wrangler pages dev . --d1 DB=mishna-bekviuta --binding FIREBASE_PROJECT_ID=<project-id>
# open http://localhost:8788  (Firebase allows localhost by default)
```

### C2. Automated
- The API test I ran during development (valid token, wrong project, expired token, tampered signature, bad data) lives only in my scratch space. Commit it as `tests/progress.test.mjs`, outside the deployed folder.
- Browser tests (Playwright with Sefaria mocked): marking chapters, the Mishnah/Tosefta/podcast tabs, the progress views, and the XSS payloads from PR #3.
- The Sefaria mapping script (B5).

### C3. Manual checklist on the preview deployment (`*.pages.dev`)

**Guest**
- [ ] Mark chapters, reload, and the marks are still there.
- [ ] Progress from the old site carries over: same browser, same domain, so the same `localStorage` key.
- [ ] A `#p=` backup link opens on another device and loads the progress.

**Sign-in**
- [ ] Desktop Chrome.
- [ ] Android Chrome.
- [ ] iOS Safari.
- [ ] The app installed on the iOS home screen (B2).

**Merging and sync**
- [ ] Guest progress, then sign in: local and server marks are combined.
- [ ] A second device sees the same progress.
- [ ] Unmarking syncs across devices (B3).
- [ ] Sign out: the behaviour matches the B6 decision.

**Dates and texts**
- [ ] Week boundaries with `?date=`:
  - [ ] a Friday and a Shabbat
  - [ ] the first week
  - [ ] after the last week
  - [ ] a week with 0 chapters
- [ ] Mishnah and Tosefta load for a sample from each order. Lieberman is expected in Zeraim, Moed, Nashim and the three Bavot, with the default edition elsewhere (B5 confirms).
- [ ] Podcast: the week's episode plays; with no mapping, the whole show plays.

**Offline, app and appearance**
- [ ] Offline: the site and texts already opened still load.
- [ ] Install the PWA: icon, name and theme colour.
- [ ] Dark mode.
- [ ] Phone width (390px) and desktop width.

**API**
- [ ] With no token, `/api/progress` returns 401. A 503 means the D1 binding or `FIREBASE_PROJECT_ID` is missing.

## D. Deploying to Cloudflare

1. **D1. Find what serves mishna.kviuta.com today.** Check the Cloudflare DNS records for `kviuta.com` and any existing Pages project or Worker route. The account has one Worker, `gentle-paper-ca4a` (created 14.10); check whether it's related. Note the current setup so you can roll back.
2. **D2. Firebase** (Spark, free):
   - Create a project.
   - Authentication → enable Google.
   - Authorized domains: `mishna.kviuta.com`, `<pages-project>.pages.dev`, `localhost`.
   - Add a Web app and copy `apiKey`, `authDomain` (see B2), `projectId` and `appId` into `config.json`.
3. **D3. Create the Pages project:** Workers & Pages → Create → Pages → Connect to Git → `Yofial/yofial.github.io`.
   - Production branch: `main`
   - Root directory: `mishna-bekviuta`
   - Build command: none
   - Output directory: `.`
   - Build watch paths: include `mishna-bekviuta/**`, so changes elsewhere in the repo don't trigger builds.
4. **D4. Bindings and variables** (Settings), for both Production and Preview:
   - D1 binding: variable `DB` → `mishna-bekviuta`. For Preview, consider a separate `mishna-bekviuta-preview` database so test data stays out of production.
   - Environment variable: `FIREBASE_PROJECT_ID` = `<project-id>`.
   - Redeploy after changing bindings.
5. **D5. Test the preview URL** with checklist C3.
6. **D6. Custom domain:** Pages project → Custom domains → `mishna.kviuta.com`. Remove or replace the old DNS record or route from D1. The SSL certificate is issued automatically.
7. **D7. Decide what happens to the github.io copy:** keep it as a guest-only mirror (needs B1), or replace it with a redirect page to mishna.kviuta.com.
8. **D8. After launch:**
   - Post the new address in the WhatsApp group.
   - Watch the Function's error rate and D1 usage in the dashboard for the first week.
   - Rollback: Pages → Deployments → choose an earlier deployment → "Rollback".
   - D1 Time Travel restores the database to any point in the last 7 days on the free plan.

## Free-tier limits

These are far above what this site needs:
- **Pages:** unlimited static requests; 500 builds a month.
- **Functions:** count toward Workers' 100,000 requests a day. A progress save is debounced (one request per burst of clicks).
- **D1:** 5 GB storage, 5 million rows read and 100,000 rows written a day. Each save writes one row (about 100 bytes).
- **Firebase Auth (Spark):** Google sign-in is free.

## Decisions for you
1. A1, A2 and A4: schedule, podcast list and teen track.
2. B1 and D7: keep the github.io copy as a guest mirror, or redirect it?
3. B2: use the custom auth domain (recommended for iOS), or accept that sign-in may be unreliable there?
4. B3: the minimal sync fix or per-chapter sync?
5. B6: should sign-out clear progress from the device?
6. D4: a separate preview database?
