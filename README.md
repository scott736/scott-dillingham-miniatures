# Scott Dillingham Miniatures

Museum-exhibited handcrafted 1/12 scale miniature furniture by Scott Dillingham.

**Production:** Cloudflare Workers (`scott-dillingham-miniatures`)  
**Domain:** [https://scottdillinghamminiatures.com](https://scottdillinghamminiatures.com)  
**GitHub:** [scott736/scott-dillingham-miniatures](https://github.com/scott736/scott-dillingham-miniatures)

This is the operational copy on Scott’s GitHub. The older Vercel project on `OilyJoker/Website` is no longer the deploy target.

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Deploy

Push to `main` (GitHub Actions → `wrangler deploy`) or:

```bash
npm run deploy
```

Contact-form secret (Worker runtime, not the repo):

```bash
printf '%s' "$RESEND_API_KEY" | npx wrangler secret put RESEND_API_KEY
```

Optional: `RESEND_FROM_EMAIL` (defaults to `hello@scottdillinghamminiatures.com` in `src/consts.ts`).

## DNS cutover

Registrar is Tucows; DNS is still SiteGround (`ns1.siteground.net` / `ns2.siteground.net`). Point the domain at Cloudflare:

1. At the registrar, replace both nameservers with:
   - `jason.ns.cloudflare.com`
   - `laylah.ns.cloudflare.com`
2. Wait until the zone status is **Active** (often minutes, sometimes a few hours).
3. Apex and `www` are already routed to this Worker.

Until nameservers change, the Worker is live at `https://scott-dillingham-miniatures.scott-4d1.workers.dev`.

## Stack

- Astro 7 + React islands + Tailwind 4
- `@astrojs/cloudflare` on Cloudflare Workers
- Content collections for the blog
- Resend for `/api/contact`
