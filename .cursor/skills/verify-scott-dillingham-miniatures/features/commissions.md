# Commissions

Commissions is `/commissions/`. A visitor reads how a commission proceeds, then writes through the same `/api/contact/` form with subject locked to commission. Verification proves the page and the form render only.

## Sub-features

- `commissions-hero` shows `h1` `Commission a piece` and the four steps Consult, Design and wood, Price, timing, and deposit, Delivery.
- `commissions-past` lists every gallery piece under `Past work`, linking to `/gallery/<id>/`.
- `commissions-form` is `Tell me about the piece` with hidden `subject=commission`, `Kind of piece`, and no Subject select.

## How to get to it (user POV)

- Choose header `Commission a Piece`.
- Choose home `Commission a piece` or `Start a Commission`.
- Choose footer Explore `Commissions`.
- Choose article `Continue Your Journey` card `Commission a Piece`.
- Choose `Commission` on a commission-only gallery card (`/commissions/?piece=…`).

## Driving it with curl/Playwright

Preconditions:

- Doctor is green.
- Do **not** POST a complete `{name,email,message}` body.

- **Start on home.** Run `curl -sS -D evidence/commissions/before.headers.txt -o evidence/commissions/before.html http://127.0.0.1:4318/`. Status `200`. Body contains `Commission a piece` (`href="/commissions/"`) and header `Commission a Piece` (`href="/commissions/"`).
- **Open commissions.** Run `curl -sS -D evidence/commissions/after.headers.txt -o evidence/commissions/after.html http://127.0.0.1:4318/commissions/`. Status `200`. `<title>` contains `How a Commission Works`. Body contains `h1` `Commission a piece`, `Tell me about the piece`, `Consult`, `Design and wood`, `Price, timing, and deposit`, `Delivery`, `Past work`, `for="name"`, `for="pieceType"`, `Kind of piece`, `Send Message`, and `name="subject"` `value="commission"`. Body does not contain `for="subject"`.
- **Open commissions (browser).** From home, click header `Commission a Piece`. URL is `/commissions/`. `#subject` select count is 0. `#pieceType` is present. Hidden `input[name="subject"]` value is `commission`.
- **Proof.** `before.html` is `/` with the header CTA. `after.html` is `/commissions/` with the H1 and locked subject. Record feature id `commissions`.

## Gotchas

- This page posts to the same `/api/contact/` as contact. Do not complete a send. Safe API checks live in [contact.md](./contact.md).
- Header `Commission a Piece` is this page, not `/contact/`. Header `Contact` is the general form.
- Bare `/commissions` is 404 on local `astro dev`.
- Past-work titles go to piece pages (`/gallery/<id>/`), not the gallery hash.
