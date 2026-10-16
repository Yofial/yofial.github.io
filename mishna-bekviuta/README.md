# משנה בקביעותא

אתר התוכנית: לוח שבועי, טקסט המשנה והתוספתא (נוסח ליברמן) מספריא, שיעורי הפודקאסט, ומעקב התקדמות אישי.
אורחים שומרים במכשיר; מי שמתחבר עם Google שומר בחשבון (Firebase Auth + Cloudflare D1). הכול בתוכניות החינמיות.

## עריכה שוטפת (בלי לגעת בקוד)

| קובץ | מה יש בו |
|---|---|
| `config.json` | הקדשה, מחזור, טקסט הרקע, קישורים (וואטסאפ, פודקאסט, הלוח המלא), הגדרות Firebase |
| `schedule.json` | הלוח: לכל שבוע תאריך השבת, הפרשה, התאריך העברי ו־`chapters` = כמה פרקים לומדים באותו שבוע (ברצף לפי סדר המשנה) |
| `episodes.json` | שיוך שיעורי הפודקאסט לפרקים: `from`/`to` כמו `"ברכות 1"` ו־`spotify` = קישור לפרק בספוטיפיי |

אפשר לערוך את הקבצים ישירות ב-GitHub; Cloudflare מעלה את האתר מחדש אוטומטית.

## הקמה ב-Cloudflare Pages (פעם אחת)

1. **Pages › Create › Connect to Git** ← הרפו הזה. Build command: ריק. Build output directory: `.`. Root directory: `mishna-bekviuta`.
2. **Settings › Bindings › D1 database**: שם המשתנה `DB` ← מסד הנתונים `mishna-bekviuta` (כבר נוצר, כולל הטבלה; הסכמה ב-`schema.sql`).
3. **Settings › Variables**: `FIREBASE_PROJECT_ID` = מזהה פרויקט ה-Firebase.
4. **Custom domains**: `mishna.kviuta.com`.

## Firebase (התחברות עם Google)

1. ב-[Firebase Console](https://console.firebase.google.com) יוצרים פרויקט (תוכנית Spark החינמית) ← Authentication ← מפעילים Google.
2. Authentication › Settings › Authorized domains: מוסיפים `mishna.kviuta.com`.
3. Project settings › Your apps › Web app ← מעתיקים `apiKey`, `authDomain`, `projectId`, `appId` אל `config.json` תחת `firebase`.

כל עוד `apiKey` ריק, האתר עובד במצב אורח בלבד.

## מבנה

- `index.html`, `style.css`, `app.js` – האתר (ללא שלב build).
- `functions/api/progress.js` – ‏GET/PUT להתקדמות; מאמת את טוקן ה-Firebase ושומר ב-D1.
- `sw.js`, `manifest.webmanifest`, אייקונים – PWA (התקנה למסך הבית, עבודה גם בלי רשת לטקסטים שכבר נפתחו).
- ההתקדמות נשמרת כ־bitset של 525 פרקים, באותו קידוד ובאותו מפתח `localStorage` כמו בגרסה הקודמת, כך שהתקדמות קיימת נשמרת.
- בדיקה של שבוע אחר: `?date=2027-01-05` בכתובת.
