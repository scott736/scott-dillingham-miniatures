# Gallery

Gallery is the collection. A visitor scans the seven pieces, opens a lightbox from a piece title, and follows a related story when they want one.

## Sub-features

- `gallery-load` shows `The Collection` and all seven piece titles.
- `gallery-open` opens the lightbox from a piece title button.
- `gallery-close` dismisses the lightbox with `Close`.
- `gallery-read-more` expands a truncated description on a card.
- `gallery-related` follows `Read Similar Story` into a blog post.

## How to get to it (user POV)

- Choose `Gallery` in the header nav.
- Choose `Explore the Gallery` on the home hero or the 404 page.
- Open `/gallery` or `/gallery#tall-case-clock`.

## Driving it with verify-miniatures

Preconditions:

- Doctor reports the expected loopback URL.
- `vm browser start` is running at 1280x800.

- **Open gallery.** Go to `/gallery`. Run `vm browser goto /gallery`. The heading is `The Collection`.
- **HTTP view.** Run `vm get /gallery --assert-status 200 --assert-contains "The Collection" --out gallery/http-gallery.html`. The body includes `/images/gallery/tall-case-clock.webp` and `/images/gallery/maloof-rocking-chair.webp`.
- **Piece titles.** Snapshot the page. Run `vm browser snapshot --path gallery/grid.json`. Headings or buttons include `Simon Willard Tall Case Clock Style`, `Queen Anne Style Highboy`, `Shaker Style Pencil Post Bed`, `Sam Maloof Style Rocking Chair`, `Hepplewhite Shield Back Style Chair`, `Thomas Moser Continuous Arm Style Chair`, and `Shaker Style D-Ring Table`.
- **Open lightbox.** Choose the tall-case clock title. Run `vm browser click --role button --name "Simon Willard Tall Case Clock Style" --wait "Simon Willard Tall Case Clock Style"`. A dialog is open. `vm browser eval document.querySelector('[role="dialog"]') !== null` is true.
- **Close lightbox.** Choose `Close`. Run `vm browser click --role button --name Close`. The dialog is gone.
- **Related story.** Scope the click to `#highboy-dresser`. An unscoped `Read Similar Story` opens the clock post `/blog/miniature-tall-case-clocks` (`Miniature Tall Case Clocks: The Ultimate Challenge`). Run `vm browser click --selector "#highboy-dresser a[href^='/blog/']" --wait "Highboy"`. The path is `/blog/miniature-highboy-makers-guide`. The `h1` is `The Art of the Miniature Highboy: A Maker's Guide`. Do not `--wait "Queen Anne"`.
- **Proof.** Screenshot the grid and the open lightbox. Run `vm browser screenshot --path gallery/grid.png` before open and `vm browser screenshot --path gallery/lightbox.png` while the dialog shows the piece title. `GET /gallery` still lists the seven image paths.

## Gotchas

- The gallery island is `client:idle`. Wait for `The Collection` and a piece title, not a fixed sleep.
- All seven `GALLERY_ITEMS` rows have one image, so carousel `Previous image` / `Next image` are absent. Do not treat missing chevrons as a failure.
- Card `Read More` is a button with that name. It is not the lightbox.
- `#tall-case-clock` is the card wrapper id. The open control is the title button, not the image.
- `Read Similar Story` repeats per card. Name the card when you report the entry point.
