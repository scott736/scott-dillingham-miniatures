# Workshop

Workshop is the maker page. A visitor reads how a piece is built and sees the workshop photograph.

## Sub-features

- `workshop-load` shows `The Maker's Workshop` and the supporting line `Where raw hardwood becomes miniature art`.
- `workshop-from-home` follows `See the Workshop` from the home hero.
- `workshop-nav` follows `Workshop` in the header.
- `workshop-related` lists workshop guides under `Workshop Guides`.

## How to get to it (user POV)

- Choose `Workshop` in the header nav.
- Choose `See the Workshop` on the home hero.
- Open `/workshop`.
- Choose `Inside the Workshop` from a blog post CTA.

## Driving it with verify-miniatures

Preconditions:

- Doctor reports the expected loopback URL.

- **Open workshop.** Go to `/workshop`. Run `vm browser goto /workshop`. The heading is `The Maker's Workshop`.
- **HTTP view.** Run `vm get /workshop --assert-status 200 --assert-contains "The Maker's Workshop" --out workshop/http-workshop.html`. Status is 200. The body includes `How the Miniatures Are Made` in the title or the heading, and `/images/hero/hero-workshop.webp`.
- **Home entry.** From `/`, choose `See the Workshop`. Run `vm browser goto /` and `vm browser click --role link --name "See the Workshop" --wait "The Maker's Workshop"`. The heading matches.
- **Nav entry.** From `/`, choose `Workshop`. Run `vm browser click --role link --name Workshop --wait "The Maker's Workshop"`. Same heading.
- **Related guides.** Snapshot the page. Run `vm browser snapshot --path workshop/page.json`. A heading `Workshop Guides` is present, or a link such as `Miniature Woodworking for Beginners` points at `/blog/miniature-woodworking-for-beginners`.
- **Proof.** Screenshot the hero. Run `vm browser screenshot --path workshop/hero.png`. The image alt `Scott Dillingham's miniature furniture workshop where museum-quality 1/12 scale handcrafted pieces are built` is in the HTTP body. The snapshot heading is `The Maker's Workshop`.

## Gotchas

- The hero island is `client:idle`. Wait for `The Maker's Workshop`, not a fixed sleep.
- The document title is `How the Miniatures Are Made | Scott Dillingham Miniatures`. The visible `h1` is `The Maker's Workshop`. Assert the `h1` for visitor proof. Raw HTML encodes that `h1` as `The Maker&#x27;s Workshop`. `get --assert-contains "The Maker's Workshop"` still matches because the helper decodes entities. `How Miniature Furniture Is Made` is not the title.
- Process steps such as `Design & Research` ship in JSON-LD even if the process island has not scrolled into view. Visible proof needs a screenshot or snapshot of on-screen text, not only the script tag.
- `See the Workshop` is a home-hero control. It is not in the header.
