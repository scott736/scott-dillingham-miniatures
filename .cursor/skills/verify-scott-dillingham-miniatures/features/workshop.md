# Workshop

Workshop is `/workshop`. A visitor reads The Maker's Workshop hero and the eight-step process from raw hardwood to photography and delivery.

## Sub-features

- `workshop-hero` shows `The Maker's Workshop` and `Where raw hardwood becomes miniature art`.
- `workshop-process` lists steps `01`–`08` under `From Raw Hardwood to Finished Masterpiece`.
- `workshop-tools` lists `Tools of the Trade`.
- `workshop-related` offers process links such as `Scaling Down Plans` and `Choosing Wood Guide`.
- `workshop-guides` lists `Workshop Guides` related-reading cards into the blog.

## How to get to it (user POV)

- Choose header `Workshop`.
- Choose home `See the Workshop`.
- Choose footer Explore `Workshop`.
- Choose article `Continue Your Journey` card `Inside the Workshop`.

## Driving it with curl/Playwright

Preconditions:

- Doctor is green.

- **Start on home.** Run `curl -sS -D evidence/workshop/before.headers.txt -o evidence/workshop/before.html http://127.0.0.1:4318/`. Status `200`. Body contains `See the Workshop` (`href="/workshop"`).
- **Open workshop.** Follow that path. Run `curl -sS -D evidence/workshop/after.headers.txt -o evidence/workshop/after.html http://127.0.0.1:4318/workshop`. Status `200`. `<title>` contains `How the Miniatures Are Made`. Body contains `The Maker's Workshop` (raw HTML may use `The Maker&#x27;s Workshop`), `Where raw hardwood becomes miniature art`, `From Raw Hardwood to Finished Masterpiece`, `Step 01`, `Design & Research`, `Wood Selection`, `Milling & Shaping`, `Joinery`, `Carving & Detail`, `Assembly`, `Finishing`, `Photography & Delivery`, `Tools of the Trade`, and `Workshop Guides`.
- **Follow a process link (optional second hop).** `Scaling Down Plans` is `/blog/scaling-down-furniture-plans`. A GET of that URL is 200 with a speakable article title.
- **Proof.** `before.html` is `/` with `See the Workshop`. `after.html` is `/workshop` with the eight step titles. Record feature id `workshop`.

## Gotchas

- `WorkshopHero`, `WorkshopProcess`, and `WorkshopTools` are static Astro sections. Headings are in the prerendered HTML. There is no `client:*` island on `/workshop`.
- About (`/about`, `Meet the Maker`) is a different page. Header `About` does not prove workshop.
- HowTo JSON-LD on `/workshop` is not a substitute for the visible step headings.
- Process images are under `/images/workshop/`. A 200 HTML page with broken images is still a valid heading proof; note image 404s if you check them.
