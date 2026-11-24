# Gallery

Gallery is the collection. A visitor scans the seven pieces, opens Quick view, and follows a related story when they want one.

## Sub-features

- `gallery-load` shows `The Collection` and all seven piece titles.
- `gallery-open` opens the lightbox from `Quick view`.
- `gallery-close` dismisses the lightbox with `Close`.
- `gallery-read-more` expands a truncated description on a card.
- `gallery-related` follows `Read Similar Story` into a blog post.

## How to get to it (user POV)

- Choose `Gallery` in the header nav.
- Choose `See what's available` on the home hero, or `Explore the Gallery` on the 404 / article journey.
- Open `/gallery/` or `/gallery/#tall-case-clock`.

## Driving it with verify-miniatures

Preconditions:

- Doctor reports the expected loopback URL.
- `vm browser start` is running at 1280x800.

- **Open gallery.** Go to `/gallery/`. Run `vm browser goto /gallery/`. The heading is `The Collection`.
- **HTTP view.** Run `vm get /gallery/ --assert-status 200 --assert-contains "The Collection" --out gallery/http-gallery.html`. The body includes `/images/gallery/tall-case-clock.webp` and `/images/gallery/maloof-rocking-chair.webp`.
- **Piece titles.** Snapshot the page. Run `vm browser snapshot --path gallery/grid.json`. Headings or links include `Simon Willard Tall Case Clock Style`, `Queen Anne Style Highboy`, `Shaker Style Pencil Post Bed`, `Sam Maloof Style Rocking Chair`, `Hepplewhite Shield Back Style Chair`, `Thomas Moser Continuous Arm Style Chair`, and `Shaker Style D-Ring Table`.
- **Open lightbox.** Choose `Quick view` on `#tall-case-clock`. Run `vm browser click --selector "#tall-case-clock [data-gallery-open]" --wait "Simon Willard Tall Case Clock Style"`. A dialog `#gallery-lightbox` is open. `vm browser eval document.querySelector('#gallery-lightbox')?.open === true` is true.
- **Close lightbox.** Choose `Close`. Run `vm browser click --role button --name Close`. The dialog is closed.
- **Related story.** Scope the click to `#highboy-dresser`. An unscoped `Read Similar Story` opens the clock post `/blog/miniature-tall-case-clocks/` (`Miniature Tall Case Clocks: The Ultimate Challenge`). Run `vm browser click --selector "#highboy-dresser a[href^='/blog/']" --wait "The Art of the Miniature Highboy"`. The path is `/blog/miniature-highboy-makers-guide/`. The `h1` is `The Art of the Miniature Highboy: A Maker's Guide`. Snapshot that page. Run `vm browser snapshot --path gallery/related.json`. Do not `--wait "Highboy"` or `--wait "Queen Anne"`. The gallery grid already contains `Queen Anne Style Highboy`.
- **Proof.** Screenshot the grid and the open lightbox. Run `vm browser screenshot --path gallery/grid.png` before open and `vm browser screenshot --path gallery/lightbox.png` while the dialog shows the piece title. `GET /gallery/` still lists the seven image paths.

## Gotchas

- Wait for `The Collection` and a piece title, not a fixed sleep.
- All seven `GALLERY_ITEMS` rows have one image, so carousel `Previous image` / `Next image` stay hidden. Do not treat missing chevrons as a failure.
- Card `Read more` is a `<details>` summary. It is not the lightbox.
- `#tall-case-clock` is the card wrapper id. The open control is `Quick view` (`button[data-gallery-open]`), not the title link. The title goes to `/gallery/tall-case-clock/`.
- `Read Similar Story` repeats per card. Name the card when you report the entry point. `--wait "Highboy"` can pass on the gallery card title with no navigation.
- Bare `/gallery` (no trailing slash) is 404 on local `astro dev`.
