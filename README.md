# MOSMED Website

Static, single-page trilingual website for MOSMED — a Yerevan-based medical equipment distributor.

## File structure

```
mosmed/
├── index.html          — page structure (no hardcoded user-facing text)
├── css/styles.css      — all styles; CSS custom properties at :root
├── js/translations.js  — every user-facing string in AM / RU / EN
├── js/main.js          — language switching, animations, mobile nav
├── assets/
│   ├── logo.png        — MOSMED logo (replace with actual file)
│   └── founder.jpg     — founder portrait (replace with actual photo)
└── README.md
```

---

## How to fill in placeholder content

### 1. Founder bio
Open `js/translations.js` and replace the values for these keys:
- `founder_name` — full name in each language
- `founder_title` — title, specialisation, credentials
- `founder_p1` — first biography paragraph
- `founder_p2` — second biography paragraph
- `founder_quote` — the pull-quote (keep the quotation marks)

Also update the `<a href="mailto:...">` and `<a href="tel:...">` attributes in `index.html` once you have the real addresses.

### 2. Phone & email
In `js/translations.js` update:
- `contact_phone` — e.g. `"+374 10 123456"` in all three languages
- `contact_email` — e.g. `"info@mosmed.am"` in all three languages

Then in `index.html` update the `href` attributes:
```html
<a href="tel:+37410123456" ...>
<a href="mailto:info@mosmed.am" ...>
```

### 3. Logo & portrait
Drop the actual files into `/assets/`:
- `logo.png` — the MOSMED logo (also works with `logo.svg`)
- `founder.jpg` — a professional portrait photo (3:4 ratio recommended)

---

## How to change colors

All colors are CSS custom properties in `css/styles.css` at the top of the file under `:root`. Change the hex values there — the rest of the site updates automatically:

```css
:root {
  --color-amber:      #E59A3C;  /* primary accent */
  --color-amber-dark: #C8821E;  /* hover state */
  --color-slate:      #3C4A5A;  /* headings & dark text */
  --color-cream:      #F1EBDC;  /* main background */
  --color-white:      #FFFFFF;  /* card surfaces */
  /* ... */
}
```

---

## How to add or edit translations

Every string lives in `js/translations.js` as a key with three values:

```js
hero_tagline: {
  en: "Robotic technologies in medicine",
  ru: "Роботизированные технологии в медицине",
  am: "Ռոբոտային տեխնոլոգիաները բժշկության մեջ",
},
```

To add a new string:
1. Add a new key to `translations.js`
2. Add `data-i18n="your_key"` to the HTML element

---

## Deployment

The site is a plain static folder — no build step needed.

**Netlify / Vercel:** Drag and drop the `mosmed/` folder, or connect the GitHub repo. No build command, publish directory is `/` (or `mosmed/` if the repo root differs).

**GitHub Pages:** Push to a repo, go to Settings → Pages, set source to the branch root or `/docs` folder.

**Local preview:** Open `index.html` in a browser, or run any static server:
```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## Notes on typography

Cormorant Garamond (the heading font) does not include Armenian or Cyrillic glyphs. The CSS automatically falls back to Noto Serif for `<html lang="hy">` (Armenian) and `<html lang="ru">` (Russian) headings, so AM and RU text always renders cleanly.
