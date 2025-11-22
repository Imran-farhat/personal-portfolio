# personal-portfolio

Single-page AI/ML portfolio. The Contact form is powered by EmailJS directly from the browser—no backend or server configuration needed.

## Contact form setup

1. Create a free EmailJS account (https://www.emailjs.com/) and configure:
   - A service (e.g., Gmail, Outlook, custom SMTP) → copy the Service ID.
   - A template for contact emails → copy the Template ID.
   - A public key (from EmailJS dashboard).
2. Update the `data-email-service`, `data-email-template`, and `emailjs.init` key in `index.html` / `script.js` with your values.
3. Deploy the static site (GitHub Pages, Netlify, Vercel, etc.). The form will send emails via EmailJS without any server code.

## Local development

Just open `index.html` in a browser or run a static server of your choice (e.g., VS Code Live Server). No build step is required.