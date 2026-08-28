# Home

Home is the landing page. A visitor reads the hero, opens an FAQ, and reaches the gallery or workshop from the hero CTAs.

## Sub-features

- `home-load` shows the brand, hero heading, and primary CTA.
- `home-faq` expands a closed FAQ item.
- `home-gallery-cta` follows Explore the Gallery to the collection.
- `home-workshop-cta` follows See the Workshop to the workshop page.
- `home-theme` toggles `html.dark` from the theme button.

## How to get to it (user POV)

- Open `/`.
- Choose the logo `Scott Dillingham Miniatures`.
- Land on `/` from an external link.

## Driving it with verify-miniatures

Preconditions:

- Doctor reports the expected loopback URL.
- Viewport is 1280x800 unless a step says otherwise.

- **Open home.** Go to `/`. Run `vm browser goto /`. The heading text includes `Miniature Furniture` and `Extraordinary Craft`. The document title includes `Scott Dillingham Miniatures`.
- **HTTP view.** Fetch the document. Run `vm get / --assert-status 200 --assert-contains "Miniature Furniture" --out home/http-home.html`. Status is 200 and the saved body includes the hero heading and `Explore the Gallery`.
- **FAQ.** The first item `What scale are your miniature furniture pieces?` is already open. Choose a later summary, for example `Are these made from kits?`. Run `vm browser click --selector "details.faq-item:nth-of-type(2) summary" --wait "Absolutely not"`. The second details item is open and the answer starts with `Absolutely not`.
- **Gallery CTA.** Choose `Explore the Gallery`. Run `vm browser click --role link --name "Explore the Gallery" --wait "The Collection"`. The heading `The Collection` appears and a piece title `Simon Willard Tall Case Clock Style` is present.
- **Workshop CTA.** Return to `/`, then choose `See the Workshop`. Run `vm browser goto /` and `vm browser click --role link --name "See the Workshop" --wait "The Maker's Workshop"`. The heading is `The Maker's Workshop`.
- **Theme.** Choose `Toggle theme`. Run `vm browser click --role button --name "Toggle theme"` then `vm browser eval document.documentElement.classList.contains('dark')`. The boolean flips from the pre-click value.
- **Proof.** Capture home before the gallery click and the gallery after it. Run `vm browser screenshot --path home/01-home.png` on `/` and `vm browser screenshot --path home/02-gallery.png` after the CTA. Both snapshots include the brand or the page heading. `GET /gallery` still contains `The Collection`.

## Gotchas

- `Explore the Gallery` also exists on the 404 page. Start this recipe from `/` or the click is a different entry point.
- `Start a Commission` lives in the page footer CTA, not the hero. Hero proof is `Explore the Gallery`.
- FAQ items are native `details`. The first item is open on load. Assert a later item when you prove expand.
- Theme uses a view transition. Assert `document.documentElement.classList.contains('dark')`, not the button SVG.
- Desktop nav is `md:flex`. Do not look for `Open main menu` at 1280px.
