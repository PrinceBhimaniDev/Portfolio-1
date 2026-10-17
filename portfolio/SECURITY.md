# Security Considerations for a Public Portfolio

This portfolio is a public website hosted on Vercel. Its contact form sends email through the EmailJS service directly from the browser.

## Important rules

- Do not publish API keys, passwords, tokens, or private credentials.
- Do not include internal network details, internal IP ranges, or security environment secrets.
- Do not expose personal data beyond what you intentionally share in the portfolio.
- Keep the site focused only on professional experience, projects, and public information.

## Basic security guidance

### 1. Use only public information

Keep the content limited to details that are already shared in your public professional profile or resume.

### 2. Avoid sensitive data in the frontend

Frontend code can be inspected by anyone. Never put secrets, private access tokens, admin credentials, or authentication keys into HTML, CSS, JavaScript, or configuration files.

The EmailJS public key is not a secret. It is designed to be published, and it can only trigger the templates that exist in the EmailJS account. Treat the EmailJS account password, and any private key you generate there, as secrets and never commit them.

### 3. Check links carefully

Only use public links or placeholders. Avoid linking to private systems, internal dashboards, or sensitive infrastructure.

### 4. Keep portfolio content professional

Your portfolio is public and may be reviewed by recruiters, hiring teams, and cybersecurity professionals. The content should be accurate, concise, and professional.

### 5. Review before publishing

Before deploying to Vercel or connecting a custom domain, check:

- all links are valid
- there are no broken image paths
- the resume file path exists
- the site works locally
- there are no secrets or private references

## Contact form protections, and their limits

The form includes several layers of defence. Each one is intentionally simple, so it is worth knowing exactly what it does and does not stop.

| Control | Where | What it does | Limit |
| --- | --- | --- | --- |
| Honeypot field (`_honey`) | Browser | Silently discards submissions where a hidden field was filled, which is typical of bots | A human, or a bot that reads CSS, can ignore it |
| Length limits | Browser + input `maxlength` | Caps name, email, and message size | Bypassed by editing the page or calling the API directly |
| Email shape check | Browser | Rejects obviously invalid addresses | Not proof the address exists |
| Line-break stripping | Browser | Removes `\r` and `\n` from the name and email so they cannot inject extra mail headers | Server-side validation would be stronger, but EmailJS templates also place these values in the body |
| Submission throttle | Browser | One submission every 20 seconds per browser tab, plus a 1.2 second pause between the two EmailJS requests (EmailJS allows 1 request per second) | Trivially bypassed; it only prevents accidental double sends |
| Origin restriction | EmailJS account | On a paid plan, requests can be restricted to your domains | The free plan has no domain whitelist, so any page can trigger the templates |
| Public key exposure | By design | No secret is shipped to the visitor | The endpoint itself is abusable, so monitor the EmailJS usage quota |
| Security headers | `vercel.json` | CSP restricts scripts to the site and jsDelivr, and network calls to the site and `api.emailjs.com`; HSTS, `X-Frame-Options: DENY`, `nosniff`, and `Referrer-Policy` are also set | Headers protect the visitor's browser, not the EmailJS account |

### Practical consequence

Because the EmailJS public key is public, anyone who reads the page source can send mail through your templates. That is an accepted trade-off for a small personal contact form, and it is why the free plan's 200 requests per month is worth watching. If abuse ever becomes a problem:

- add the domain whitelist, which requires a paid EmailJS plan
- add a CAPTCHA (EmailJS supports Google reCAPTCHA)
- move to a server-side mail API with a secret key and rate limiting

### Hosting notes

- `vercel.json` replaces the old Cloudflare `_headers` file, which Vercel ignores. Without it, the site would be served with no security headers at all.
- The Content-Security-Policy allows only the site itself, the EmailJS script CDN, and the EmailJS API. Do not widen it without a reason.

## Security testing note

Security testing should always be done in an authorized and ethical manner. This portfolio and security lab are for learning and defensive practice only.

Examples of safe learning include:

- exploring public documentation
- studying web security concepts
- reviewing safe lab setups
- learning about security monitoring and testing tools in controlled environments

Do not test or scan systems that you do not own or are not explicitly authorized to test.

## Defensive mindset

This portfolio reflects a defensive and professional cybersecurity approach. It is a place to document learning, practice, and career growth without exposing private or sensitive information.
