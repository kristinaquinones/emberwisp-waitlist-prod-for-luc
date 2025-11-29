import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { emailConfig } from './the-widget/templates/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add sample URLs for preview purposes
// Note: We keep logoUrl as-is (empty) so the preview shows placeholder with background color
// This matches the actual email behavior for branded templates
const previewEmailConfig = {
  ...emailConfig,
  confirmUrl: "https://yourdomain.com/api/confirm?token=abc123...",
  unsubscribeUrl: "https://yourdomain.com/api/unsubscribe?token=xyz789...",
  // Keep logoUrl as-is (empty) to show placeholder with background color in preview
  // If user has set a logoUrl, it will be used and background will be transparent
};

// Template configurations for different styles
// Now all templates use the same config from config.js - users have full control!
// Note: 'default' is an alias for 'minimal' (backward compatibility)
const templateConfigs = {
  default: previewEmailConfig, // Alias for minimal
  professional: previewEmailConfig,
  minimal: previewEmailConfig,
  branded: previewEmailConfig
};

// Template files to render
// Note: 'minimal' is now the default style (root templates)
const templates = [
  {
    name: 'confirmation-email-minimal',
    file: 'the-widget/templates/confirmation-email.html',
    config: 'minimal'
  },
  {
    name: 'confirmation-email-professional',
    file: 'the-widget/templates/examples/confirmation-email-professional.html',
    config: 'professional'
  },
  {
    name: 'confirmation-email-branded',
    file: 'the-widget/templates/examples/confirmation-email-branded.html',
    config: 'branded'
  },
  {
    name: 'welcome-email-minimal',
    file: 'the-widget/templates/welcome-email.html',
    config: 'minimal'
  },
  {
    name: 'welcome-email-professional',
    file: 'the-widget/templates/examples/welcome-email-professional.html',
    config: 'professional'
  },
  {
    name: 'welcome-email-branded',
    file: 'the-widget/templates/examples/welcome-email-branded.html',
    config: 'branded'
  }
];

function replaceTemplateVariables(html, config) {
  let result = html;
  
  // Generate logo HTML if logoUrl is provided
  // Recommended max: 200px wide, Enforced max: 250px (scaled down automatically)
  let logoHtml = '';
  let logoHeaderHtml = '';
  let brandedHeaderBgColor = ''; // Branded template header background color
  
  // Default placeholder SVG logo for branded templates (data URI)
  // Professional gradient placeholder - users should replace with their own logo
  const defaultPlaceholderLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2MzY2ZjE7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4YjVjZjY7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiBmaWxsPSJ1cmwoI2dyYWQpIiByeD0iNiIvPjx0ZXh0IHg9IjEwMCIgeT0iMzgiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMC41cHgiPllvdXIgTG9nbzwvdGV4dD48L3N2Zz4=';
  
  // Check if user wants text-only header (no logo at all)
  const useTextOnly = config.brandedHeaderTextOnly === true;
  
  if (config.logoUrl && config.logoUrl.trim() !== '') {
    // Professional template: Logo above content
    logoHtml = `<div class="logo-container" style="text-align: center; padding: 30px 20px 20px 20px; margin-bottom: 30px;">
    <img src="${config.logoUrl}" alt="${config.projectName}" style="max-width: 250px; width: auto; height: auto; display: block; margin: 0 auto;" />
  </div>`;
    
    // Branded template: Custom logo in header - transparent background (ANY logo = transparent)
    logoHeaderHtml = `<div class="logo" style="color: white; font-size: 24px; font-weight: bold;">
      <img src="${config.logoUrl}" alt="${config.projectName}" style="max-width: 250px; width: auto; height: auto; display: block; margin: 0 auto;" />
    </div>`;
    brandedHeaderBgColor = 'transparent'; // Transparent background when ANY logo is used
  } else if (useTextOnly) {
    // Branded template: Text-only header - WITH background color (primaryColor)
    logoHeaderHtml = `<div class="logo" style="color: white; font-size: 24px; font-weight: bold;">${config.projectName}</div>`;
    brandedHeaderBgColor = config.primaryColor; // Show background color for text-only header
  } else {
    // Branded template: Placeholder SVG logo - transparent background (ANY logo = transparent)
    logoHeaderHtml = `<div class="logo" style="color: white; font-size: 24px; font-weight: bold;">
      <img src="${defaultPlaceholderLogo}" alt="${config.projectName}" style="max-width: 250px; width: auto; height: auto; display: block; margin: 0 auto;" />
    </div>`;
    brandedHeaderBgColor = 'transparent'; // Transparent background when using placeholder logo (it's still a logo)
  }
  
  // Add logo HTML variables to config
  const configWithLogo = {
    ...config,
    logoHtml,
    logoHeaderHtml,
    brandedHeaderBgColor // Branded template: Header background color (transparent if logo, primaryColor if placeholder)
  };
  
  // Replace all template variables
  Object.keys(configWithLogo).forEach(key => {
    const placeholder = `{{${key}}}`;
    const value = configWithLogo[key];
    result = result.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return result;
}

async function generateHTMLFiles() {
  // Create example_emails directory
  const outputDir = path.join(__dirname, 'example_emails');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🚀 Generating HTML email previews...');
  
  const htmlFiles = [];

  for (const template of templates) {
    console.log(`📧 Processing ${template.name}...`);
    
    // Read template file
    const templatePath = path.join(__dirname, template.file);
    if (!fs.existsSync(templatePath)) {
      console.warn(`⚠️  Template file not found: ${template.file}`);
      continue;
    }
    
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    const config = templateConfigs[template.config];
    
    // Replace template variables
    const renderedHtml = replaceTemplateVariables(templateHtml, config);
    
    // Create a preview that preserves the complete email HTML structure
    // We'll wrap the entire email HTML (including its own html/body tags) in a preview container
    const standaloneHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.name} - Email Preview</title>
  <style>
    /* Outer preview frame styles */
    body {
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .preview-container {
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-radius: 8px;
      overflow: hidden;
      max-width: 600px;
      width: 100%;
      position: relative;
    }
    .preview-label {
      background: #f8f9fa;
      padding: 8px 16px;
      border-bottom: 1px solid #e9ecef;
      font-size: 12px;
      color: #6c757d;
      text-align: center;
    }
    .preview-header {
      background: #ffffff;
      padding: 16px 20px;
      border-bottom: 1px solid #e9ecef;
    }
    .preview-subject {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 8px 0;
    }
    .preview-subject-label {
      font-size: 11px;
      font-weight: 500;
      color: #95a5a6;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .preview-preheader {
      font-size: 13px;
      color: #6c757d;
      margin: 0;
      font-style: italic;
    }
    .preview-preheader-label {
      font-size: 11px;
      font-weight: 500;
      color: #95a5a6;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .email-content {
      /* Reset any inherited styles that might interfere with email styles */
      all: initial;
      display: block;
      font-family: inherit;
    }
    /* Ensure the email's own HTML structure is preserved */
    .email-content * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="preview-label">📧 ${template.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
    <div class="preview-header">
      <div>
        <div class="preview-subject-label">Subject:</div>
        <div class="preview-subject">${template.name.includes('confirmation') ? previewEmailConfig.confirmationSubject : previewEmailConfig.welcomeSubject}</div>
      </div>
      <div style="margin-top: 12px;">
        <div class="preview-preheader-label">Preheader:</div>
        <div class="preview-preheader">${template.name.includes('confirmation') ? previewEmailConfig.confirmationPreheader : previewEmailConfig.welcomePreheader}</div>
      </div>
    </div>
    <div class="email-content">
      ${renderedHtml}
    </div>
  </div>
</body>
</html>`;
    
    // Save HTML file
    const htmlPath = path.join(outputDir, `${template.name}.html`);
    fs.writeFileSync(htmlPath, standaloneHtml);
    htmlFiles.push({
      name: template.name,
      path: `${template.name}.html`
    });
    
    console.log(`✅ Generated ${template.name}.html`);
  }
  
  // Generate index file
  await generateIndexFile(outputDir, htmlFiles);
  
  console.log('🎉 HTML email preview generation complete!');
  console.log(`📁 Files saved to: ${outputDir}`);
  console.log('💡 Open example_emails/index.html in your browser to view all templates');
  console.log('📸 Use browser dev tools to take screenshots of individual templates');
}

async function generateIndexFile(outputDir, htmlFiles) {
  const indexHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email Template Examples</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #f8f9fa;
    }
    h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 40px;
    }
    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }
    .template-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .template-card h3 {
      margin-top: 0;
      color: #34495e;
      font-size: 18px;
    }
    .template-card iframe {
      width: 100%;
      height: 400px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .template-type {
      display: inline-block;
      padding: 4px 8px;
      background: #3498db;
      color: white;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 10px;
    }
    .template-type.confirmation { background: #e74c3c; }
    .template-type.welcome { background: #27ae60; }
    .template-actions {
      margin-top: 10px;
    }
    .template-actions a {
      display: inline-block;
      padding: 6px 12px;
      background: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 12px;
      margin-right: 8px;
    }
    .template-actions a:hover {
      background: #2980b9;
    }
    .instructions {
      background: #e8f4fd;
      border: 1px solid #bee5eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .instructions h2 {
      margin-top: 0;
      color: #0c5460;
    }
    .instructions code {
      background: #f8f9fa;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', monospace;
    }
  </style>
</head>
<body>
  <h1>📧 Email Template Examples</h1>
  
  <div class="instructions">
    <h2>📸 How to Create Screenshots</h2>
    <p>Since automated screenshot generation had issues on your system, here's how to create them manually:</p>
    <ol>
      <li><strong>Open individual templates:</strong> Click "Open Full Size" below each template</li>
      <li><strong>Take screenshot:</strong> Use your browser's developer tools or screenshot tool</li>
      <li><strong>Recommended size:</strong> 800px wide for consistency</li>
      <li><strong>Save as PNG:</strong> Name them like <code>confirmation-email-default.png</code></li>
    </ol>
    <p><strong>Browser Dev Tools Method:</strong> Right-click on the email content → Inspect → Select the email container → Right-click in Elements panel → "Capture node screenshot"</p>
  </div>
  
  <div class="template-grid">
    ${htmlFiles.map(file => `
      <div class="template-card">
        <span class="template-type ${file.name.includes('confirmation') ? 'confirmation' : 'welcome'}">
          ${file.name.includes('confirmation') ? 'Confirmation' : 'Welcome'} Email
        </span>
        <h3>${file.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
        <iframe src="${file.path}" loading="lazy"></iframe>
        <div class="template-actions">
          <a href="${file.path}" target="_blank">Open Full Size</a>
          <a href="${file.path}" download>Download HTML</a>
        </div>
      </div>
    `).join('')}
  </div>
  
  <div style="text-align: center; color: #95a5a6; font-size: 14px;">
    <p>Generated on ${new Date().toLocaleDateString()}</p>
    <p>Templates are customizable via <code>the-widget/templates/config.js</code></p>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
  console.log('✅ Generated index.html');
}

// Run the generator
generateHTMLFiles().catch(console.error);
