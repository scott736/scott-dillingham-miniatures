# Contact

Contact is the general inquiry form at `/contact/`. A visitor fills Name, Email, and Message. Subject and the optional fields are available. Verification proves the form and validation only.

## Sub-features

- `contact-open` shows `Let's Create Something Extraordinary`, `Write to Me`, labels `Name`, `Email`, `Subject`, and `Message`, and the three required fields.
- `contact-nav` reaches the form from header `Contact`.
- `contact-validate-empty` returns HTTP 400 when name, email, or message is missing.
- `contact-validate-email` returns HTTP 400 for a malformed email.
- `contact-sent` is out of scope. Do not POST a complete valid payload. GET `/message-sent/` is the safe success-copy check.

## How to get to it (user POV)

- Choose `Contact` in the header nav.
- Choose `Inquire` on an available or museum gallery card (`/contact/?subject=…&piece=…`).
- Open `/contact/`.

Header `Commission a Piece` and footer `Start a Commission` go to `/commissions/`, not this page.

## Driving it with verify-miniatures

Preconditions:

- Doctor reports the expected loopback URL.
- Do not POST a complete valid `{name,email,message}` body. `resendKeyPresent` only sees `process.env.RESEND_API_KEY`.
- Viewport is 1280x800 so header `Contact` is visible.

- **Open contact.** Go to `/contact/`. Run `vm browser goto /contact/`. The heading text includes `Let's Create Something Extraordinary` or `Write to Me`. Fields `Name`, `Email`, `Subject`, and `Message` exist. Subject options include `General Inquiry`, `Commission Request`, `Collection Question`, and `Collaboration`.
- **Header entry.** From `/`, choose `Contact`. Run `vm browser goto /` and `vm browser click --role link --name Contact --wait "Write to Me"`. The form is visible.
- **Empty POST.** Submit no fields to the same endpoint the form uses. Run `vm post /api/contact/ --json '{"name":"","email":"","message":""}' --assert-status 400 --assert-contains "required" --out contact/missing.json`. Status is 400. Include a loopback `Origin` when the helper/API path requires it; without Origin the API returns 403.
- **Bad email POST.** Run `vm post /api/contact/ --json '{"name":"Ada","email":"not-an-email","message":"Hello"}' --assert-status 400 --assert-contains "valid email" --out contact/bad-email.json`. Status is 400.
- **Empty UI submit.** On `/contact/`, choose `Send Message` with fields empty. Native `required` blocks the request. The URL stays `/contact/`. No `Message sent` line.
- **Proof.** Save the 400 bodies and a screenshot of the empty form. Run `vm browser screenshot --path contact/form.png`. Do not treat a 200 JSON `{success:true}` as proof. Do not fill a valid name, email, and message.

## Gotchas

- The submit control is a `button` whose name is `Send Message`. While the request is in flight the name is `Sending...`.
- Native `required` on the inputs can block a browser submit before `/api/contact/` runs. The `post` helper is the reliable validation proof. The UI submit proves the island, not the 400 body.
- A GET to `/api/contact/` is HTTP 405. That is not a visitor path.
- `Start a Commission` and `Commission a Piece` go to `/commissions/`. Do not treat those clicks as contact proof.
- `/contact/` document `<title>` is `Commission a Piece`. The visible `h1` is `Let's Create Something Extraordinary`.
- Never post a complete valid payload, locally or to production. `VERIFY_ALLOW_CONTACT_SEND` is not a helper flag.
- Bare `/contact` and `/api/contact` (no trailing slash) are 404 on local `astro dev`.
