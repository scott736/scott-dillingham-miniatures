# Home

Home is the marketing landing page at `/`. A visitor reads the hero, sees gallery highlights and FAQ, then follows a CTA into the gallery, workshop, blog, or contact.

## Sub-features

- `home-hero` shows the speakable title and the two hero CTAs.
- `home-highlights` lists the first four `GALLERY_ITEMS` under `Gallery Highlights`.
- `home-faq` shows Frequently Asked Questions; the first item starts open.
- `home-blog-preview` lists the three newest posts under `From the Workshop Journal`.
- `home-footer-cta` offers `Start a Commission` to `/contact`.

## How to get to it (user POV)

- Open `http://127.0.0.1:4318/` or `http://127.0.0.1:4318`.
- Choose the logo `Scott Dillingham Miniatures` from any page.
- Choose footer Explore links that return to `/` only via the logo (there is no `Home` nav item).

## Driving it with curl/Playwright

Preconditions:

- Doctor reports 200 on `http://127.0.0.1:4318/`.
- Viewport ≥ 768px if using the desktop header.

- **Open home.** Request the landing page. Run `curl -sS -D evidence/home/before.headers.txt -o evidence/home/before.html http://127.0.0.1:4318/`. Status `200`. Body contains `data-speakable="title"`, `Miniature Furniture,`, `Extraordinary Craft`, link text `Explore the Gallery` (`href="/gallery"`), and `See the Workshop` (`href="/workshop"`).
- **Confirm identity.** The `<title>` is `Scott Dillingham Miniatures | Handcrafted 1/12 Scale Furniture`. The logo `img` alt is `Scott Dillingham Miniatures`.
- **Highlights.** The same body contains `Gallery Highlights`, `Simon Willard Tall Case Clock Style`, `Queen Anne Style Highboy`, `Shaker Style Pencil Post Bed`, `Sam Maloof Style Rocking Chair`, and `View Full Gallery` (`href="/gallery"`).
- **FAQ.** Body contains `Frequently Asked Questions` and `What scale are your miniature furniture pieces?` inside `[data-speakable="faq-question"]`. The first `<details class="faq-item">` has `open`.
- **Follow gallery CTA.** Choose `Explore the Gallery`. In a browser: click the link with that name. With HTTP: `curl -sS -D evidence/home/after.headers.txt -o evidence/home/after.html http://127.0.0.1:4318/gallery`. Status `200`. After body contains `The Collection` and does not use the home H1 `Extraordinary Craft` as the page title.
- **Proof.** `before.html` is `/` with the hero H1. `after.html` is `/gallery` with `The Collection`. Record feature id `home` in `drive.log.txt`.

## Gotchas

- Highlight titles such as `Simon Willard Tall Case Clock Style` on home link to related **blog** slugs (`/blog/miniature-tall-case-clocks`), not `/gallery#tall-case-clock`. Opening a highlight is not gallery proof.
- `Explore the Gallery` and `View Full Gallery` are the home-to-gallery user paths.
- Footer `Terms of Service` (`/terms-of-service`), `Privacy Policy` (`/privacy-policy`), and `Image License` (`/image-license`) are real MDX pages. `GET` each returns 200 with those titles. They are not the 404 heading `Even at 1:12 Scale,`. Header `About` (`/about`, `Meet the Maker`) is a separate page, not a home recipe.
- Astro may keep the URL while HTML swaps. After a click, wait for the destination heading, not only a URL change.
