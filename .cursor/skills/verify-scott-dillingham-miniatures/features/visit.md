# Visit

Visit is `/visit/`. A visitor reads which pieces are on view at the KSB Miniatures Collection and whether any show dates are posted.

## Sub-features

- `visit-hero` shows `h1` `See the work in person` and the KSB count line.
- `visit-museum` lists museum-held gallery pieces linking to `/gallery/<id>/`.
- `visit-shows` lists booked shows, or `No show dates are posted yet.` when `UPCOMING_SHOWS` is empty.

## How to get to it (user POV)

- Choose the home speakable-description link `KSB Miniatures Collection, Maysville, Kentucky`.
- Choose footer Explore `See the Work`.

## Driving it with curl/Playwright

Preconditions:

- Doctor is green.

- **Start on home.** Run `curl -sS -D evidence/visit/before.headers.txt -o evidence/visit/before.html http://127.0.0.1:4318/`. Status `200`. Body contains `href="/visit/"` and `KSB Miniatures Collection`.
- **Open visit.** Run `curl -sS -D evidence/visit/after.headers.txt -o evidence/visit/after.html http://127.0.0.1:4318/visit/`. Status `200`. `<title>` contains `See the Work in Person`. Body contains `h1` `See the work in person`, `KSB Miniatures Collection`, `ksbminiaturescollection.com`, `Shows`, and (while no shows are booked) `No show dates are posted yet.`
- **Open visit (browser).** From home, click `KSB Miniatures Collection, Maysville, Kentucky`. URL is `/visit/`. H1 is `See the work in person`.
- **Proof.** `before.html` is `/` with the visit href. `after.html` is `/visit/` with the H1. Record feature id `visit`.

## Gotchas

- Header `About` (`Meet the Maker`) is not this page.
- Museum piece thumbnails go to `/gallery/<id>/`, not `/gallery/#<id>`.
- Do not hardcode the museum count word (`Three pieces are…`); it is derived from `GALLERY_ITEMS` with `availability === 'museum'`.
- Bare `/visit` is 404 on local `astro dev`.
- `UPCOMING_SHOWS` is empty until a date is booked. Assert the empty copy, not a named show.
