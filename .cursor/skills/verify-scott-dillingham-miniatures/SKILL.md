---
name: verify-scott-dillingham-miniatures
description: Drive the Scott Dillingham Miniatures Astro site (scottdillinghamminiatures.com) the way a visitor does — home, gallery pieces, blog, workshop, and contact. Use when proving local pages, navigation, or a gallery lightbox without deploying.
---

# Verify Scott Dillingham Miniatures

Museum-exhibited 1/12 scale miniature furniture site. Primary surface is the Astro marketing site. Production is Cloudflare Workers at https://scottdillinghamminiatures.com. This skill only drives a local `astro dev` instance you start.

Read [features/README.md](features/README.md) before a run. Drive one mapped feature end to end. Do not deploy, do not commit, and do not send a complete contact-form payload (that can hit Resend).

## Launch

Assigned bind: `127.0.0.1:4318`. The README's `http://localhost:4321` is the unassigned Astro default. Never use 4321 for this skill.

Two verification instances cannot share 4318. Astro 7 also refuses a second `astro dev` in this checkout on any port. Content is read from this checkout (no disposable data dir). If 4318 is already listening, or if another Astro dev is running, stop and report BLOCKED. Do not kill the occupant. Do not pass `--force`. Do not drive an instance you did not start.

```bash
export RUN_ID="${RUN_ID:-$(date +%Y%m%d-%H%M%S)}"
export REPO="${REPO:-$(git rev-parse --show-toplevel)}"
export VERIFY_BASE="http://127.0.0.1:4318"
export VERIFY_PID="/tmp/verify-scott-dillingham-miniatures-${RUN_ID}.pid"
export VERIFY_LOG="/tmp/verify-scott-dillingham-miniatures-${RUN_ID}.log"

cd "$REPO"
test -d node_modules || npm install
"$REPO/.cursor/skills/verify-scott-dillingham-miniatures/scripts/launch.sh"
```

`scripts/launch.sh` defaults `REPO` to the checkout that contains the script. It starts `npm run dev -- --host 127.0.0.1 --port 4318` (`astro dev`), writes `$VERIFY_PID`, and waits until `GET /` returns HTTP 200.

Ready signal: log contains `Local    http://127.0.0.1:4318/` and `curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:4318/` is `200`.

Astro 7 allows one `astro dev` per checkout. If any Astro process is already running (including verify-miniatures on 4321), launch exits before bind. Do not `astro dev --force`. Do not kill a process this run did not start. Report BLOCKED.

Documented start without the helper:

```bash
npm run dev -- --host 127.0.0.1 --port 4318
```

## Doctor

Read-only. Run this first whenever anything looks off.

```bash
export RUN_ID="<same as launch>"
"$REPO/.cursor/skills/verify-scott-dillingham-miniatures/scripts/doctor.sh"
```

Pass means:

- `$VERIFY_PID` exists and that PID (or a child of it) still owns TCP `127.0.0.1:4318`
- `GET /` is 200 and the HTML contains `Miniature Furniture,<br /> Extraordinary Craft` (or the escaped `Miniature Furniture,` plus `Extraordinary Craft`) and `data-speakable="title"`
- `GET /gallery` is 200 and the HTML contains `The Collection` and `Simon Willard Tall Case Clock Style`
- Listener command is `node` / `astro` from this checkout, not another project

Fail and stop if the port owner is not the PID tree you started.

## Drive

Harness: HTTP for prerendered HTML, Playwright when a click or client island is required. Prefer link text, `aria-label`, `data-*`, element `id`, and route paths.

Base URL is always `http://127.0.0.1:4318`. Desktop nav is `md:flex` (hidden below that). Use a viewport at least 768px wide so the `Gallery`, `Workshop`, `About`, `Blog`, and `Contact` links are in the header. Below `md`, open the menu with the button that has `data-nav-toggle` and accessible name `Open main menu`.

Stable handles from this checkout:

| What | Handle |
|---|---|
| Skip link | link `Skip to content` → `#main-content` |
| Logo home | `img[alt="Scott Dillingham Miniatures"]` inside `a[href="/"]` |
| Desktop nav | `a[href="/gallery"]` text `Gallery`, `/workshop` `Workshop`, `/about` `About`, `/blog` `Blog`, `/contact` `Contact` |
| Header CTA | link text `Commission a Piece` → `/contact` |
| Theme | `button[data-theme-toggle][aria-label="Toggle theme"]` |
| Mobile menu | `button[data-nav-toggle][aria-controls="mobile-nav"]` |
| Home H1 | `[data-speakable="title"]` text `Miniature Furniture, Extraordinary Craft` |
| Home primary CTA | link `Explore the Gallery` → `/gallery` |
| Home secondary CTA | link `See the Workshop` → `/workshop` |
| Home highlights | heading `Gallery Highlights`; titles such as `Simon Willard Tall Case Clock Style` link to related **blog** posts, not the gallery card |
| Home FAQ | first `<details class="faq-item">` is open; question in `[data-speakable="faq-question"]` |
| Gallery H1 | `The Collection` |
| Piece card | `div#tall-case-clock` (also `#highboy-dresser`, `#four-poster-bed`, `#maloof-rocking-chair`, `#hepplewhite-shield-back-chair`, `#moser-continuous-arm-chair`, `#shaker-d-ring-table`) |
| Piece lightbox | title button on the card; dialog heading is the piece title; close control has accessible name `Close` |
| Blog index H1 | `sr-only` `Miniature Furniture Blog`; visible title `From the Workshop Journal` |
| Blog search | `input[placeholder="Search articles..."]`; clear button `aria-label="Clear search"` |
| Article | `/blog/<slug>` e.g. `/blog/complete-guide-1-12-scale-miniature-furniture`; `h1[data-speakable="title"]` |
| Contact | `/contact`; `h1` `Let's Create Something Extraordinary`; labels `Name`, `Email`, `Subject`, `Message`; submit text `Send Message` |
| Workshop | `/workshop`; `h1` `The Maker's Workshop`; process title `From Raw Hardwood to Finished Masterpiece` |

Recipes: [features/home.md](features/home.md), [features/gallery.md](features/gallery.md), [features/blog.md](features/blog.md), [features/contact.md](features/contact.md), [features/workshop.md](features/workshop.md).

Do not POST a complete `/api/contact` body. A filled form can send live email when `RESEND_API_KEY` is present. Validation-only POST (missing name/email/message) is the safe API check.

## Evidence

Store proof under `.cursor/skills/verify-scott-dillingham-miniatures/evidence/<feature-id>/`. Cleanup must not delete this directory.

Standards:

- Exercise the real visitor path (nav click or in-page CTA), not an internal setter
- Capture the action and the resulting state (home HTML before, destination HTML after; for the lightbox, closed card then open dialog)
- Side effects: HTTP status and body strings. The contact API is the only mutation; do not complete it
- No mocks. Do not hit production `scottdillinghamminiatures.com` for proof

Minimum files for a content-page proof:

- `before.html` and `before.headers.txt` from the starting route
- `after.html` and `after.headers.txt` from the destination route
- `drive.log.txt` with the exact commands, statuses, and feature id

For a gallery piece lightbox, also save a screenshot or ARIA dump of the open dialog.

## Cleanup

Kill only the PID written at launch (and children of that PID). Never `pkill` / kill by process name.

```bash
export RUN_ID="<same as launch>"
.cursor/skills/verify-scott-dillingham-miniatures/scripts/cleanup.sh
```

After cleanup, confirm `evidence/<feature-id>/` still exists. Remove `/tmp/verify-scott-dillingham-miniatures-$RUN_ID.pid` and the matching `.log` only.

## Helpers

All scripts are executable. They read `RUN_ID` (and optional `REPO`, `VERIFY_BASE`).

```bash
# Start astro on 127.0.0.1:4318 and write the PID file
.cursor/skills/verify-scott-dillingham-miniatures/scripts/launch.sh

# Read-only health: PID tree, port, GET / and GET /gallery
.cursor/skills/verify-scott-dillingham-miniatures/scripts/doctor.sh

# Kill the launch PID tree only
.cursor/skills/verify-scott-dillingham-miniatures/scripts/cleanup.sh
```

Keep the feature map honest with `/maintain-verification-skill` when routes or copy change.
