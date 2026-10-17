# Trushti Patel Portfolio

This is a portfolio website for Trushti Patel, hosted on Vercel. Its contact form sends a real email to the owner and a confirmation email to the visitor, using the EmailJS service. There is no backend server of our own and no secret keys in the frontend.

## 1. Project overview

This portfolio is designed for:

- recruiters looking for cybersecurity talent
- cybersecurity professionals reviewing technical background
- technical interviewers checking security knowledge and work experience

The site contains information from the provided resume only, without adding invented certifications, tools, or projects.

## 2. Technologies used

- HTML5
- CSS3
- Vanilla JavaScript
- Vercel for hosting (static serving plus security headers)
- EmailJS for sending form email
- SVG favicon placeholder
- PDF resume placeholder

## 3. Folder structure

```text
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── icons/
│       └── favicon.svg
├── resume/
│   └── Trushti_Resume.pdf
├── vercel.json
├── README.md
├── SECURITY.md
├── .gitignore
└── .nojekyll
```

## 4. How the contact form works

```text
Visitor submits form
        │
        ▼
js/script.js checks the form in the browser
(honeypot, length limits, email shape, throttle)
        │
        ▼
EmailJS API (https://api.emailjs.com) sends two emails
        │
        ├──► 1. Notification to pateltrushtiv@gmail.com
        │        with the visitor's message, reply_to = visitor
        │
        └──► 2. Confirmation to the visitor:
                 "I received your message and will reply soon"
```

The browser talks directly to EmailJS. The site stays static, so there is no server of ours that could leak a secret, and EmailJS's public key is safe to publish in the JavaScript.

## 5. Set up the contact form mail (step by step)

This guide assumes you have never used EmailJS before. Follow it in order; it takes about 15 minutes and needs no credit card.

**What you are building:** when a visitor submits the form, EmailJS sends *two* emails — one notification to you, and one confirmation to the visitor. The form never opens an email app.

### What you will collect

You need four values. Write each one down as you find it, because you will paste all four into the code at Step 6.

| Value | Looks like | Where it comes from |
| --- | --- | --- |
| Public Key | `Ab1Cd2Ef3Gh4Ij5K` | Step 5 (Account → General) |
| Service ID | `service_abc1234` | Step 2 (Email Services) |
| Owner Template ID | `template_xyz9876` | Step 3 (Email Templates) |
| Confirm Template ID | `template_qrs5432` | Step 4 (Email Templates) |

### Step 1 — Create your EmailJS account

1. Open https://dashboard.emailjs.com/sign-up
2. Sign up with your Google account, or with an email and password. No credit card is needed.
3. If it asks you to confirm your email address, click the link in that email.
4. You land on the EmailJS dashboard. Keep this tab open.

### Step 2 — Connect the Gmail mailbox that will send the mail

1. In the left sidebar, click **Email Services**.
2. Click **Add New Service** (or the **+** button) to open the service list.
3. Under **Personal Services**, choose **Gmail**.
4. Fill in the **Name** field with `Portfolio Contact`.
5. Fill in the **Service ID** field with exactly `contact_service` (lowercase, no spaces).
6. Click **Connect Account**, pick `pateltrushtiv@gmail.com` in the Google window, then click **Allow**. (This is a one-time Google permission so EmailJS may send mail on your behalf.)
7. Click **Add Service**.

> Write it down: **Service ID = `contact_service`**
>
> Tip: Google may show a "Google hasn't verified this app" warning for test apps. Choose **Advanced → Go to EmailJS (unsafe)** only if you trust the service and are using your own account.

### Step 3 — Create template 1: the notification you receive

1. In the left sidebar, click **Email Templates**.
2. Click **Create New Template**.
3. At the top where it says "Untitled Template" (or via the **Settings** tab), rename it to `Portfolio - Owner Notification`.
4. Go to the **Settings** tab and fill in these fields:
   - **To Email:** `pateltrushtiv@gmail.com`
   - **From Name:** `{{from_name}}`
   - **Reply To:** `{{reply_to}}`
   - **Subject:** `Portfolio contact from {{from_name}}`
5. Go back to the **Content** tab and replace the body with this:

   ```text
   New message from your portfolio contact form.

   Name:  {{from_name}}
   Email: {{visitor_email}}
   (Reply directly to this email to answer the visitor.)

   Message:
   {{message}}
   ```

6. Click **Save** (or **Save & Close**).
7. In the template list, the **Template ID** is shown under the template name (it looks like `template_xyz9876`).

> Write it down: **Owner Template ID = `template_...`**

### Step 4 — Create template 2: the confirmation the visitor receives

1. Still in **Email Templates**, click **Create New Template** again.
2. Name it `Portfolio - Visitor Confirmation`.
3. In the **Settings** tab:
   - **To Email:** `{{to_email}}` (this becomes the visitor's address)
   - **From Name:** `Trushti Patel`
   - **Reply To:** `pateltrushtiv@gmail.com`
   - **Subject:** `Thanks for your message`
4. In the **Content** tab, use this body:

   ```text
   Hi {{from_name}},

   thank you for reaching out through my portfolio. I have received
   your message and will reply to {{visitor_email}} shortly.

   Best regards,
   Trushti Patel
   ```

5. Click **Save** and copy the new **Template ID**.

> Write it down: **Confirm Template ID = `template_...`**

> Free plan note: the free plan allows a maximum of **2 templates**, and you have now created exactly two. Do not add a third without upgrading.

### Step 5 — Copy your Public Key

1. In the left sidebar, click **Account**, then open the **General** tab.
2. Scroll to the **API Keys** section and copy the **Public Key**.

> Write it down: **Public Key = `...`**

This key is meant to be public. It only lets someone trigger *your* templates with *your* content — it cannot be used to send arbitrary spam.

### Step 6 — Paste the four values into the code

1. Open `js/script.js` in any text editor.
2. At the very top you will see this block with placeholder text:

   ```javascript
   const EMAILJS_CONFIG = {
     publicKey: "YOUR_PUBLIC_KEY",
     serviceId: "YOUR_SERVICE_ID",
     ownerTemplateId: "YOUR_OWNER_TEMPLATE_ID",
     confirmTemplateId: "YOUR_CONFIRM_TEMPLATE_ID",
     toEmail: "pateltrushtiv@gmail.com",
   };
   ```

3. Replace each placeholder with your value, keeping the quotes and commas exactly as they are:

   ```javascript
   const EMAILJS_CONFIG = {
     publicKey: "Ab1Cd2Ef3Gh4Ij5K",
     serviceId: "contact_service",
     ownerTemplateId: "template_xyz9876",
     confirmTemplateId: "template_qrs5432",
     toEmail: "pateltrushtiv@gmail.com",
   };
   ```

4. Save the file.

If any placeholder that starts with `YOUR_` is left behind, the form politely says it is not set up yet and sends nothing. That is intentional, so a half-finished setup never loses a visitor's message silently.

### Step 7 — Test the form on your computer

1. In a terminal, from the `portfolio` folder, run:

   ```bash
   npx vercel dev
   ```

2. Open the URL it prints (usually http://localhost:3000) and scroll to the contact form.
3. Submit it using a **real email address you can open** in the Email field, so you can check the confirmation mail.
4. Expected result: the button shows *Sending…*, then a green *"Thanks! Your message has been sent. A confirmation email is on its way."*, and the form clears.
5. Check your inbox for the notification email and the test address for the confirmation email. Also check the spam folder the first time.

If it does not work, see **Step 8**.

### Step 8 — Fix common problems

| What you see | Cause | Fix |
| --- | --- | --- |
| "The contact form is not set up yet" | A `YOUR_...` placeholder is still in `js/script.js` | Finish Step 6, then hard-refresh the page (Ctrl/Cmd + Shift + R) |
| "The mail service could not load" | The EmailJS script was blocked | Disable the ad blocker for this site, and check `vercel.json` still lists `https://cdn.jsdelivr.net` and `https://api.emailjs.com` |
| Red message, EmailJS error in the browser console (F12) | A wrong Service ID or Template ID | Re-copy the IDs from the dashboard and paste them again (Step 6) |
| `412` or `400` error in the console | A template variable does not match | Confirm the template uses `{{from_name}}`, `{{visitor_email}}`, `{{reply_to}}`, `{{message}}`, `{{to_email}}` exactly (Steps 3 and 4) |
| `429` error in the console | Too many requests in a short time | Wait a minute and try again. The form already pauses between the two emails and rate-limits repeated submits |
| Sending works, but no email arrives | Spam filtering, or the connected Gmail account is not the one you expect | Check spam, then open **Email Services** in EmailJS and confirm which mailbox is connected |
| Mail arrives only in your inbox, not the visitor's | The confirmation template was not saved or the **To Email** is not `{{to_email}}` | Redo Step 4 and save the template |
| Nothing arrives and the dashboard shows no request | The form was never submitted, or an old cached page is loaded | Hard-refresh (Ctrl/Cmd + Shift + R) and submit again |
| `The maximum number of templates has been reached` | The free plan allows 2 templates | Reuse or edit an existing template instead of creating a third |

You can also see every send attempt, with its variables, in the EmailJS dashboard under **Email History**.

### Step 9 — Publish it

1. Commit and push the change (see section 9), or click **Redeploy** in Vercel.
2. Open the live site, submit one real test message, and confirm both emails arrive.

### Free plan limits, and what they mean for you

- **200 requests per month.** Each submission uses 2 requests (notification + confirmation), so that is about **100 messages per month**.
- **2 email templates maximum.** The setup above uses both slots.
- **1 request per second.** The code waits 1.2 seconds between the two emails so the confirmation is not dropped. Do not remove that wait.
- **No domain whitelist on the free plan**, so anyone who reads the page source can trigger your templates. They cannot change who the email goes to or what it says. Watch the monthly quota in the dashboard, and see `SECURITY.md` for what to do if that ever becomes a problem.
- **"Email sent via EmailJS" footer** appears in the emails until you upgrade; it does not affect delivery.

## 6. How to run locally

Run the project with the Vercel CLI:

```bash
npx vercel dev
```

Open the local URL it prints (usually http://localhost:3000). No environment variables or secrets are required; everything the form needs lives in `js/script.js`.

## 7. Deploy to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, click **Add New → Project** and import the repository.
3. Set **Root Directory** to `portfolio` (the portfolio lives in a subfolder of the repository). If you deploy the portfolio folder on its own, leave it as `/`.
4. Leave the build command empty and use the default output settings.
5. Deploy. Every future push to the main branch is published automatically.

### Security headers

`vercel.json` sets the security headers for every page: Content-Security-Policy, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`. The Content-Security-Policy allows the EmailJS API and the EmailJS script on the jsDelivr CDN, and nothing else beyond the site's own files.

Check them after a deploy:

```bash
curl -I https://trushti.space
```

### If the contact form fails

Full step-by-step troubleshooting lives in **section 5 → Step 8**. Before anything else:

1. In Vercel, open the project → **Deployments** and confirm the latest deployment succeeded.
2. Open the live site, press **F12** (or right-click → **Inspect**), open the **Console**, and submit the form. EmailJS errors appear there.
3. Confirm the four EmailJS values are filled in (section 5, Step 6) — a `YOUR_...` placeholder left in place explains most failures.

## 8. Connect `trushti.space` from Spaceship

1. In Vercel, open **Project → Settings → Domains** and add `trushti.space` (and `www.trushti.space` if you want it).
2. Vercel shows the DNS records to create. In Spaceship, open the domain's DNS settings and add those records (an `A` record for the root and a `CNAME` for `www`).
3. Wait for DNS to activate. Vercel then issues the HTTPS certificate automatically.

## 9. How to update the portfolio

To update the site:

1. Edit the HTML, CSS, or JavaScript files.
2. Save the changes.
3. Commit them:

```bash
git add .
git commit -m "Update portfolio content"
git push
```

Vercel publishes the newest version automatically after a short delay.

## Beginner-friendly networking explanation

### GitHub repository
A GitHub repository is just a project storage space. It stores your files online and tracks version history.

### Vercel
Vercel hosts the HTML and CSS for this site.

### EmailJS
EmailJS is a service that turns an HTTP request into an email. The form sends your message to the EmailJS API, and EmailJS delivers it from the mailbox you connected.

### DNS
DNS is the system that translates human-readable names like `example.com` into IP addresses that computers use.

### Domain
A domain is a name you buy, such as `example.com` or `yourname.com`.

### Public IP
A public IP is the address assigned to a machine connected to the internet. Web servers typically use a public IP so other computers can reach them.

### Web server
A web server is software or hardware that listens for web requests and sends files back to the client. In this project, Vercel serves the website.

This is a beginner-friendly way to think about it:

- domain = website name
- DNS = phonebook for names
- public IP = internet address
- web server = service that responds to requests
- Vercel = hosted website
- EmailJS = the mail courier between the form and the inbox
- GitHub repository = where the code is stored

## Notes

- The contact form emails `pateltrushtiv@gmail.com` and sends the visitor a confirmation email. It does not open any email app.
- No secrets or credentials are stored in the frontend. The EmailJS public key is public by design, and the templates can only send to the addresses configured in section 5.
- This is meant for defensive, authorized, and professional use only.
