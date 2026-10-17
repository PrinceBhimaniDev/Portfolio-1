/* ============================================================
   CONTACT FORM — EMAILJS CONFIGURATION
   ------------------------------------------------------------
   Replace the placeholder values below with your own EmailJS
   values (see README section "Set up the contact form mail").
     1. Create a free account at https://www.emailjs.com
     2. Add an email service (Gmail works)      -> serviceId
     3. Create two templates                    -> ownerTemplateId
        and confirmTemplateId                        confirmTemplateId
     4. Copy your public key from Account       -> publicKey
   Nothing else in this file needs to change.
   ============================================================ */

const EMAILJS_CONFIG = {
  publicKey: "YOUR_PUBLIC_KEY",
  serviceId: "YOUR_SERVICE_ID",
  // Template that emails the message to the site owner.
  ownerTemplateId: "YOUR_OWNER_TEMPLATE_ID",
  // Template that sends the confirmation email to the visitor.
  confirmTemplateId: "YOUR_CONFIRM_TEMPLATE_ID",
  // Where the message is delivered.
  toEmail: "pateltrushtiv@gmail.com",
};

/* ------------------------------------------------------------
   Limits and behaviour. Changing these is optional.
   ------------------------------------------------------------ */

const LIMITS = {
  name: 100,
  email: 254,
  message: 5000,
};

// Simple client-side throttle between submissions.
const THROTTLE_MS = 20000;

// EmailJS allows 1 request per second, so we wait before the second send.
const SEND_GAP_MS = 1200;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const status = document.querySelector("#contact-status");
  const submitButton = document.querySelector("#contact-submit");
  let lastSubmitAt = 0;

  const setStatus = (text, state) => {
    status.textContent = text;
    status.className = state ? "form-status form-status--" + state : "";
  };

  // Remove line breaks so a name cannot smuggle extra headers or text
  // into the generated email.
  const clean = (value) => String(value || "").replace(/[\r\n]+/g, " ").trim();

  const isConfigured = [
    EMAILJS_CONFIG.publicKey,
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.ownerTemplateId,
    EMAILJS_CONFIG.confirmTemplateId,
  ].every((value) => value && value.indexOf("YOUR_") !== 0);

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fields = Object.fromEntries(new FormData(contactForm).entries());

    // Honeypot: bots fill in every field they find, including hidden
    // ones. Pretend the message was sent and do nothing.
    if (fields._honey) {
      setStatus("Thanks! Your message has been sent.", "success");
      contactForm.reset();
      return;
    }

    const name = clean(fields.name);
    const email = clean(fields.email);
    const message = String(fields.message || "").trim();

    if (!name || !email || !message) {
      setStatus("Please fill in every field.", "error");
      return;
    }

    if (
      name.length > LIMITS.name ||
      email.length > LIMITS.email ||
      message.length > LIMITS.message
    ) {
      setStatus("One of the fields is too long.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please enter a valid email address.", "error");
      return;
    }

    if (!isConfigured) {
      setStatus(
        "The contact form is not set up yet. Please email pateltrushtiv@gmail.com directly.",
        "error"
      );
      return;
    }

    if (typeof emailjs === "undefined") {
      setStatus(
        "The mail service could not load. Please email pateltrushtiv@gmail.com directly.",
        "error"
      );
      return;
    }

    const now = Date.now();
    if (now - lastSubmitAt < THROTTLE_MS) {
      setStatus("Please wait a moment before sending another message.", "error");
      return;
    }
    lastSubmitAt = now;

    submitButton.disabled = true;
    setStatus("Sending…", "sending");

    try {
      // 1. Notification to the site owner. `reply_to` keeps the
      //    visitor's address as the reply target.
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.ownerTemplateId,
        {
          to_email: EMAILJS_CONFIG.toEmail,
          reply_to: email,
          from_name: name,
          visitor_email: email,
          message: message,
        },
        { publicKey: EMAILJS_CONFIG.publicKey }
      );

      // 2. Confirmation to the visitor. Best effort only: a failure
      //    here must not make the submit look like it failed.
      //    EmailJS allows 1 request per second, so wait briefly first.
      await wait(SEND_GAP_MS);

      await emailjs
        .send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.confirmTemplateId,
          {
            reply_to: EMAILJS_CONFIG.toEmail,
            to_email: email,
            from_name: name,
            visitor_email: email,
          },
          { publicKey: EMAILJS_CONFIG.publicKey }
        )
        .catch(() => null);

      setStatus(
        "Thanks! Your message has been sent. A confirmation email is on its way.",
        "success"
      );
      contactForm.reset();
    } catch (error) {
      setStatus(
        "Sorry, something went wrong. Please email pateltrushtiv@gmail.com directly.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
    }
  });
}
