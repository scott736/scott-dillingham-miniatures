# Scott Dillingham Miniatures

Museum-exhibited handcrafted 1/12 scale miniature furniture by Scott Dillingham.

**Production:** Cloudflare Workers (`scott-dillingham-miniatures`)  
**Domain:** [https://scottdillinghamminiatures.com](https://scottdillinghamminiatures.com)  
**Sitemap:** [https://scottdillinghamminiatures.com/sitemap-index.xml](https://scottdillinghamminiatures.com/sitemap-index.xml)  
**GitHub:** [scott736/scott-dillingham-miniatures](https://github.com/scott736/scott-dillingham-miniatures)

This is the operational copy on Scott’s GitHub. Hosting is **Cloudflare Workers only** — not Vercel.

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

## DNS

Cloudflare zone `scottdillinghamminiatures.com` is **active**. Nameservers:

- `jason.ns.cloudflare.com`
- `laylah.ns.cloudflare.com`

Apex and `www` CNAME to this Worker (proxied). The Worker is also at `https://scott-dillingham-miniatures.scott-4d1.workers.dev`.

## SEO / AEO

| File | URL |
|---|---|
| Sitemap | https://scottdillinghamminiatures.com/sitemap-index.xml |
| Robots | https://scottdillinghamminiatures.com/robots.txt |
| LLMs index | https://scottdillinghamminiatures.com/llms.txt |
| LLMs full | https://scottdillinghamminiatures.com/llms-full.txt |
| FAQ JSON | https://scottdillinghamminiatures.com/llms-faq.json |
| AI policy | https://scottdillinghamminiatures.com/ai.txt |
| Well-known AI | https://scottdillinghamminiatures.com/.well-known/ai.txt |
| IndexNow key | https://scottdillinghamminiatures.com/sdm-indexnow-20260823-a7f4c91e.txt |

Deploy pings IndexNow so Bing can pick up new URLs quickly.

## Stack

- Astro 7 + React islands + Tailwind 4
- `@astrojs/cloudflare` on Cloudflare Workers
- Content collections for the blog
- Resend for `/api/contact`
