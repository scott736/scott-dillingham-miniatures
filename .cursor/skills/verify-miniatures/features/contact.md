# Contact

Contact is the commission form. A visitor reaches `/contact`, fills Name, Email, and Message, and sees either validation, a local error, or a sent status.

## Sub-features

- `contact-open` shows `Write to Me` and the three required fields.
- `contact-nav` reaches the form from `Contact`, `Commission a Piece`, and `Start a Commission`.
- `contact-validate-empty` returns HTTP 400 when name, email, or message is missing.
- `contact-validate-email` returns HTTP 400 for a malformed email.
- `contact-error` shows `Something went wrong. Please try again.` when Resend is not configured.
- `contact-sent` is out of scope unless the operator set `VERIFY_ALLOW_CONTACT_SEND=1` and accepted a real email to `sedminiatures@gmail.com`.

## How to get to it (user POV)

- Choose `Contact` in the header nav.
- Choose `Commission a Piece` in the header.
- Choose `Start a Commission` in the footer CTA. That CTA is hidden on `/blog`.
- Open `/contact`.

## Driving it with verify-miniatures

Preconditions:

- Doctor reports the expected loopback URL.
- `resendKeyPresent` is `false` for `contact-error`. If it is `true`, skip every complete POST and skip the UI submit of a valid form.
- Viewport is 1280x800 so `Commission a Piece` is visible.

- **Open contact.** Go to `/contact`. Run `vm browser goto /contact`. The heading text includes `Let's Create Something Extraordinary` or `Write to Me`. Fields `Name`, `Email`, and `Message` exist.
- **Header entry.** From `/`, choose `Commission a Piece`. Run `vm browser goto /` and `vm browser click --role link --name "Commission a Piece" --wait "Write to Me"`. The form is visible.
- **Nav entry.** From `/`, choose `Contact`. Run `vm browser click --role link --name Contact --wait "Write to Me"`. Same form.
- **Empty POST.** Submit no fields to the same endpoint the form uses. Run `vm post /api/contact --json '{"name":"","email":"","message":""}' --assert-status 400 --assert-contains "required" --out contact/missing.json`. Status is 400.
- **Bad email POST.** Run `vm post /api/contact --json '{"name":"Ada","email":"not-an-email","message":"Hello"}' --assert-status 400 --assert-contains "valid email" --out contact/bad-email.json`. Status is 400.
- **Fill and submit without a key.** Fill the labeled fields. Run `vm browser fill --role textbox --name Name --value "Ada Lovelace"`, `vm browser fill --role textbox --name Email --value "ada@example.com"`, and `vm browser fill --role textbox --name Message --value "Do not send this."`. Choose `Send Message`. Run `vm browser click --role button --name "Send Message" --wait "Something went wrong"`. The red status `Something went wrong. Please try again.` appears. The browser is still on `/contact`.
- **Proof.** Save the 400 bodies and a screenshot of the error status. Run `vm browser screenshot --path contact/error.png` after the failed submit. Do not treat a 200 JSON `{success:true}` as proof unless `VERIFY_ALLOW_CONTACT_SEND=1` was set on purpose.

## Gotchas

- The submit control is a `button` whose name is `Send Message`. While the request is in flight the name is `Sending...`.
- Native `required` on the inputs can block a browser submit before `/api/contact` runs. The `post` helper is the reliable validation proof. The UI submit proves the island, not the 400 body.
- A GET to `/api/contact` is HTTP 405. That is not a visitor path.
- `Start a Commission` is absent on `/blog`. Do not fail blog because that CTA is missing.
- Never post a complete valid payload to production. Local 200 with a key sends a real email.
