# CV Editor

A modern JSON-driven CV builder with StencilJS web components, live editor, and PDF export.

## Features

- **🧩 Generic Component System** - Universal sections work for any CV layout
- **📝 JSON-Driven Content** - Configure everything through JSON
- **🎨 Complete Style Control** - Customise colours, typography, spacing via JSON
- **✏️ Live Editor** - Web-based editor with Monaco and live preview at `/edit`
- **📄 PDF Export** - Automated PDF generation with Puppeteer
- **🖨️ Print-Ready** - Perfect A4 formatting
- **🔒 PII Protection** - Personal data excluded from version control

## Quick Start

```bash
bun install
bun run build
bun run server.ts
```

Copy `cv.json.example` to `cv.json` and customise. Visit http://localhost:3000 to view, `/edit` to edit.

## Example Structure

```json
{
  "profile": {
    "name": "John Doe",
    "jobRole": "Software Engineer", 
    "summary": "Professional summary...",
    "image": "path/to/image.jpg"
  },
  "sidebar": [
    {
      "title": "Contact",
      "subsections": [{
        "content": {
          "type": "list",
          "data": [
            {"bullet": {"icon": "phone"}, "value": "+44 20 1234 5678"},
            {"bullet": {"icon": "mail"}, "value": "email@example.com"}
          ]
        }
      }]
    }
  ],
  "main": [
    {
      "title": "Employment History",
      "subsections": [{
        "title": "Senior Developer",
        "subtitle": "Tech Corp",
        "period": "2020 - Present",
        "content": {
          "type": "list",
          "data": [
            {"bullet": "•", "value": "Led team of 5 developers"}
          ]
        }
      }]
    }
  ],
  "styling": {
    "colors": {"primary": "#666", "accent": "#2c5f6f"},
    "typography": {"fontFamily": "Poppins, sans-serif"},
    "layout": {"cvWidth": "210mm", "gridColumns": "1fr 2fr"}
  }
}
```

## Components

- **`cv-display`** - Main layout container
- **`cv-header`** - Name, job role, summary
- **`cv-generic-section`** - Universal section system
- **`cv-subsection`** - Handles content with title/subtitle/period
- **`cv-list-item-generic`** - Flexible list items with icons or text bullets
- **`cv-icon`** - Tabler icons (phone, house, mail, github, linkedin)

## Editor Features

- Monaco editor with JSON syntax highlighting
- Live preview with auto-save
- Form-based editing for non-technical users
- Backup management
- Direct PDF export

## Tech Stack

- **Runtime**: Bun
- **Components**: StencilJS + TypeScript
- **Templating**: Handlebars
- **PDF**: Puppeteer
- **Styling**: CSS Custom Properties + Shadow DOM

## License

MIT License