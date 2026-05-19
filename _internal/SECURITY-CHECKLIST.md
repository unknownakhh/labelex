# Labelex Site — Security Checklist & Launch Readiness

A complete reference for securing the labelex.co.za website, customer data, and operational accounts.

**Site architecture:** Static HTML/CSS/JS hosted on GitHub Pages, custom domain labelex.co.za, contact form via Formspree, fonts via Google Fonts CDN.

**Last updated:** May 2026

---

## Why static sites are inherently safer

Before the checklist, context worth knowing:

Most "site got hacked" stories involve **CMS platforms** like WordPress, Wix, Squarespace, or Joomla. Those platforms have:

- A database that can be breached
- An admin login that can be brute-forced
- Plugins with vulnerabilities
- Server-side code that can be exploited

This site has **none of those**. It is plain HTML, CSS, JavaScript, and image files served from GitHub. There is no database to break into, no admin panel, no server-side code to exploit. The traditional "site can be hacked" worry is largely a non-issue.

**Where the real risk lives:** your accounts, your DNS, your form endpoint, and customer data handling.

---

## Threat model — what we are protecting against

| Threat | How it could happen | Where it is addressed |
|---|---|---|
| Site defacement | GitHub account compromised, attacker pushes malicious code | Layer 1 (Accounts) |
| Domain hijacking | Domain registrar account compromised, DNS pointed at phishing site | Layer 1 (Accounts) + Layer 5 (DNS) |
| Customer data leak | Form data intercepted in transit, or Formspree account breached | Layer 2 (Transport) + Layer 3 (Form) |
| Phishing impersonation | Attacker spoofs `hello@labelex.co.za` emails to customers | Layer 5 (Email) |
| Spam/bot flooding the form | Bots submit thousands of garbage entries | Layer 3 (Form) |
| Legal/regulatory penalty | Customer complains about data handling under POPIA | Layer 4 (Compliance) |
| Site downtime | Hosting issue, DNS error, certificate expiry | Layer 7 (Monitoring) |

---

## Layer 1 — Account security (highest priority)

The only realistic way someone can change this site is if they gain access to an account that controls it. Lock these down with two-factor authentication (2FA).

### Action items

- [ ] **GitHub account (`unknownakhh`)** — enable 2FA via Settings → Password and authentication → Two-factor authentication. Use an authenticator app (Google Authenticator, Authy) or a hardware key, not SMS.
- [ ] **Primary email account** that owns GitHub — enable 2FA. If this email is compromised, attackers can reset GitHub.
- [ ] **Domain registrar account** (wherever labelex.co.za is registered) — enable 2FA and "registrar lock" if offered.
- [ ] **Formspree account** — enable 2FA.
- [ ] **Use a password manager** (Bitwarden free tier, 1Password, or similar) for all of the above. Reused passwords across services are the leading cause of small-business account compromise.
- [ ] **Review GitHub repo collaborators** — make sure only people who should have write access do. Settings → Collaborators.

---

## Layer 2 — Transport security (data in flight)

### What HTTPS does

When customers fill out the quote form, their information travels from their browser to Formspree. HTTPS (the padlock icon) encrypts that traffic so no one on the same Wi-Fi network can read it.

### Action items

- [ ] **Verify HTTPS works on the GitHub Pages URL** — visit `https://unknownakhh.github.io/labelex/` and confirm the padlock appears.
- [ ] **When labelex.co.za DNS is configured**, point it at GitHub Pages and wait for the Let's Encrypt certificate to issue automatically (usually a few minutes to a few hours).
- [ ] **Tick "Enforce HTTPS"** in Settings → Pages once the certificate is issued. This ensures anyone typing `http://labelex.co.za` is automatically redirected to `https://`.
- [ ] **Add HSTS (HTTP Strict Transport Security)** — once enforce HTTPS is on, the site will automatically send this header. Tells browsers to never downgrade to HTTP for this domain.

---

## Layer 3 — The quote form (where customer data is collected)

This is the only place on the site where personal information actually flows. Three things need attention.

### 3a. Replace the placeholder Formspree endpoint

The current form action is `https://formspree.io/f/PENDING` — this is a placeholder. **The form does not submit anywhere right now.** Submissions are lost.

- [ ] **Sign up at formspree.io** with your business email (`hello@labelex.co.za` ideally).
- [ ] **Create a new form**, copy the unique form ID Formspree provides.
- [ ] **Replace `PENDING`** in the form action attribute on the homepage and contact page with the real form ID.
- [ ] **Test a submission** end-to-end to confirm emails arrive at the right inbox.

### 3b. Add bot protection

Without this, the form will receive bot spam within weeks of going live.

- [ ] **Enable honeypot field** in Formspree settings — a hidden field that automated bots fill in. Real human users do not see it, so legitimate submissions are unaffected.
- [ ] **Or enable reCAPTCHA/hCaptcha** for stronger protection — Formspree has this built in. Adds a small "I'm not a robot" checkbox.

### 3c. Use Formspree's built-in safeguards

These are configured in your Formspree dashboard once you have an account.

- [ ] Configure the **post-submission redirect** to a thank-you page on your own site (not Formspree's default). Controls the customer experience.
- [ ] Set up **email notifications** to the right inbox(es).
- [ ] On a paid plan, enable **rate limiting** to prevent submission flooding.
- [ ] Confirm Formspree's **GDPR/POPIA compliance** documentation in your records.

---

## Layer 4 — POPIA compliance (legal requirement in South Africa)

South Africa's Protection of Personal Information Act has been enforceable since 1 July 2021. Collecting names, email addresses, phone numbers, and company information through the form qualifies as processing personal information under POPIA.

**Penalty for non-compliance:** up to R10 million administrative fine, or up to 10 years' imprisonment for serious breaches.

### Action items

- [ ] **Create a Privacy Policy page** at `/privacy/` covering:
  - What personal information is collected (name, email, phone, company, message)
  - Why it is collected (responding to quote requests)
  - How long it is kept (suggest: 24 months after last contact)
  - Who it is shared with (Formspree as a data processor, your email provider, no marketing third parties)
  - How to request access, correction, or deletion of data (provide an email contact)
  - Contact details for the Information Officer (likely you as the business owner)
  - The lawful basis for processing (consent, as the customer voluntarily submitted)
- [ ] **Add a consent statement** to the form near the submit button: e.g. "By submitting this form you consent to Labelex processing your information to prepare your quote, as detailed in our Privacy Policy."
- [ ] **Add a footer link** to the Privacy Policy from every page.
- [ ] **Register as an Information Officer** with the Information Regulator if your business processes high volumes of personal information (likely not required for small B2B operations but worth confirming).
- [ ] **Document your data handling process** — keep a simple internal note of where customer data lives (Formspree, your email, any CRM) and how long you keep it.
- [ ] **Honour deletion requests within a reasonable time** if anyone asks. POPIA gives data subjects this right.
- [ ] **Have a breach notification plan** — if Formspree is ever compromised and your customer data is exposed, you must notify the Information Regulator and affected customers as soon as reasonably possible.

---

## Layer 5 — DNS and email security

Once labelex.co.za is live and `hello@labelex.co.za` is configured (Google Workspace, Zoho Mail, or similar), three DNS records prevent attackers from sending phishing emails that appear to come from your domain.

### Action items

- [ ] **SPF record** — declares which servers are authorised to send mail from labelex.co.za. Without this, anyone can send mail "from" your domain.
- [ ] **DKIM record** — adds a cryptographic signature to outgoing emails so receiving servers can verify authenticity.
- [ ] **DMARC record** — tells receiving servers what to do with mail that fails SPF/DKIM checks (recommend: `p=reject` or `p=quarantine`).
- [ ] **Domain registrar lock** — most registrars offer a "transfer lock" that prevents the domain from being transferred away without explicit unlock. Enable this.
- [ ] **Periodically check domain expiry** — set a calendar reminder to renew labelex.co.za well before it expires. Expired domains can be snapped up by squatters.

Most email providers (Google Workspace, Zoho, Microsoft 365) walk you through SPF/DKIM/DMARC setup automatically when you add your domain.

---

## Layer 6 — Optional hardening

These are not critical but add defense in depth.

### Action items

- [ ] **Content-Security-Policy (CSP) meta tag** — restricts what the browser is allowed to load on each page. Mitigates cross-site scripting if any vulnerability ever appears. Can be added via `<meta http-equiv="Content-Security-Policy" content="...">` in the HTML head.
- [ ] **Subresource Integrity (SRI)** on third-party scripts — adds a cryptographic hash to the Google Fonts link so the browser refuses to load it if Google's CDN is ever tampered with.
- [ ] **Strip EXIF metadata from product photos** before uploading — strips GPS coordinates and camera details. Tools: ImageOptim, Squoosh, ExifTool.
- [ ] **Add a `security.txt` file** at `/.well-known/security.txt` telling security researchers how to report vulnerabilities to you responsibly.
- [ ] **Backup the GitHub repository** — periodically download a `.zip` of the repo so you have a clean copy if the account is ever compromised. Quarterly is reasonable.
- [ ] **Review GitHub Actions / workflows** for any third-party actions running — confirm they are from trusted publishers.

---

## Layer 7 — Monitoring and incident response

You cannot prevent everything. You can detect problems quickly.

### Action items

- [ ] **Google Search Console** (free) — verify ownership of labelex.co.za. Google will email you if it detects malware, security warnings, or manual actions on your site.
- [ ] **UptimeRobot** (free) — monitors the site every 5 minutes and emails or SMSes you if it goes down.
- [ ] **Review GitHub audit log** quarterly — Settings → Security log shows every push, login, and account change. Catch anomalies.
- [ ] **Set up Google Analytics or Plausible** (privacy-focused alternative) so you can see if traffic patterns suddenly change — could indicate scraping, attacks, or a viral moment.
- [ ] **Document a recovery plan** — one page that lists: who has admin access, where the domain is registered, where the Formspree account is, what to do if a GitHub account is compromised. Keep this offline (printed or in a password manager).

---

## What is NOT applicable to this site

Worth knowing what you do not need to worry about:

| Concern | Why it does not apply |
|---|---|
| **PCI-DSS (credit card compliance)** | You do not accept online payments. Customers pay via EFT after quote approval. |
| **SQL injection** | There is no database. |
| **Cross-site request forgery (CSRF) on logins** | There is no login system. |
| **Server patching, OS updates** | GitHub Pages and Formspree handle their own infrastructure. |
| **DDoS protection** | GitHub Pages sits behind Fastly's CDN, which absorbs traffic surges automatically. |
| **WAF (Web Application Firewall)** | Not meaningful for a static site with no dynamic endpoints. |
| **Plugin vulnerabilities** | No plugins, no CMS. |

---

## Pre-launch checklist (do these before pointing labelex.co.za live)

In priority order — most critical first.

- [ ] 2FA enabled on GitHub, primary email, domain registrar, Formspree
- [ ] Formspree placeholder `PENDING` replaced with real form endpoint
- [ ] Form tested end-to-end (submission received in inbox)
- [ ] Honeypot or CAPTCHA enabled on Formspree
- [ ] Privacy Policy page written and published at `/privacy/`
- [ ] Footer link to Privacy Policy added on every page
- [ ] Form consent statement added near submit button
- [ ] HTTPS verified on GitHub Pages URL
- [ ] Custom domain configured and HTTPS certificate issued for labelex.co.za
- [ ] "Enforce HTTPS" turned on in GitHub Pages settings
- [ ] SPF, DKIM, DMARC records added for labelex.co.za (when business email is set up)
- [ ] Domain registrar lock enabled

---

## Post-launch maintenance (quarterly)

Set a quarterly calendar reminder.

- [ ] Review GitHub audit log for unusual activity
- [ ] Download backup zip of repo
- [ ] Test that all forms still submit successfully
- [ ] Confirm domain renewal date is more than 60 days away
- [ ] Confirm SSL certificate is valid and not expiring (GitHub renews Let's Encrypt automatically)
- [ ] Review any Formspree submissions for unusual patterns
- [ ] Check Google Search Console for any new security warnings
- [ ] Review and rotate passwords on critical accounts if needed
- [ ] Honour any pending POPIA deletion or access requests

---

## Incident response — if something goes wrong

### If you suspect your GitHub account is compromised

1. **Immediately change your password** and revoke all active sessions (Settings → Sessions → Revoke).
2. **Review recent commits** — has anyone pushed code you did not write?
3. **If malicious commits exist**, revert them with `git revert` or restore from your latest backup zip.
4. **Rotate all credentials**: GitHub password, any deploy keys, any tokens, then re-enable 2FA from scratch.
5. **Notify Formspree** in case the form has been redirected.

### If you suspect customer data has been exposed

1. **Document what happened, when, and what data was affected.**
2. **Notify the Information Regulator** (inforeg@justice.gov.za) within a reasonable time — POPIA requires this for breaches affecting personal information.
3. **Notify affected customers** by email with: what happened, what data was exposed, what you are doing about it, what they should do.
4. **Investigate the root cause** and document the remediation.

### If labelex.co.za stops resolving

1. **Check domain registrar** — is it expired? Has DNS been changed?
2. **Check GitHub Pages status** at https://www.githubstatus.com/
3. **Check the CNAME record** still points to GitHub's IPs.

---

## Is this everything?

**For this specific site architecture (static + Formspree + GitHub Pages):** yes, this covers all practically meaningful concerns.

**What it does not cover** (out of scope for any small business website):

- Nation-state attackers with unlimited budgets and time
- Zero-day vulnerabilities in browsers themselves
- Customers being phished or socially engineered on their own devices
- Physical theft of a customer's device after they submit the form
- Compromise of Formspree's own infrastructure (their responsibility, not yours)

Security is layered, not absolute. Following the checklist above puts this site at the same security level as 95%+ of South African small business websites — better than most, in fact, because the static architecture eliminates entire categories of risk that CMS-based competitors face.

---

## Resources

- South African Information Regulator: https://inforegulator.org.za/
- POPIA full text: https://popia.co.za/
- Formspree security docs: https://help.formspree.io/hc/en-us/categories/360002187393-Security-Privacy
- GitHub Pages docs: https://docs.github.com/en/pages
- Let's Encrypt (the SSL provider GitHub Pages uses): https://letsencrypt.org/

---

*Generated as part of pre-launch security planning for labelex.co.za.*
