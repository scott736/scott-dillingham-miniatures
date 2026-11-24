# Blog

Blog is the workshop journal. A visitor lists guides, filters by search or tag, and opens a post.

## Sub-features

- `blog-list` shows `From the Workshop Journal` and article cards.
- `blog-search-match` filters cards by title or description.
- `blog-search-empty` shows `No articles found.` for a nonsense query.
- `blog-search-clear` restores the full list by clearing the input.
- `blog-open` opens `/blog/complete-guide-1-12-scale-miniature-furniture/`.

## How to get to it (user POV)

- Choose `Blog` in the header nav.
- Open `/blog/`.
- Follow a footer Learn link such as `Miniature Woodworking Guide`.
- Follow `Read Similar Story` from a gallery card.

## Driving it with verify-miniatures

Preconditions:

- Doctor reports the expected loopback URL.
- The list island has hydrated. Wait for the search placeholder `Search articles...`.

- **Open list.** Go to `/blog/`. Run `vm browser goto /blog/`. Visible text includes `From the Workshop Journal`. The document title includes `Miniature Furniture Blog`.
- **HTTP view.** Run `vm get /blog/ --assert-status 200 --assert-contains "From the Workshop Journal" --out blog/http-list.html`. Status is 200. The body does not include `Start a Commission`.
- **Search match.** Type `1/12`. Run `vm browser fill --role searchbox --name "Search articles" --value "1/12"`. A card titled `The Complete Guide to 1/12 Scale Miniature Furniture` remains. Unrelated titles can disappear.
- **Search empty.** Replace the query with `volcano`. Run `vm browser fill --role searchbox --name "Search articles" --value "volcano"`. Text `No articles found.` appears (no query interpolation).
- **Clear search.** Clear the search input (there is no `Clear search` button). The field is empty and cards return. The `All` chip only clears a tag filter.
- **Open post.** Choose the complete-guide card. Run `vm browser goto /blog/complete-guide-1-12-scale-miniature-furniture/`. The `h1` is `The Complete Guide to 1/12 Scale Miniature Furniture`. The body also includes article FAQ `How do you calculate 1:12 scale measurements?` and `Continue Your Journey`.
- **Proof.** Screenshot the populated list and the empty search. Run `vm browser screenshot --path blog/list.png` on the unfiltered list and `vm browser screenshot --path blog/empty.png` on `volcano`. `GET /blog/complete-guide-1-12-scale-miniature-furniture/` returns 200 and the same `h1` text.

## Gotchas

- The search input has no `<label>`. Match placeholder `Search articles...` with `--role searchbox --name "Search articles"`.
- Filtering is client-only. `GET /blog/` still contains every title after a search. Prove search from the snapshot or screenshot, not from the HTTP body.
- Empty copy is exactly `No articles found.` — there is no `Clear filters` or `Clear search` control. Restore by clearing the box.
- The visible `h1` on `/blog/` is `From the Workshop Journal`. `Miniature Furniture Blog` is the document title / JSON-LD name.
- `/blog/` hides the footer `Start a Commission` CTA on purpose. Absence is required, not a bug.
- Tags are unlabeled buttons with the tag string as the name, plus `All`.
- Bare `/blog` (no trailing slash) is 404 on local `astro dev`.
