# Gallery

Gallery is `/gallery/`. A visitor browses The Collection, reads a piece card, opens the piece lightbox, and can follow `Read Similar Story` into a related article.

## Sub-features

- `gallery-index` renders all seven `GALLERY_ITEMS` under `The Collection`.
- `gallery-card` shows title, truncated description, `Read more`, and `Read Similar Story`.
- `gallery-lightbox` opens a dialog whose title is the piece name and whose close control is `Close`.
- `gallery-anchor` scrolls to a card via `/gallery/#<id>`.
- `gallery-related` follows `Read Similar Story` to the piece's `relatedPost`.

## How to get to it (user POV)

- Choose header `Gallery` (`/gallery/`).
- Choose home `Explore the Gallery` or `View Full Gallery`.
- Choose footer Explore `Gallery`.
- Open a piece hash such as `/gallery/#tall-case-clock`.
- Choose `Explore the Gallery` on a blog article (`Continue Your Journey`) or on the 404 page.

## Driving it with curl/Playwright

Preconditions:

- Doctor reports 200 on `/` and `/gallery/`.
- Viewport ≥ 768px so header `Gallery` is visible.
- Evidence dir is `.cursor/skills/verify-scott-dillingham-miniatures/evidence/gallery/`.

- **Start on home.** Run `curl -sS -D evidence/gallery/before.headers.txt -o evidence/gallery/before.html http://127.0.0.1:4318/`. Status `200`. Body contains `Explore the Gallery` and `Extraordinary Craft`.
- **Open gallery (HTTP).** Follow the user route. Run `curl -sS -D evidence/gallery/after.headers.txt -o evidence/gallery/after.html http://127.0.0.1:4318/gallery/`. Status `200`. `<title>` contains `Miniature Furniture Gallery`. Body contains `The Collection`, `id="tall-case-clock"`, `Simon Willard Tall Case Clock Style`, `Queen Anne Style Highboy`, `Shaker Style Pencil Post Bed`, `Sam Maloof Style Rocking Chair`, `Hepplewhite Shield Back Style Chair`, `Thomas Moser Continuous Arm Style Chair`, `Shaker Style D-Ring Table`, and `Collector&#39;s Library` (the visible heading is `Collector's Library`).
- **Open gallery (browser).** From home, click the link named `Explore the Gallery` or the header link named `Gallery`. The URL is `/gallery/` and the H1 is `The Collection`.
- **Piece card.** The first card is `article#tall-case-clock`. Its title is an `<a data-gallery-open="tall-case-clock">` whose name is `Simon Willard Tall Case Clock Style`. Description is truncated; `Read more` is a `<details>` summary. `Read Similar Story` goes to `/blog/miniature-tall-case-clocks/`.
- **Open lightbox.** Click the title link `Simon Willard Tall Case Clock Style`. A `<dialog id="gallery-lightbox">` opens. The title is `#gallery-lightbox-title` (a `<p>`, not a heading) with text `Simon Willard Tall Case Clock Style`. Close control is `button[aria-label="Close"]`. The page URL stays `/gallery/`.
- **Close lightbox.** Click `Close` or press Escape. The dialog is gone and `#tall-case-clock` is still on the page.
- **Proof.** Keep `before.html` (`/`) and `after.html` (`/gallery/`). If the lightbox was opened, also save `lightbox.after.png` or `lightbox.after.aria.txt` showing the dialog title. Record feature id `gallery`.

Playwright sketch (localhost only, after launch):

```js
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://127.0.0.1:4318/');
await page.getByRole('link', { name: 'Explore the Gallery' }).click();
await page.getByRole('heading', { name: 'The Collection' }).waitFor();
await page.locator('#tall-case-clock').getByRole('link', { name: 'Simon Willard Tall Case Clock Style' }).click();
const dialog = page.getByRole('dialog');
await dialog.locator('#gallery-lightbox-title').waitFor();
```

## Gotchas

- There is no `/gallery/<slug>` route. A piece is a card `id` plus an in-page dialog.
- Bare `/gallery` (no trailing slash) is 404. Use `/gallery/`.
- Home highlight titles also go to `/gallery/#<id>`. That path proves the hash, not `gallery-lightbox`.
- Lightbox JS is an inline script on `gallery.astro` (`data-gallery-open`). HTML still contains titles after prerender; the open dialog needs JS. Do not wait for a heading inside the dialog — the title is a `<p>`.
- Most pieces have one image. `Previous image` / `Next image` only exist when `images.length > 1` (none of the current `GALLERY_ITEMS` do).
- `Read more` is always rendered as a `<details>` summary (copy is lowercase `more`). There is no `Read Less` control.
- Trailing slashes are required on this site (`trailingSlash: 'always'`). Assert `/gallery/` rather than a slashless path.
