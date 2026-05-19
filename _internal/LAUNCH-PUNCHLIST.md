# LabelEx — Launch Punch List

Pre-launch remediation tracker. Pair this with `SECURITY-CHECKLIST.md` (which owns the
account / DNS / legal / monitoring side). This file owns the **in-repo content fixes**.

**Owner key:** `[code]` = a file edit · `[you]` = external account / DNS action

---

## P0 — URGENT · site is broken / illegal / loses every lead
Must be done before pointing DNS at the site.

- [ ] **1. Quote forms submit nowhere** `[code + you]`
  `action="https://formspree.io/f/PENDING"` on every form:
  `index.html:457`, `contact/index.html:148`, `products/index.html:441`,
  `about/index.html:444`, `locations/johannesburg/index.html:559`.
  You: create Formspree form + enable honeypot/captcha. Then replace `PENDING` with the
  real ID in all forms and test one submission end-to-end.

- [ ] **2. Phone number is a placeholder — in two formats** `[code]`
  - `27000000000`: `products/index.html` (214, 266, 314, 431, 502, 514),
    `contact/index.html` (116, 445, 457), `about/index.html` (425, 505, 517)
  - `27XXXXXXXXX`: `index.html` (179, 438, 536, 549), `blog/index.html` (691, 772, 785),
    `blog/self-adhesive-labels-guide/index.html` (925, 990, 1074, 1087),
    `locations/johannesburg/index.html` (599, 794, 840)
  - Display text `+27 [PENDING]`: `about/index.html:429`, `products/index.html:432`

- [ ] **3. Email placeholder / inconsistency** `[code]`
  `[PENDING]@labelex.co.za` on `about/index.html:437` and `products/index.html:436`;
  rest of site uses `hello@labelex.co.za`. Confirm real inbox, make consistent everywhere.

- [ ] **4. `sitemap.xml` and `robots.txt` are empty** `[code]`
  Populate sitemap with all live URLs on `labelex.co.za`; robots.txt allow crawl +
  `Sitemap:` line. Search Console submission fails without this.

- [ ] **5. No Privacy Policy → POPIA non-compliance** `[code + you]`
  Legal blocker (SECURITY-CHECKLIST Layer 4). Create `/privacy/`, footer link on every
  page, consent line near each submit button.

## P1 — HIGH · trust / SEO / social · do before launch

- [ ] **6. Broken logo in structured data** `[code + you]`
  JSON-LD `"logo"`/`"image"` → `https://labelex.co.za/img/logo.png` (404 — logo files
  deleted). At `index.html:22`, `blog/self-adhesive-labels-guide/index.html:39`,
  `locations/johannesburg/index.html:24`. Add a real ~512px logo PNG; doubles as OG fallback.

- [ ] **7. No social-share tags on main pages** `[code]`
  Homepage, products, about, contact have no OpenGraph/Twitter/canonical. Add `og:*` +
  `twitter:card` + `canonical` (blog post is a working template). Needs a 1200×630 image.

- [ ] **8. Hero images are heavy** `[code]`
  `img/product/AdhesiveHero.png` / `HeatShrinkHero.png` / `HotMeltHero.png` ≈ 1.5 MB each.
  Convert to WebP < 250 KB + JPEG fallback; rewire tags. Check `img/home/*` too.

- [ ] **9. Deployment essentials missing** `[code + you]`
  Add `CNAME` file (GitHub Pages custom domain). Add `404.html`. After DNS resolves: tick
  "Enforce HTTPS".

## Values & decisions needed to unblock the above

- [ ] Real WhatsApp number (international format)
- [ ] Confirmed inbox address (`hello@labelex.co.za`?)
- [ ] Formspree form ID (after creating the form)
- [ ] Johannesburg page — launch (fix + add to sitemap) or hold back?
- [ ] One 1200×630 social image (or approve reusing a product hero)

## Run in parallel — owned by SECURITY-CHECKLIST.md `[you]`

2FA (GitHub / email / registrar / Formspree) · domain DNS · SPF/DKIM/DMARC · registrar
lock · Search Console verification · UptimeRobot · analytics · backups.
