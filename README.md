# The Mansour — 더 만수르

Premium corporate website for The Mansour, a Middle East market entry consulting and marketing service operated by Sanad Partners.

## Project Structure

```
the-mansour/
├── index.html          # Home / Landing page
├── consulting.html     # Consulting service page
├── marketing.html      # Marketing service page
├── vercel.json         # Vercel deployment config
├── css/
│   └── style.css       # Complete design system & styles
├── js/
│   ├── i18n.js         # Internationalization (KO/EN/JA/ZH/AR)
│   └── app.js          # Main application logic & form handling
├── assets/             # Images, icons (add later)
└── reports/            # PDF reports (add later)
```

## Tech Stack

- **Pure HTML/CSS/JS** — No build step required
- **CSS Custom Properties** — Design token system
- **Vanilla JS** — i18n, scroll animations, form handling
- **Google Fonts** — Cormorant Garamond, Inter, Noto Sans family

## Deployment

### 1. GitHub

```bash
git init
git add .
git commit -m "Initial commit: The Mansour website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/the-mansour.git
git push -u origin main
```

### 2. Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New... → Project"**
3. Import the `the-mansour` repository
4. Framework Preset: **Other** (no framework needed)
5. Click **Deploy**
6. Done. Your site is live at `https://the-mansour.vercel.app`

### 3. Custom Domain

1. In Vercel dashboard → Settings → Domains
2. Add your purchased domain
3. Update DNS records:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com` (for www)
4. Vercel handles SSL automatically

## Webhook / Form Integration

### Newsletter (Mailchimp via Make.com)

1. Create a Make.com scenario:
   - Trigger: **Webhook** (Custom webhook)
   - Action: **Mailchimp → Add/Update Subscriber**
2. Copy the webhook URL
3. In `js/app.js`, find `handleSubscribe()` and replace:
   ```js
   const WEBHOOK_URL = null; // ← Replace with your Make.com webhook URL
   ```

### Consulting Inquiry (Google Sheets via GAS)

1. Create a Google Sheet with columns: Company, Name, Email, Country, Services, Budget, Details, Lang, Timestamp
2. Deploy a Google Apps Script web app:
   ```js
   function doPost(e) {
     const data = JSON.parse(e.postData.contents);
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     sheet.appendRow([
       data.company, data.name, data.email, data.country,
       data.services.join(', '), data.budget, data.details,
       data.lang, data.timestamp
     ]);
     return ContentService.createTextOutput('OK');
   }
   ```
3. In `js/app.js`, find `handleInquiry()` and replace:
   ```js
   const WEBHOOK_URL = null; // ← Replace with your GAS web app URL
   ```

### Marketing Inquiry

Same process as consulting inquiry — separate GAS endpoint or Make.com webhook.

## Languages Supported

| Code | Language | Direction |
|------|----------|-----------|
| ko   | 한국어    | LTR       |
| en   | English  | LTR       |
| ja   | 日本語    | LTR       |
| zh   | 中文      | LTR       |
| ar   | العربية  | RTL       |

To add more languages, add entries to the `TRANSLATIONS` object in `js/i18n.js`.

## Adding Reports

1. Upload PDF reports to the `reports/` folder or host on GitHub
2. Update the report card `href` attributes in the HTML
3. To add new report cards, copy an existing `report-card` div and update:
   - `data-i18n` keys (add corresponding translations in `i18n.js`)
   - Or directly edit the text content

## Design System

### Colors
- **Navy**: `#0f1729` (primary dark)
- **Charcoal**: `#1a1a1a` (text)
- **Gold (muted)**: `#b8a07e` (accent)
- **Warm White**: `#fafaf8` (background)

### Typography
- **Display**: Cormorant Garamond (headings)
- **Body**: Inter (paragraphs, UI)
- **CJK/Arabic**: Noto Sans family

### Key CSS Classes
- `.section` — Standard section padding
- `.section--dark` — Dark background variant
- `.container` — Max-width centered container
- `.fade-in` — Scroll-triggered fade animation
- `.stagger` — Staggered children animation
