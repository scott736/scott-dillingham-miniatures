---
name: verify-miniatures
description: Drive and prove the Scott Dillingham Miniatures public site (scottdillinghamminiatures.com) the way a visitor does. Launch a disposable Astro dev instance, doctor it, click real UI, and keep screenshots plus HTTP bodies. Use when verifying home, gallery, workshop, blog, or the commission form, or before shipping site changes.
---

# Verify Miniatures

Agent-facing control skill for this repo only. Read `features/README.md` before you drive. Prove the mapped entry points, not a convenient substitute.

In the commands below, `vm` means this invocation from the repo root:

```bash
node .cursor/skills/verify-miniatures/helpers/verify-miniatures.mjs
```

## Launch

Primary surface is the public marketing site. Visitors use pages and the commission form. Secondary surfaces are `/api/contact` and the AEO files (`/llms.txt`, `/ai.txt`, sitemap). There is no CLI product and no in-repo Playwright or Cypress harness.

Start a disposable Astro instance bound to loopback. Do not drive a shared session, production, or `workers.dev`.

```bash
vm launch
```

Ready when `launch` prints `"ok": true` and `url` answers HTTP 200 with `Scott Dillingham Miniatures` in the HTML. Default URL is `http://127.0.0.1:4321`. Override with `VERIFY_PORT` and `VERIFY_STATE_DIR`. Parallel runs need both set to distinct values. Astro 7 still allows only one `astro dev` in this checkout. A second launch on another port fails with `Another astro dev server is already running`. Do not pass `--force`. Reuse the recorded instance or stop it with `vm cleanup` first.

Recorded pids and the log live under `VERIFY_STATE_DIR` (default `/tmp/verify-miniatures`). Teardown is `vm cleanup`. That command kills only those pids. It does not delete evidence under `.cursor/skills/verify-miniatures/artifacts/`.

If `npm` packages are missing, run `npm ci --legacy-peer-deps` first. Node is `>=22.12`. Chrome is `google-chrome` or `CHROME_PATH`.

## Doctor

Run this first whenever the instance looks wrong.

```bash
vm doctor
```

Require `"ok": true`. That means the recorded pid is alive, its command line owns the recorded port, `GET /` is HTTP 200, the HTML contains the brand and the home hero words `Miniature Furniture`, and `url` matches the launch record. `resendKeyPresent` is a boolean. Do not print the key. If doctor fails, cleanup and launch again. Do not click a site you did not start.

## Drive

HTTP for document state. Chrome CDP for clicks, fills, and screenshots. Prefer role plus accessible name. CSS is a last resort.

```bash
vm get / --assert-status 200 --assert-contains "Miniature Furniture" --out home/http-home.html
vm browser start
vm browser goto /
vm browser click --role link --name "Explore the Gallery" --wait "The Collection"
vm browser fill --role textbox --name Name --value "Visitor"
vm browser snapshot --path home/01-home.json
vm browser screenshot --path home/01-home.png
```

`browser start` uses a private Chrome profile under the state dir and a CDP port from `VERIFY_CDP_PORT` (default 9333). Pass `--width 390 --height 844` for the mobile nav. Default viewport is 1280x800, where desktop links show and `[data-nav-toggle]` is `md:hidden`.

Stable handles from this repo:

| Control | Handle |
| --- | --- |
| Home hero | `h1` text `Miniature Furniture, Extraordinary Craft` |
| Gallery CTA | link `Explore the Gallery` → `/gallery` |
| Workshop CTA | link `See the Workshop` → `/workshop` |
| Nav | links `Gallery`, `Workshop`, `About`, `Blog`, `Contact` |
| Commission | link `Commission a Piece` → `/contact` |
| Footer CTA | link `Start a Commission` → `/contact` (hidden on `/blog`) |
| Theme | button `aria-label="Toggle theme"` |
| Mobile menu | button `aria-label` / `sr-only` text `Open main menu`, `[data-nav-toggle]` |
| Logo | `img[alt="Scott Dillingham Miniatures"]` → `/` |
| Gallery heading | `h1` `The Collection` |
| Gallery piece | button whose name is the piece title, for example `Simon Willard Tall Case Clock Style`; card root id `tall-case-clock` |
| Lightbox close | button `Close` |
| Contact fields | textboxes `Name`, `Email`, `Message`; select `#subject` |
| Contact submit | button `Send Message` |
| Blog search | textbox matched by placeholder `Search articles...` |
| Blog empty | text `No articles found` |
| Workshop heading | `h1` `The Maker's Workshop` |
| Skip link | link `Skip to content` → `#main-content` |

Contact POST is the form's real backend. Prove validation. Do not send a complete live message.

```bash
vm post /api/contact --json '{"name":"","email":"","message":""}' --assert-status 400 --assert-contains "required" --out contact/missing.json
vm post /api/contact --json '{"name":"Ada","email":"not-an-email","message":"Hi"}' --assert-status 400 --assert-contains "valid email" --out contact/bad-email.json
```

Do not POST a body where trimmed `name` and `message` are non-empty and `email` matches `^[^\s@]+@[^\s@]+\.[^\s@]+$`. That shape reaches Resend when `RESEND_API_KEY` is in process env, Worker `env`, or `import.meta.env`. `doctor.resendKeyPresent` only sees `process.env`. Never POST `/api/contact` to `scottdillinghamminiatures.com` or `*.workers.dev`.

`get` / `post --assert-contains` matches raw HTML or JSON and also HTML with entities decoded (`The Maker&#x27;s Workshop` matches `The Maker's Workshop`).

One-shot home proof:

```bash
vm prove home
```

That command launches, doctors, drives home → gallery, writes artifacts, then cleans up.

## Evidence

Put files under `.cursor/skills/verify-miniatures/artifacts/<feature>/`. Cleanup must leave that tree in place.

Proof standards:

- Exercise the visitor path. Do not call internal setters or test-only endpoints. `/api/contact` is the form's production endpoint, so it is allowed for validation and the no-key error path only.
- Capture the action and the resulting state. A final screenshot without the click that produced it is incomplete.
- For a mutation, take a second read-only view. Gallery after the home CTA needs `/gallery` in the URL (or `Hepplewhite Shield Back Style Chair`) plus the `h1` `The Collection`. A `GET /gallery` body is the second view.
- Record the feature id and entry point on the artifact (`result.json` or the snapshot `url`).
- UI proof is a snapshot JSON plus a PNG that shows the brand or page heading.
- HTTP proof is status, url, and a saved body.
- Mocks are not used. The contact send to Resend is skipped by refusing a complete POST when the key is present, not by stubbing.

`prove home` writes `artifacts/home/01-home.png`, `01-home.json`, `02-gallery.png`, `02-gallery.json`, `http-home.html`, `http-gallery.html`, `doctor.json`, and `result.json`.

## Cleanup

```bash
vm cleanup
```

Kills the Astro pid and Chrome pid from the state file. Never `pkill astro` or `killall chrome`. After cleanup, confirm the proof files still exist. Then confirm the recorded pids are dead.

If a run fails, still run cleanup so ports do not stay held.

## Helpers

The helper is executable Node. Invocation is `vm` as defined above.

| Command | What it does |
| --- | --- |
| `launch` | Starts `npm run dev` on loopback, waits for HTTP 200, writes state. Reuses a healthy instance. |
| `doctor` | Read-only health JSON. Exit 1 when `ok` is false. |
| `get <path>` | `GET` the running instance. `--assert-status`, `--assert-contains`, `--out`. |
| `post <path>` | `POST` JSON. Same assert flags. |
| `browser start` | Headless Chrome with a private profile and CDP. |
| `browser goto <path>` | Navigate. Prints title, url, and h1 unless `--full`. |
| `browser click --role --name` | Click. `--wait TEXT` polls `document.body.innerText`. `--selector` if a role is missing. Compact print unless `--full`. |
| `browser fill --role textbox --name --value` | Fill a labeled field. |
| `browser snapshot --path` | Headings, links, buttons, fields. Writes the full JSON when `--path` is set. |
| `browser screenshot --path` | PNG under `artifacts/` when the path is relative. |
| `prove home` | Full home recipe plus cleanup. |
| `cleanup` | Kill recorded pids. Keep artifacts. |

State file: `$VERIFY_STATE_DIR/state.json`. Do not edit it by hand.

## Feature map

Index: [features/README.md](features/README.md)

Seeded features: [home](features/home.md), [gallery](features/gallery.md), [contact](features/contact.md), [blog](features/blog.md), [workshop](features/workshop.md).
