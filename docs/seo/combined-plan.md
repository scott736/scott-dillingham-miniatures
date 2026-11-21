# Combined SEO plan: scottdillinghamminiatures.com (repo scott736/scott-dillingham-miniatures)

Sources: Cursor `cursor-plan.md` (commit 946d536, branch `seo/gsc-plan-2026-11-21`), Gemini `gemini-plan.md`, GSC `data-brief.md` + `raw/` (56 cl / 2,351 impr / 2.38% / pos 8.2; prior 2 / 301 / pos 6.1). Live checks 2026-11-21 ~5:20 PM ET on `/`, `/about/`, scales, Chippendale, complete guide, gallery and workshop. All GSC counts match raw (the "46.0" flag is a position range end, not a count).

This is the site for Scott's dad. Constraints: **maker claims ("KSB Miniatures Collection", "museum-exhibited") only where the site already uses them**; **don't rewrite top-performing titles aggressively**; no Google tags; no invented stats, prices, products or reviews; no AggregateRating/Review/priced Product; the contact/Resend/subscribe pipeline stays untouched; don't remove tests.

## Verified facts
- KSB and museum wording is already present on `/`, `/about/`, scales, Chippendale, complete guide, gallery and workshop (live grep counts 2–37 per page), so a meta that reuses the **existing phrasing** on those pages is allowed. New wording such as "artist" or "artisan" + KSB isn't on the site, so use the existing "KSB Miniatures Collection maker" / "museum-exhibited" phrasing only.
- One `<h1>` on every page checked.
- **Top performers to protect:** complete guide (16 cl / 414 impr / 3.86%), home (12 cl / 170 impr / 7.06%), beginners (12 cl / 80 impr / 15.0%), wood guide (5 cl / 193 impr / 2.59%).
- Biggest leak: scales post, 823 impr / 2 cl / 0.24% / pos 8.0; query `best scale for dollhouse building 1 12 vs 1 24` 372 impr pos 6.3, 0 clicks.
- The brand query "scott dillingham" is ambiguous: Scott (LendCity) shares the name. Don't assume all brand impressions are for the maker.

## Decision table
| # | Source | Recommendation | Decision | Reason / evidence |
|---|---|---|---|---|
| 1 | Cursor A1, Gemini P1.2 | Scales post title/H1 → query-led ("Best Scale for Dollhouse Building: 1:12 vs 1:24"; Gemini `1:12 vs 1:24: Best Scale for Dollhouse Building (+Chart)`); meta with chart/decision hook | **Accepted** | Largest gap; not a top performer (2 clicks). Pick one: Gemini's 56-char version stays under 60 even with the suffix logic. "+Chart" only because the page has the chart. |
| 2 | Cursor C1 | Point hubs at scales: beginners "choose your scale first" link, fix the complete-guide link's trailing slash, links from tools + wood, workshop RelatedReading | **Accepted** | Internal links barely exist (Cursor verified). Adding a paragraph/link to top pages is OK; their titles stay unchanged. |
| 3 | Cursor B1 | Scales decision checklist from existing facts; FAQ visible = `BLOG_FAQ` | **Accepted** | No invented percentages. |
| 4 | Cursor A2, Gemini P2.1 | Chippendale title `Chippendale Miniature Furniture: Ball-and-Claw Feet`; meta keeps the existing "KSB Miniatures Collection maker" phrase | **Accepted** | 1 cl / 113 impr / pos 8.4. KSB is already on this page (9 hits). |
| 5 | Cursor A3, Gemini P2.1 | Tools guide title `Essential Tools for Miniature Woodworking` (Cursor) vs `Best Miniature Woodworking Tools for 1/12 Scale Makers` (Gemini) | **Accepted (Cursor wording)** | 125 impr / pos 9.3; avoid "Best" claims. |
| 6 | Cursor A4/B3, Gemini P1.4 | About: title `About Scott Dillingham, Miniature Furniture Maker`; meta reuses the existing museum-exhibited/KSB wording; biography depth from on-site facts only | **Accepted** | 0 cl / 65 impr / pos 7.1. Gemini's "KSB Miniatures Collection **artist**" is rejected; use the site's own "maker" phrasing. No new exhibitions, awards or years. |
| 7 | Gemini P1.4 | Homepage title → `Scott Dillingham Miniatures \| 1/12 Scale Wood Furniture` + new meta | **Rejected** | Top performer (7.06% CTR, 12 clicks), and the brand query is ambiguous. Leave it alone. |
| 8 | Gemini P1.3-A | Complete-guide title rewrite (`1/12 Scale Miniature Furniture: Complete Maker Guide`) | **Rejected** | #1 click page (3.86%). The constraint says no aggressive top-title rewrites; Cursor also says leave it. |
| 9 | Cursor A6 (optional), Gemini P1.3-B | Wood guide title → `Best Wood for Miniature Furniture` | **Deferred** | Top-4 click page (5 clicks, 2.59%). Revisit only if CTR drops. |
| 10 | Gemini P2.3 | Beginners title rewrite (`…: Where to Start`) | **Rejected** | 15% CTR winner. Improve rank through internal links instead (row 2). |
| 11 | Cursor A5, Gemini P3.1 | Display & protect: `How to Display and Protect Miniature Furniture`; Arts & Crafts `… at 1/12 Scale` (Gemini adds "(Mission)", which is in the meta) | **Accepted** | Zero/low clicks at pos ~7. "Mission" is OK because it's on the page. Gemini's "Museum Care Guide" title is rejected because it reads like a museum credential. |
| 12 | Cursor A6 | Joints title `Miniature Dovetail & Mortise Joints at 1/12` | **Accepted** | Not a top performer; Cursor calls it safe. |
| 13 | Cursor A7 | Workshop title/H1 alignment | **Accepted (optional)** | 20 impr pos 6.6. |
| 14 | Cursor B2, Gemini P2.2 | Victorian guide: comparison block (Gothic Revival/Eastlake/…) from existing claims; inbound period links; Gemini title `Victorian Dollhouse Furniture Guide: 1/12 Styles & Wood` | **Accepted (content + links); title optional** | 100 impr / 0 cl / pos 20.9. |
| 15 | Cursor C2 | Reciprocal links among period guides | **Accepted** | |
| 16 | Cursor B4, Gemini P3.2 | Batch zero-click posts (Queen Anne, four-poster…): first-paragraph answer + 2 hub links + title/meta | **Accepted (verify live first)** | |
| 17 | Cursor C3 | Optional `relatedSlugs` frontmatter override | **Deferred** | Code touch; do the content links first. |
| 18 | Gemini P1.1 | Auto-drop the ` \| Scott Dillingham Miniatures` suffix when a title is >60 chars / add `seoTitle` | **Deferred** | Sitewide, so it would change the top performers' rendered titles too, which conflicts with protecting them. Per-page edits (rows 1, 4–6, 11–12) get the same result where it matters. A warn-only CI length check is **Accepted**. |
| 19 | Gemini P1.1 | Scope JSON-LD by page type; remove HowTo from joints | **Deferred** | No GSC enhancement errors (Cursor D4: don't churn schema). HowTo is inert but harmless. |
| 20 | Gemini P1.1 | Hreflang cleanup | **Deferred / UNVERIFIED** | Single-language site; check what's emitted before changing anything. |
| 21 | Gemini P2.4, Cursor D6 | `/terms-of-service` variant / indexing | **Rejected** | Don't index terms to chase 1 click; the trailing-slash form already works. |
| 22 | Cursor D1 | Trailing-slash normalisation of markdown links | **Accepted** | |
| 23 | Cursor D2/D3 | Sitemap/robots/host: leave alone | **Accepted** | |
| 24 | Gemini P3.3, Cursor D5 | `/blog/` hub title/intro toward "miniature furniture guides"; gallery/workshop hubs | **Accepted (blog index); gallery Deferred** | Gallery is a 6.67% CTR page, so leave its title. |
| 25 | Both | Benchmark gap targets | **Rejected as targets** | |

**Decision counts (primary decision per row):** Accepted 15 · Rejected 5 · Deferred 5 (25 distinct recommendations).

## Implementation list
1. Step 1: rows 1–3 (scales + hub links; no title edits on top pages).
2. Step 2 frontmatter: rows 4–6, 11–13 (existing maker wording only).
3. Step 3: rows 14–16, 22, 24 (blog index only); warn-only CI title check (row 18).
4. Remeasure the scales URL and query; watch complete guide, beginners and home for regressions.

## Dropped or corrected claims
- Gemini's rewrites of the home, complete-guide, beginners and (deferred) wood titles: rejected to protect the top performers.
- "KSB Miniatures Collection artist" and "Museum Care Guide" (Gemini): replaced with the site's existing "maker" / "museum-exhibited" phrasing; no new credential wording.
- Sitewide suffix and schema refactors: deferred (they'd touch the top pages; no error evidence).
