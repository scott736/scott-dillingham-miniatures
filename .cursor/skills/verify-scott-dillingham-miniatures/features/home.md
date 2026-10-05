# Home

Home is the marketing landing page at `/`. A visitor reads the hero, sees gallery highlights and FAQ, then follows a CTA into the gallery, commissions, visit, workshop, blog, or contact.

## Sub-features

- `home-hero` shows the speakable title and the two hero CTAs.
- `home-highlights` lists the first four `GALLERY_ITEMS` under `Gallery Highlights`.
- `home-faq` shows Frequently Asked Questions; the first item starts open.
- `home-blog-preview` lists the three newest posts under `From the Workshop Journal`.
- `home-footer-cta` offers `Start a Commission` to `/commissions/`.

## How to get to it (user POV)

- Open `http://127.0.0.1:4318/` or `http://127.0.0.1:4318`.
- Choose the logo `Scott Dillingham Miniatures` from any page.
- Choose footer Explore links that return to `/` only via the logo (there is no `Home` nav item).

## Driving it with curl/Playwright

Preconditions:

- Doctor reports 200 on `http://127.0.0.1:4318/`.
- Viewport ≥ 768px if using the desktop header.

- **Open home.** Request the landing page. Run `curl -sS -D evidence/home/before.headers.txt -o evidence/home/before.html http://127.0.0.1:4318/`. Status `200`. Body contains `data-speakable="title"`, `Miniature Furniture,`, `Extraordinary Craft`, link text `See what's available` (`href="/gallery/"`; raw HTML may be `See what&#39;s available`), and `Commission a piece` (`href="/commissions/"`).
- **Confirm identity.** The `<title>` is `Scott Dillingham Miniatures | Handcrafted 1/12 Scale Furniture`. The logo `img` alt is `Scott Dillingham Miniatures`.
- **Highlights.** The same body contains `Gallery Highlights`, `Simon Willard Tall Case Clock Style`, `Queen Anne Style Highboy`, `Shaker Style Pencil Post Bed`, `Sam Maloof Style Rocking Chair`, and `View Full Gallery` (`href="/gallery/"`). Highlight titles link to `/gallery/<id>/` (for example `/gallery/tall-case-clock/`).
- **FAQ.** Body contains `Frequently Asked Questions` and `What scale are your miniature furniture pieces?` inside `[data-speakable="faq-question"]`. The first `<details class="faq-item">` has `open`.
- **Workshop CTA.** Body contains `Explore the Workshop` (`href="/workshop/"`).
- **Follow gallery CTA.** Choose `See what's available`. In a browser: click the link with that name. With HTTP: `curl -sS -D evidence/home/after.headers.txt -o evidence/home/after.html http://127.0.0.1:4318/gallery/`. Status `200`. After body contains an `h1` `The Collection` and does not use the home H1 `Extraordinary Craft` as the page title.
- **Proof.** `before.html` is `/` with the hero H1. `after.html` is `/gallery/` with the `h1` `The Collection`. Record feature id `home` in `drive.log.txt`.

## Gotchas

- Highlight titles such as `Simon Willard Tall Case Clock Style` on home link to `/gallery/tall-case-clock/`, not `/gallery/#tall-case-clock` and not related blog slugs. Opening a highlight is piece-page proof, not lightbox proof. Home also uses `The Collection` as a highlights eyebrow; assert the gallery `h1`, not that substring alone.
- `See what's available` and `View Full Gallery` are the home-to-gallery user paths. `Explore the Gallery` is the 404 / article-journey label, not a home CTA. Bare `/gallery` (no trailing slash) is 404 on local `astro dev`.
- `See the Workshop` does not exist. The in-page workshop CTA is `Explore the Workshop`.
- Header `Commission a Piece` and home `Start a Commission` both go to `/commissions/`, not `/contact/`.
- The speakable description links `KSB Miniatures Collection, Maysville, Kentucky` to `/visit/` and `{n} pieces available` to `/gallery/`. Do not hardcode the available count.
- Footer `Terms of Service` (`/terms-of-service/`) and `Privacy Policy` (`/privacy-policy/`) are real MDX pages. `GET` each with the trailing slash returns 200 with those titles. They are not the 404 heading `Even at 1:12 Scale,`.
- Astro may keep the URL while HTML swaps. After a click, wait for the destination heading, not only a URL change.
