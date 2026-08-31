let meta = #{
    name: "site-health",
    description: "Audit Scott Dillingham Miniatures for SEO, live breakage, bugs, and page weight",
    when_to_use: "When checking scottdillinghamminiatures.com (or this repo) for SEO, broken pages, bugs, or making the site lighter.",
    phases: [
        #{ title: "Scan", detail: "parallel SEO, live pages, bugs, weight" },
        #{ title: "Verify", detail: "adversarial check of each finding" },
        #{ title: "Report", detail: "write confirmed issues" },
    ],
};

let findings_schema = #{
    "type": "object",
    "required": ["findings"],
    "properties": #{
        "findings": #{
            "type": "array",
            "maxItems": 10,
            "items": #{
                "type": "object",
                "required": ["area", "severity", "issue", "evidence", "fix"],
                "properties": #{
                    "area": #{ "type": "string" },
                    "severity": #{ "type": "string" },
                    "issue": #{ "type": "string" },
                    "evidence": #{ "type": "string" },
                    "fix": #{ "type": "string" },
                },
            },
        },
    },
};

let verdict_schema = #{
    "type": "object",
    "required": ["real", "reason", "evidence"],
    "properties": #{
        "real": #{ "type": "boolean" },
        "reason": #{ "type": "string" },
        "evidence": #{ "type": "string" },
    },
};

let repo = "/Users/scottdillingham/GitHub/scott-dillingham-miniatures";
let live = "https://scottdillinghamminiatures.com";
if args != () {
    if args.repo != () { repo = args.repo; }
    if args.live != () { live = args.live; }
}

phase("Scan");

let p_seo = "";
p_seo += "You are auditing SEO for Scott Dillingham Miniatures. ";
p_seo += "Repo: " + repo + ". Live: " + live + ". ";
p_seo += "Use grep, read_file, and curl. Do not invent. ";
p_seo += "Read src/components/BaseHead.astro, src/layouts/, src/lib/schema.ts, src/lib/aeo.ts, src/consts.ts, astro.config.mjs. ";
p_seo += "Fetch live: /, /about/, /gallery/, /workshop/, /contact/, /blog/, robots.txt, sitemap-index.xml, llms.txt, ai.txt. ";
p_seo += "For each HTML page check: unique title, unique meta description, canonical, og:title/og:image, twitter tags, one H1, JSON-LD, no unexpected noindex, no keywords meta, brand name not duplicated in title. ";
p_seo += "Confirm sitemap URLs return 200. Flag missing alt on images in src/. ";
p_seo += "Report at most 10 findings as {area, severity (high|medium|low), issue, evidence, fix}. ";
p_seo += "Empty list is valid only after reading BaseHead and fetching those live URLs.";

let p_live = "";
p_live += "You are checking live breakage for Scott Dillingham Miniatures. ";
p_live += "Repo: " + repo + ". Live: " + live + ". ";
p_live += "Use curl -sI and curl -s. Also read src/pages/ to know every route. ";
p_live += "Hit at least: /, /about/, /gallery/, /workshop/, /contact/, /blog/, /privacy-policy/, /terms-of-service/, /image-license/, /404 (expect 404), /rss.xml, /sitemap-index.xml, /robots.txt, /llms.txt, /llms-full.txt, /llms-faq.json, /ai.txt, /.well-known/ai.txt. ";
p_live += "Sample two blog posts from the sitemap or /blog/ HTML. ";
p_live += "For each: HTTP status, server cloudflare, body not empty, no 500 HTML. ";
p_live += "Extract first-party CSS/JS/image URLs from homepage HTML and HEAD-check they are not 404. ";
p_live += "POST /api/contact with empty JSON and note status (4xx is OK; 500 is a finding). ";
p_live += "Report at most 10 findings {area, severity, issue, evidence, fix}. Empty list only after those fetches.";

let p_bugs = "";
p_bugs += "You are hunting bugs and leftover template defects in " + repo + ". ";
p_bugs += "Use grep and read_file on src/. Do not invent. ";
p_bugs += "Hunt leftover Sonic/template names: why-sonic, Sonic, dummy product/pricing copy, placeholder lorem, TODO, FIXME, href=\"#\", broken imports. ";
p_bugs += "Read contact.tsx and src/pages/api/contact.ts for missing validation, CORS, or Resend errors swallowed. ";
p_bugs += "Check navbar/footer links match real pages. Check 404.astro exists and is wired. ";
p_bugs += "Flag client islands (client:load / client:visible) that should be lighter or that crash without JS. ";
p_bugs += "Report at most 10 findings {area, severity, issue, evidence, fix}. Empty list only after grepping those patterns and reading contact + layouts.";

let p_weight = "";
p_weight += "You are finding ways to make " + repo + " and live " + live + " lighter. ";
p_weight += "Use grep, read_file, and curl. Look at package.json, astro.config.mjs, src/components, public/, src/assets. ";
p_weight += "Measure: how many React islands, motion/framer usage, lucide-react import style (barrel vs per-icon), unused components, large images in public/ and src/assets (note byte size if you can stat). ";
p_weight += "curl -sI homepage CSS/JS and note content-length. Flag uncompressed or huge hero images, unused CSS, client:load where client:visible or none would do. ";
p_weight += "Only report concrete weight wins (file, what to change, expected effect). Do not suggest rewriting the stack. ";
p_weight += "Report at most 10 findings {area, severity, issue, evidence, fix}. Empty list only after inspecting package.json, components, and live asset headers.";

let jobs = [
    #{ prompt: p_seo, label: "scan:seo", capability_mode: "execute", output_schema: findings_schema },
    #{ prompt: p_live, label: "scan:live", capability_mode: "execute", output_schema: findings_schema },
    #{ prompt: p_bugs, label: "scan:bugs", capability_mode: "read-only", output_schema: findings_schema },
    #{ prompt: p_weight, label: "scan:weight", capability_mode: "execute", output_schema: findings_schema },
];
let results = parallel(jobs);

let findings = [];
for r in results {
    if r != () && r.success && r.output.findings != () {
        for f in r.output.findings { findings.push(f); }
    }
}

if findings.len() == 0 {
    let ok = "# Site health — Scott Dillingham Miniatures\n\nNo findings after SEO, live pages, bugs, and weight scans.\n";
    let path = write_scratch_file("site-health.md", ok);
    complete(#{ path: path, summary: "No findings", confirmed: [] });
}

const MAX_VERIFY = 16;
let to_verify = [];
let fi = 0;
for f in findings {
    if fi < MAX_VERIFY { to_verify.push(f); }
    fi += 1;
}
if findings.len() > MAX_VERIFY {
    log("Capped verification at " + MAX_VERIFY.to_string() + " of " + findings.len().to_string() + " findings");
}

phase("Verify");
let vjobs = [];
let vi = 0;
for f in to_verify {
    let vp = "";
    vp += "Adversarially verify this site-health finding for repo " + repo + " live " + live + ". ";
    vp += "Issue: " + json_encode(f.issue) + " Area: " + json_encode(f.area) + " Claimed evidence: " + json_encode(f.evidence) + ". ";
    vp += "Use grep, read_file, and curl. Set real=true only with independent evidence you inspected. ";
    vp += "False positives: intentional noindex on 404, contact API 4xx on empty POST, Workers KV unused at rest, Astro View Transitions if present by design. ";
    vp += "If you cannot re-read the file or URL, real=false.";
    vjobs.push(#{
        prompt: vp,
        label: "verify:" + vi.to_string(),
        capability_mode: "execute",
        output_schema: verdict_schema,
    });
    vi += 1;
}
let verdicts = parallel(vjobs);

let confirmed = [];
let i = 0;
for v in verdicts {
    if v != () && v.success && v.output.real == true && v.output.evidence != () && v.output.evidence != "" {
        confirmed.push(to_verify[i]);
    }
    i += 1;
}

phase("Report");
let md = "# Site health — Scott Dillingham Miniatures\n\n";
md += "Live: " + live + "\n";
md += "Repo: " + repo + "\n\n";
md += "Confirmed: " + confirmed.len().to_string() + " of " + findings.len().to_string() + " scanned";
if findings.len() > MAX_VERIFY {
    md += " (verification capped at " + MAX_VERIFY.to_string() + ")";
}
md += ".\n\n";
if confirmed.len() == 0 {
    md += "None of the scanned issues survived verification.\n";
} else {
    for c in confirmed {
        md += "## [" + c.severity + "] " + c.area + "\n\n";
        md += c.issue + "\n\n";
        md += "Evidence: " + c.evidence + "\n\n";
        md += "Fix: " + c.fix + "\n\n";
    }
}
let out_path = write_scratch_file("site-health.md", md);
complete(#{
    path: out_path,
    summary: confirmed.len().to_string() + " confirmed findings",
    scanned: findings.len(),
    confirmed: confirmed,
});
