# Gallery

Gallery is `/gallery/`. A visitor browses The Collection, reads a piece card, opens Quick view, or follows the title into the piece page at `/gallery/<id>/`.

## Sub-features

- `gallery-index` renders all seven `GALLERY_ITEMS` under `The Collection`.
- `gallery-card` shows title (piece-page link), truncated description, `Read more`, `Quick view`, and `Read Similar Story`.
- `gallery-availability` shows `Available`, `Commission only`, or `Museum collection`. Available pieces also show `Price on request. Ask about deposit and lead time.`
- `gallery-lightbox` opens from `Quick view`; the dialog title is the piece name and the close control is `Close`.
- `gallery-piece` is the prerendered page `/gallery/<id>/` with the piece H1.
- `gallery-anchor` still identifies each card via `/gallery/#<id>`.
- `gallery-related` follows `Read Similar Story` to the piece's `relatedPost`.

## How to get to it (user POV)

- Choose header `Gallery` (`/gallery/`).
- Choose home `See what's available` or `View Full Gallery`.
- Choose footer Explore `Gallery`.
- Open a piece page such as `/gallery/tall-case-clock/` or a leftover hash `/gallery/#tall-case-clock`.
- Choose `Explore the Gallery` on a blog article (`Continue Your Journey`) or on the 404 page.

## Driving it with curl/Playwright

Preconditions:

- Doctor reports 200 on `/` and `/gallery/`.
- Viewport ≥ 768px so header `Gallery` is visible.
- Evidence dir is `.cursor/skills/verify-scott-dillingham-miniatures/evidence/gallery/`.

- **Start on home.** Run `curl -sS -D evidence/gallery/before.headers.txt -o evidence/gallery/before.html http://127.0.0.1:4318/`. Status `200`. Body contains `See what's available` and `Extraordinary Craft`.
- **Open gallery (HTTP).** Follow the user route. Run `curl -sS -D evidence/gallery/after.headers.txt -o evidence/gallery/after.html http://127.0.0.1:4318/gallery/`. Status `200`. `<title>` contains `Miniature Furniture Gallery`. Body contains `The Collection`, `id="tall-case-clock"`, `Simon Willard Tall Case Clock Style`, `Museum collection`, `Queen Anne Style Highboy`, `Price on request. Ask about deposit and lead time.`, `Shaker Style Pencil Post Bed`, `Sam Maloof Style Rocking Chair`, `Hepplewhite Shield Back Style Chair`, `Thomas Moser Continuous Arm Style Chair`, `Shaker Style D-Ring Table`, `Commission only`, `Quick view`, `data-gallery-open="tall-case-clock"`, `href="/gallery/tall-case-clock/"`, and `Collector&#39;s Library` (the visible heading is `Collector's Library`).
- **Open gallery (browser).** From home, click the link named `See what's available` or the header link named `Gallery`. The URL is `/gallery/` and the H1 is `The Collection`.
- **Piece card.** The first card is `article#tall-case-clock`. Status is `Museum collection`. Its title is an `<h2><a href="/gallery/tall-case-clock/">`. Description is truncated; `Read more` is a `<details>` summary. `Quick view` is `button[data-gallery-open="tall-case-clock"]`. `Read Similar Story` goes to `/blog/miniature-tall-case-clocks/`. `#highboy-dresser` is `Available` and includes `Price on request. Ask about deposit and lead time.`
- **Open lightbox.** Click `Quick view` on `#tall-case-clock`. A `<dialog id="gallery-lightbox">` opens. The title is `#gallery-lightbox-title` (a `<p>`, not a heading) with text `Simon Willard Tall Case Clock Style`. Close control is `button[aria-label="Close"]`. `[data-gallery-price]` stays `hidden` on museum/commission pieces. The page URL stays `/gallery/`.
- **Close lightbox.** Click `Close` or press Escape. `#gallery-lightbox` has `open === false` and `#tall-case-clock` is still on the page. After close, `getByRole('dialog')` may not match; query `#gallery-lightbox`.
- **Open piece page.** Click the card title. URL is `/gallery/tall-case-clock/`. H1 is `Simon Willard Tall Case Clock Style`. HTTP: `curl -sS -D evidence/gallery/piece.headers.txt -o evidence/gallery/piece.html http://127.0.0.1:4318/gallery/tall-case-clock/`. Status `200`. Body contains that H1, `Museum collection`, and `Read the related guide`.
- **Proof.** Keep `before.html` (`/`) and `after.html` (`/gallery/`). If the lightbox was opened, also save `lightbox.after.png` or `lightbox.after.aria.txt` showing the dialog title. Record feature id `gallery`.

Playwright sketch (localhost only, after launch):

```js
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://127.0.0.1:4318/');
await page.getByRole('link', { name: "See what's available" }).click();
await page.getByRole('heading', { name: 'The Collection' }).waitFor();
await page.locator('#tall-case-clock').getByRole('button', { name: 'Quick view' }).click();
const dialog = page.locator('#gallery-lightbox');
await dialog.locator('#gallery-lightbox-title').waitFor();
```

## Gotchas

- Piece pages exist at `/gallery/<id>/` via `src/pages/gallery/[id].astro`. The card title and photo go there. Lightbox is `Quick view`, not the title link. Clicking the title leaves `/gallery/`.
- Home highlights also go to `/gallery/<id>/`. That path proves `gallery-piece`, not `gallery-lightbox`. Card `id`s still support `/gallery/#<id>`.
- Bare `/gallery` (no trailing slash) is 404 on local `astro dev`. Use `/gallery/`. Production `public/_redirects` may 301 the slashless path; this skill does not drive production.
- Lightbox JS is an inline script on `gallery.astro` (`data-gallery-open`). HTML still contains titles after prerender; the open dialog needs JS. Do not wait for a heading inside the dialog — the title is a `<p>`.
- `Previous image` / `Next image` are always in the dialog markup with class `hidden`. JS unhides them only when `images.length > 1` (none of the current `GALLERY_ITEMS` do).
- `Read more` is always rendered as a `<details>` summary (copy is lowercase `more`). There is no `Read Less` control.
- Status labels use Tailwind `uppercase`. The HTML text node is `Museum collection` / `Available` / `Commission only`; Playwright `innerText` is `MUSEUM COLLECTION` / `AVAILABLE` / `COMMISSION ONLY`. Assert `textContent` or match case-insensitively.
- Trailing slashes are required on this site (`trailingSlash: 'always'`). Assert `/gallery/` and `/gallery/tall-case-clock/` rather than slashless paths.
- Inquire/Commission CTAs on a card go to `/contact/?subject=…&piece=…` for available/museum pieces and `/commissions/?piece=…` for commission-only pieces. Do not POST those forms as gallery proof.
