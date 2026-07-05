# Menu Safe Lens - Codex handoff

This package splits the single-file prototype into production-ready static files.

Production URL: https://mainitiworakunisuru.com/

## Files

- `index.html` - production entry. No demo data is loaded.
- `preview.html` - UI preview entry. Loads demo config and demo data.
- `assets/css/styles.css` - all styles moved out of HTML.
- `assets/js/app.js` - app behavior, loaded with `defer`.
- `assets/js/config.js` - production config placeholder.
- `assets/js/config.preview.js` - preview-only demo config.
- `assets/js/demo-data.js` - preview-only analysis data.

## Performance changes already done

- Removed the large inline `<style>` block from HTML.
- Removed the large inline `<script>` block from HTML.
- Moved demo analysis data out of the production JS path.
- CSS is preloaded and then loaded as a stylesheet.
- JS is loaded with `defer`, so it does not block HTML parsing.
- Production page does not load demo data.
- Relative paths are used so this can be opened locally or deployed as static files.

## Production tasks for Codex

1. Connect the real analysis API in `assets/js/config.js` by setting:

```js
window.MENU_SAFE_LENS_API = 'https://YOUR_DOMAIN/api/analyze-menu';
```

2. Connect Stripe Checkout by setting:

```js
window.MENU_SAFE_LENS_STRIPE_URL = 'https://YOUR_STRIPE_CHECKOUT_URL';
```

3. Do not expose Gemini, OpenAI, Google Cloud, or Stripe secret keys in the browser. Use a backend route or Cloudflare Worker.

4. Keep `preview.html`, `config.preview.js`, and `demo-data.js` out of production deployment if the public product should not include demo mode.

5. Serve static files with long cache headers for CSS/JS and Brotli or gzip compression.

Recommended cache policy:

```txt
/assets/css/styles.css  Cache-Control: public, max-age=31536000, immutable
/assets/js/app.js       Cache-Control: public, max-age=31536000, immutable
index.html              Cache-Control: no-cache
```

For immutable caching, add hashed filenames during a build step, for example `styles.abc123.css` and `app.abc123.js`.

## Recommended backend contract

`POST /api/analyze-menu`

Request:

```json
{
  "image": "base64-or-file-url",
  "profile": {
    "allergies": ["wheat", "egg"],
    "foodRules": ["halal", "no_pork"],
    "strictness": "careful",
    "severeAllergyMode": true,
    "currency": "USD"
  }
}
```

Response should match the shape used by `window.MENU_SAFE_LENS_DEMO_DATA` in `assets/js/demo-data.js`.

Important response rules:

- Use only `avoid`, `ask_staff`, or `no_obvious_issue` as result levels.
- Never return `safe`.
- Always include `foundOnMenu`, `hiddenRisk`, and `whatToDo` where possible.
- If the image is unreadable, return a clear error state instead of guessed dishes.
- For severe allergy mode, prefer `ask_staff` when hidden ingredients or cross-contact cannot be confirmed.
