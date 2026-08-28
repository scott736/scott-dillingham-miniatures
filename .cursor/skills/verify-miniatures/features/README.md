# Miniatures verification map

This directory is the maintained source for verifying visitor-facing behavior of Scott Dillingham Miniatures. Read this index before driving the site, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `node .cursor/skills/verify-miniatures/helpers/verify-miniatures.mjs launch`.
- Drive only `http://127.0.0.1:<port>` from that launch. Default port is 4321.
- Set `VERIFY_STATE_DIR` and `VERIFY_PORT` when a second run must not share the instance.
- Run `doctor` and require `"ok": true`.
- Never drive production, `workers.dev`, or an Astro process this run did not start.
- Chrome uses a private profile under the state directory. Do not attach to a user's existing Chrome.

## Driving conventions

- Start every recipe from `/` unless the feature file says otherwise.
- Prefer `--role` and `--name` over CSS.
- Treat every command as literal. Keep quoted names unchanged.
- HTTP goes through `get` and `post`. Clicks go through `browser`.
- Restore nothing on this site. Pages are static except the contact form and `localStorage` theme.
- Do not delete proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes a snapshot JSON and a screenshot with the brand or page heading visible.
- HTTP proof includes the URL, status, and saved body.
- Mutation proof for contact is a second read of the status text or the JSON body. Do not send a real email.
- Record the feature ID and entry point with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with verify-miniatures` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Home](./home.md) covers the landing hero, FAQ, and the gallery CTA.
- [Gallery](./gallery.md) covers the collection grid and piece lightbox.
- [Contact](./contact.md) covers the commission form, validation, and the no-send error path.
- [Blog](./blog.md) covers the article list, search, and opening a guide.
- [Workshop](./workshop.md) covers the maker workshop page and process heading.
