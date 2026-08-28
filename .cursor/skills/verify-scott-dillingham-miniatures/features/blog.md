# Blog

Blog is the workshop journal. A visitor lists articles at `/blog`, filters them in the browser, and reads a markdown post at `/blog/<slug>`.

## Sub-features

- `blog-index` lists every `src/content/blog/*.md` card under `From the Workshop Journal`.
- `blog-search` filters titles and descriptions through `Search articles...`.
- `blog-tag` filters by a tag chip (for example `1/12 scale`).
- `blog-empty` shows `No articles found matching "<query>"` and `Clear filters`.
- `blog-article` opens a post with speakable title, breadcrumb, and `Continue Your Journey`.

## How to get to it (user POV)

- Choose header `Blog` (`/blog`).
- Choose footer Learn `All Articles` or a named article such as `Miniature Woodworking Guide` (`/blog/complete-guide-1-12-scale-miniature-furniture`).
- Choose a card in the home section `From the Workshop Journal`.
- Choose `Read Similar Story` on a gallery card.
- Choose `Browse Articles` on the 404 page.

## Driving it with curl/Playwright

Preconditions:

- Doctor is green.
- A known post exists: slug `complete-guide-1-12-scale-miniature-furniture`, title `The Complete Guide to 1/12 Scale Miniature Furniture`.

- **Open index.** Run `curl -sS -D evidence/blog/before.headers.txt -o evidence/blog/before.html http://127.0.0.1:4318/blog`. Status `200`. Body contains `sr-only` heading `Miniature Furniture Blog`, visible `From the Workshop Journal`, `placeholder="Search articles..."`, tag chip `1/12 scale`, and a link to `/blog/complete-guide-1-12-scale-miniature-furniture`.
- **Open article (user path).** Follow a card link. Run `curl -sS -D evidence/blog/after.headers.txt -o evidence/blog/after.html http://127.0.0.1:4318/blog/complete-guide-1-12-scale-miniature-furniture`. Status `200`. Body contains `h1` / `data-speakable="title"` text `The Complete Guide to 1/12 Scale Miniature Furniture`, `What Does 1/12 Scale Actually Mean?`, breadcrumb nav `aria-label="Breadcrumb"` with `Home`, `Blog`, and the title, and `Continue Your Journey` links to `/gallery`, `/workshop`, and `/contact`.
- **Search (browser only).** On `/blog`, fill `input[placeholder="Search articles..."]` with `tall case`. The card `Miniature Tall Case Clocks` remains. Fill `volcano`. Text `No articles found matching "volcano"` appears. Click `Clear search` (`aria-label`) or `Clear filters`. The full grid returns.
- **Proof.** `before.html` is the index. `after.html` is the article with the H1 and an in-body heading. Record feature id `blog`.

## Gotchas

- Search and tags are client state. `curl /blog` always returns the full list. Empty-state proof needs Playwright.
- The index H1 is `sr-only`. Assert `From the Workshop Journal` or the `sr-only` text, not a visible `h1`.
- Footer `Miniature Woodworking Guide` is the complete-guide article, not `/blog` itself.
- Article dates use `toLocaleDateString('en-US')` and `suppressHydrationWarning`. Do not assert a single date string from curl vs hydrated DOM.
- `/blog` hides the bottom `Start a Commission` CTA (`cta.astro` `hiddenPaths`). That CTA still exists on article pages.
