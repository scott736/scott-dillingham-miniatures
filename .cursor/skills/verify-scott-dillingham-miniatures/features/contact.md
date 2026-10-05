# Contact

Contact is the general inquiry form at `/contact/`. A visitor writes name, email, and message. Subject, piece, kind of piece, budget, and timing are optional. A successful submit calls `POST /api/contact/` (Resend). Verification proves the form and validation only.

## Sub-features

- `contact-page` shows `Let's Create Something Extraordinary`, `Price on request. Ask about deposit and lead time.`, and the `Write to Me` form.
- `contact-fields` exposes labeled `Name`, `Email`, `Subject`, `Piece`, `Kind of piece`, `Your budget`, `Timing`, and `Message`.
- `contact-validate` rejects a POST missing name, email, or message with HTTP 400, and rejects a malformed email with HTTP 400.
- `contact-success` is prerendered `/message-sent/` (`h1` `Message sent`, `Your note reached the studio.`). GET is safe. Do not POST a complete form to reach it.
- `contact-forbidden` returns HTTP 403 `Forbidden.` when `Origin` / `Referer` is missing or not allowed.
- `contact-too-large` returns HTTP 413 `Request too large.` when the JSON body exceeds 16,384 bytes.

## How to get to it (user POV)

- Choose header `Contact`.
- Choose footer Company `Contact`.
- Choose `Inquire` on an available or museum gallery card (`/contact/?subject=…&piece=…`).
- After a successful native form post, land on `/message-sent/`. GET that URL for copy; do not POST to create it.

Header `Commission a Piece`, home `Start a Commission`, and article `Commission a Piece` go to `/commissions/`, not this page. Use those as commissions proof.

## Driving it with curl/Playwright

Preconditions:

- Doctor is green.
- Do **not** set or print `RESEND_API_KEY`. Do **not** POST a complete `{name,email,message}` body.

- **Open contact.** From home, click header `Contact`, or run `curl -sS -D evidence/contact/before.headers.txt -o evidence/contact/before.html http://127.0.0.1:4318/` then `curl -sS -D evidence/contact/after.headers.txt -o evidence/contact/after.html http://127.0.0.1:4318/contact/`. Destination status `200`. Body contains `Let's Create Something Extraordinary`, `Price on request. Ask about deposit and lead time.`, `Write to Me`, `label` text `Name` (`for="name"`), `Email` (`for="email"`), `Subject` (`for="subject"`), `Piece` (`for="piece"`), `Kind of piece` (`for="pieceType"`), `Your budget` (`for="budget"`), `Timing` (`for="timeline"`), `Message` (`for="message"`), subject options `General Inquiry`, `Commission Request`, `Collection Question`, `Collaboration`, and button text `Send Message`.
- **Required fields (browser).** On `/contact/`, click `Send Message` with empty fields. The native `required` constraints on `#name`, `#email`, and `#message` prevent submit. No success paragraph appears.
- **API validation (safe).** Run `curl -sS -D evidence/contact/validate.headers.txt -o evidence/contact/validate.json -X POST http://127.0.0.1:4318/api/contact/ -H 'Content-Type: application/json' -H 'Origin: http://127.0.0.1:4318' -d '{}'`. Status `400`. Body contains `Name, email, and message are required.`
- **Malformed email (safe).** Run `curl -sS -D evidence/contact/bad-email.headers.txt -o evidence/contact/bad-email.json -X POST http://127.0.0.1:4318/api/contact/ -H 'Content-Type: application/json' -H 'Origin: http://127.0.0.1:4318' -d '{"name":"Ada","email":"not-an-email","message":"Hello"}'`. Status `400`. Body contains `A valid email is required.`
- **Forbidden (safe).** The same `{}` POST with no `Origin` header. Status `403`. Body contains `Forbidden.`
- **Too large (safe).** A JSON POST whose body is larger than 16,384 bytes, with `Origin: http://127.0.0.1:4318`. Status `413`. Body contains `Request too large.`
- **Success page (safe GET).** Run `curl -sS -D evidence/contact/message-sent.headers.txt -o evidence/contact/message-sent.html http://127.0.0.1:4318/message-sent/`. Status `200`. Body contains `h1` `Message sent` and `Your note reached the studio. I read every message and will reply from this address.` Links `See the gallery` (`href="/gallery/"`) and `Commission a piece` (`href="/commissions/"`).
- **Proof.** `after.html` has the labels and `Send Message`. `validate.json` and `bad-email.json` are the 400 bodies. `message-sent.html` is the thank-you page. Record feature id `contact`.

## Gotchas

- A complete POST can send email to `sedminiatures@gmail.com` when `RESEND_API_KEY` is in the Worker or process env. That is out of scope and forbidden for this skill.
- Native form success is 303 `Location: /message-sent/`. JSON success is `{ "success": true }`. There is no `?sent=1` path and no `#contact-sent`. Prefill is `?subject=` and `?piece=`.
- Missing `Origin` or `Referer` on `POST /api/contact/` returns 403 `Forbidden.` before validation, unless `Content-Length` already exceeds 16,384 bytes (that 413 is returned first). Always send `-H 'Origin: http://127.0.0.1:4318'` for local API checks.
- Bare `/contact`, `/message-sent`, and `/api/contact` (no trailing slash) are 404 on local `astro dev`. The form `action` is `/api/contact/`.
- There is no inline `Something went wrong` banner. Native form errors render an HTML error page whose link text is `Back to contact`. JSON 500 text is `Failed to send message. Please try again.` Missing `RESEND_API_KEY` on a complete POST is still not a "send" test.
- `/api/contact/` and `/api/subscribe/` are `prerender = false`. `/message-sent/` is prerendered (`noindex`). Other marketing routes are prerendered.
- Subject may be empty (`Select a subject...`). The API still accepts the message if name, email, and message are present — another reason not to send a complete body.
- Production per-IP rate limit is 429 `Too many requests. Please wait a minute and try again.` (5 / 60s). Local `astro dev` does not bind `CONTACT_LIMITER` and allows the request. Do not treat a local 200/400 as proof that 429 is broken.
- The mailing-list form is omitted unless `PUBLIC_LIST_SIGNUP=true`. Default `POST /api/subscribe/` returns 404 `Not found.` before origin checks. Do not enable the env to "prove" subscribe; that can send mail.
- Header `Commission a Piece` is `/commissions/`, not a `/contact/` entry. Header `Contact` is the contact entry; record which one you used.
