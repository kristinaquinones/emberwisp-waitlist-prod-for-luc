# 📧 Email Preview Generation Guide

This guide explains how to generate HTML previews of all email templates for review and export.

## Quick Start

**Generate all email previews:**
```bash
npm run generate-email-previews
```

**View the previews:**
```bash
open example_emails/index.html
```

That's it! The previews will be generated in the `example_emails/` folder.

## What Gets Generated

The script generates HTML previews for all 6 email templates (3 styles × 2 types):

**Confirmation Emails:**
- `confirmation-email-minimal.html`
- `confirmation-email-professional.html`
- `confirmation-email-branded.html`

**Welcome Emails:**
- `welcome-email-minimal.html`
- `welcome-email-professional.html`
- `welcome-email-branded.html`

**Gallery:**
- `index.html` - Interactive gallery view of all templates

## Preview Features

Each preview includes:

1. **Template Name** - Label showing which template style
2. **Subject Line** - The email subject that recipients will see
3. **Preheader Text** - The preview text shown in email clients
4. **Full Email Content** - Complete rendered email with all styling

## Customization

**To preview with different colors/content:**

1. Edit `the-widget/templates/config.js`:
   ```javascript
   primaryColor: "#ff6b6b",  // Change colors
   confirmationSubject: "Your Custom Subject",  // Change subject
   // ... etc
   ```

2. Regenerate previews:
   ```bash
   npm run generate-email-previews
   ```

3. View updated previews:
   ```bash
   open example_emails/index.html
   ```

## Exporting Screenshots

**Method 1: Browser Dev Tools (Recommended)**

1. Open `example_emails/index.html` in your browser
2. Click "Open Full Size" on any template
3. Right-click on the email content → Inspect
4. In Elements panel, right-click the email container → "Capture node screenshot"
5. Save as PNG

**Method 2: Browser Screenshot**

1. Open individual template HTML files
2. Use browser screenshot tools or extensions
3. Recommended size: 800px wide for consistency

## File Locations

- **Script:** `generate-email-screenshots-simple.js`
- **Output:** `example_emails/` folder
- **Config:** `the-widget/templates/config.js`
- **Templates:** `the-widget/templates/` and `the-widget/templates/examples/`

## Troubleshooting

**Preview shows old content?**
- Make sure you regenerated after changing `config.js`
- Clear browser cache if needed

**Missing subject/preheader?**
- Check that `config.js` has `confirmationSubject`, `welcomeSubject`, etc.
- Verify the script ran successfully (check console output)

**Colors not updating?**
- Ensure you're editing `the-widget/templates/config.js`
- Regenerate previews after changes
- Check that template style is set correctly in `.env` (if using)

## Notes

- The previews use sample data from `config.js`
- Unsubscribe URLs are placeholder links (not functional in previews)
- All templates use the same configuration values for consistency
- The `example_emails/` folder is gitignored (not committed to repo)

