# Contact

Contact is the commission form at `/contact`. A visitor writes name, email, subject, and message. A successful submit calls `POST /api/contact` (Resend). Verification proves the form and validation only.

## Sub-features

- `contact-page` shows `Let's Create Something Extraordinary` and the `Write to Me` form.
- `contact-fields` exposes labeled `Name`, `Email`, `Subject`, and `Message`.
- `contact-validate` rejects a POST missing name, email, or message with HTTP 400.
- `contact-success` (do not run) shows `Message sent! I'll get back to you soon.` after a 200.
- `contact-error` shows `Something went wrong. Please try again.` after a non-OK response.

## How to get to it (user POV)

- Choose header `Contact` or `Commission a Piece`.
- Choose home or page CTA `Start a Commission`.
- Choose footer Company `Contact`.
- Choose article `Continue Your Journey` card `Commission a Piece`.

## Driving it with curl/Playwright

Preconditions:

- Doctor is green.
- Do **not** set or print `RESEND_API_KEY`. Do **not** POST a complete `{name,email,message}` body.

- **Open contact.** From home, click `Commission a Piece`, or run `curl -sS -D evidence/contact/before.headers.txt -o evidence/contact/before.html http://127.0.0.1:4318/` then `curl -sS -D evidence/contact/after.headers.txt -o evidence/contact/after.html http://127.0.0.1:4318/contact`. Destination status `200`. Body contains `Let's Create Something Extraordinary`, `Write to Me`, `label` text `Name` (`for="name"`), `Email` (`for="email"`), `Subject` (`for="subject"`), `Message` (`for="message"`), subject options `General Inquiry`, `Commission Request`, `Collection Question`, `Collaboration`, and button text `Send Message`.
- **Required fields (browser).** On `/contact`, click `Send Message` with empty fields. The native `required` constraints on `#name`, `#email`, and `#message` prevent submit. No success paragraph appears.
- **API validation (safe).** Run `curl -sS -D evidence/contact/validate.headers.txt -o evidence/contact/validate.json -X POST http://127.0.0.1:4318/api/contact -H 'Content-Type: application/json' -d '{}'`. Status `400`. Body contains `Name, email, and message are required.`
- **Proof.** `after.html` has the four labels and `Send Message`. `validate.json` is the 400 body. Record feature id `contact`.

## Gotchas

- A complete POST can send email to `sedminiatures@gmail.com` when `RESEND_API_KEY` is in the Worker or process env. That is out of scope and forbidden for this skill.
- Missing `RESEND_API_KEY` on a complete POST returns 500 and the UI error `Something went wrong. Please try again.` That is not success proof and still must not be used as a "send" test with a real visitor payload.
- `/api/contact` is the only `prerender = false` page. Marketing routes are prerendered.
- Subject may be empty (`Select a subject...`). The API still accepts the message if name, email, and message are present — another reason not to send a complete body.
- Header `Commission a Piece` is a second `/contact` entry next to nav `Contact`. Either is a valid entry; record which one you used.
