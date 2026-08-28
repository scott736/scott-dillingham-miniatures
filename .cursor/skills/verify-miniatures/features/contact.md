# Contact

Contact is the commission form. A visitor reaches `/contact`, fills Name, Email, and Message, and sees either validation, a local error, or a sent status.

## Sub-features

- `contact-open` shows `Write to Me`, labels `Name`, `Email`, `Subject`, and `Message`, and the three required fields.
- `contact-nav` reaches the form from `Contact`, `Commission a Piece`, and `Start a Commission`.
- `contact-validate-empty` returns HTTP 400 when name, email, or message is missing.
- `contact-validate-email` returns HTTP 400 for a malformed email.
- `contact-error` shows `Something went wrong. Please try again.` after any failed fetch. Do not drive this with a complete valid body.
- `contact-sent` is out of scope. Do not POST a complete valid payload.

## How to get to it (user POV)

- Choose `Contact` in the header nav.
- Choose `Commission a Piece` in the header.
- Choose `Start a Commission` in the layout CTA between main and the footer. That CTA is hidden on `/blog`, `/privacy-policy`, and `/terms-of-service`.
- Open `/contact`.

## Driving it with verify-miniatures

Preconditions:

- Doctor reports the expected loopback URL.
- Do not POST a complete valid `{name,email,message}` body. `resendKeyPresent` only sees `process.env.RESEND_API_KEY`.
- Viewport is 1280x800 so `Commission a Piece` is visible.

- **Open contact.** Go to `/contact`. Run `vm browser goto /contact`. The heading text includes `Let's Create Something Extraordinary` or `Write to Me`. Fields `Name`, `Email`, `Subject`, and `Message` exist. Subject options include `General Inquiry`, `Commission Request`, `Collection Question`, and `Collaboration`.
- **Header entry.** From `/`, choose `Commission a Piece`. Run `vm browser goto /` and `vm browser click --role link --name "Commission a Piece" --wait "Write to Me"`. The form is visible.
- **Nav entry.** From `/`, choose `Contact`. Run `vm browser click --role link --name Contact --wait "Write to Me"`. Same form.
- **Empty POST.** Submit no fields to the same endpoint the form uses. Run `vm post /api/contact --json '{"name":"","email":"","message":""}' --assert-status 400 --assert-contains "required" --out contact/missing.json`. Status is 400.
- **Bad email POST.** Run `vm post /api/contact --json '{"name":"Ada","email":"not-an-email","message":"Hello"}' --assert-status 400 --assert-contains "valid email" --out contact/bad-email.json`. Status is 400.
- **Empty UI submit.** On `/contact`, choose `Send Message` with fields empty. Native `required` blocks the request. The URL stays `/contact`. No `Message sent` line.
- **Proof.** Save the 400 bodies and a screenshot of the empty form. Run `vm browser screenshot --path contact/form.png`. Do not treat a 200 JSON `{success:true}` as proof. Do not fill a valid name, email, and message.

## Gotchas

- The submit control is a `button` whose name is `Send Message`. While the request is in flight the name is `Sending...`.
- Native `required` on the inputs can block a browser submit before `/api/contact` runs. The `post` helper is the reliable validation proof. The UI submit proves the island, not the 400 body.
- A GET to `/api/contact` is HTTP 405. That is not a visitor path.
- `Start a Commission` sits in the commission band above the footer, not inside the footer itself. It is hidden on `/blog`, `/privacy-policy`, and `/terms-of-service`.
- Never post a complete valid payload, locally or to production. `VERIFY_ALLOW_CONTACT_SEND` is not a helper flag.
