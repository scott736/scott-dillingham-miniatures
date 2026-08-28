# Scott Dillingham Miniatures verification map

This directory is the maintained source for verifying visitor-facing behavior of the Astro site in `/Users/scottdillingham/GitHub/scott-dillingham-miniatures`. Read this index, then use the matching feature file.

## Baseline preconditions

- Launch this checkout with `npm run dev -- --host 127.0.0.1 --port 4318` (`astro dev`).
- Base URL is `http://127.0.0.1:4318`. Do not use port 4321.
- Write `/tmp/verify-scott-dillingham-miniatures-$RUN_ID.pid` at launch.
- Run `scripts/doctor.sh` and require 200 on `/` and `/gallery` from the PID tree you started.
- Never drive an instance that was not started by this verification run.
- Two instances cannot share 4318. There is no disposable data directory; pages are prerendered from this repo.

## Driving conventions

- Start every recipe from the home page unless the feature file says otherwise.
- Prefer link text, `aria-label`, `data-*`, card `id`, and path over CSS position.
- Treat commands as literal.
- HTTP (`curl`) is enough for prerendered HTML. Use Playwright when the path needs a click, search box, FAQ `<details>`, or the gallery lightbox.
- Desktop header links are hidden below the `md` breakpoint. Use a viewport ≥ 768px, or open `Open main menu`.
- Do not submit a complete contact form. Do not `wrangler deploy`.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- HTML proof includes status, `Location` if any, and a saved body that contains the expected heading.
- Click-path proof includes before and after (screenshot or ARIA) plus the URL.
- Record the feature ID and entry point with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with curl/Playwright` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

## Features

- [Home](./home.md) covers the landing hero, gallery highlights, FAQ, and blog preview.
- [Gallery](./gallery.md) covers `/gallery`, piece cards, and the piece lightbox.
- [Blog](./blog.md) covers the journal index, client search, and a markdown article.
- [Contact](./contact.md) covers the commission form (render and validation only).
- [Workshop](./workshop.md) covers the maker's workshop and eight-step process.
