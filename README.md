# CV Editor - Modern JSON-Driven Resume Builder

A streamlined, component-based CV builder powered by StencilJS web components and Bun runtime. Create professional, print-ready resumes with complete customisation control through JSON configuration.

## ✨ Key Features

- **🧩 Generic Component System** - Universal section architecture works for any CV layout
- **📝 JSON-Driven Content** - Unified sidebar/main structure with flexible subsections
- **🎨 Complete Style Control** - Customise colours, typography, spacing, and layout through JSON configuration
- **🖨️ Print-Ready** - Perfect A4 formatting with hidden edit controls in print
- **🔒 PII Protection** - Example templates and backup patterns prevent accidental exposure
- **⚡ Modern Stack** - Bun runtime, Handlebars templating, CSS custom properties
- **🎯 Flexible Bullets** - Support for icons, text bullets, and custom markers

## 🛠️ Tech Stack

- **Runtime**: Bun
- **Components**: StencilJS with TypeScript
- **Templating**: Handlebars
- **Styling**: CSS Custom Properties + Shadow DOM
- **Icons**: Tabler Icons SVG library

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Build components
bun run build

# Start development server
bun run server.ts
```

Copy `cv.json.example` to `cv.json` and customise with your information and styling preferences.

## 📦 Components

### Core Layout
- **`cv-display`** - Main container with grid layout and slots
- **`cv-header`** - Professional header with name, job role, and summary
- **`cv-profile-image`** - Circular profile image with customisable source

### Universal Section System
- **`cv-generic-section`** - Universal section container for both sidebar and main content
- **`cv-subsection`** - Handles both sidebar lists and main content items with title/subtitle/period
- **`cv-section`** - Basic section wrapper with title styling
- **`cv-section-item`** - Employment/education item with heading, subheading, period
- **`cv-list`** - Clean list container for bullet points
- **`cv-list-item-generic`** - Flexible list items supporting icons or text bullets
- **`cv-icon`** - Consistent icon system (phone, house, mail, github, linkedin)

## 📜 Scripts

### Development
```bash
# Build components for development
bun run build

# Build and watch for changes with dev server
bun run dev

# Start the local server
bun run start
```

### Testing
```bash
# Run unit and e2e tests
bun run test

# Run tests in watch mode
bun run test.watch
```

### Utilities
```bash
# Generate new component boilerplate
bun run generate
```

## 🎯 Usage

### Generic Section Structure

All CV content uses a unified sidebar/main structure:

```json
{
  "profile": {
    "name": "Your Name",
    "jobRole": "Your Job Title", 
    "summary": "Your professional summary...",
    "image": "path/to/your/image.jpg"
  },
  "sidebar": [
    {
      "title": "Contact",
      "subsections": [{
        "content": {
          "type": "list",
          "data": [
            {"bullet": {"icon": "phone"}, "value": "+44 20 1234 5678"},
            {"bullet": {"icon": "mail"}, "value": "email@example.com"},
            {"bullet": {"icon": "github"}, "value": "github.com/username"}
          ]
        }
      }]
    },
    {
      "title": "Skills", 
      "subsections": [{
        "content": {
          "type": "list",
          "data": [
            {"bullet": "•", "value": "JavaScript"},
            {"bullet": "•", "value": "TypeScript"},
            {"bullet": "•", "value": "React"}
          ]
        }
      }]
    }
  ],
  "main": [
    {
      "title": "Employment History",
      "subsections": [
        {
          "title": "Senior Developer",
          "subtitle": "Tech Corp",
          "period": "2020 - Present", 
          "content": {
            "type": "list",
            "data": [
              {"bullet": "•", "value": "Led team of 5 developers"},
              {"bullet": "•", "value": "Increased performance by 40%"}
            ]
          }
        }
      ]
    },
    {
      "title": "References",
      "subsections": [{
        "content": {
          "type": "text",
          "data": "Available upon request"
        }
      }]
    }
  ],
  "styling": {
    "colors": {
      "primary": "#666",
      "accent": "#2c5f6f",
      "sidebarBackground": "rgb(218, 228, 235)",
      "bodyBackground": "rgb(250, 250, 250)",
      "bulletColor": "#2c5f6f"
    },
    "typography": {
      "fontFamily": "Poppins, sans-serif",
      "fontWeights": {
        "light": 300,
        "normal": 400,
        "medium": 500
      },
      "fontSizes": {
        "body": "14px",
        "name": "2em",
        "jobRole": "1.2em",
        "sectionTitle": "1.125rem",
        "listItem": "0.875rem"
      },
      "lineHeights": {
        "content": 1.6,
        "listItem": 1.5
      },
      "letterSpacing": {
        "name": "0.125em",
        "jobRole": "0.1875em",
        "sectionTitle": "0.125em"
      }
    },
    "spacing": {
      "sectionMarginBottom": "2rem",
      "sectionTitleMarginBottom": "1.2rem",
      "nameMarginBottom": "1.25rem",
      "jobRoleMarginBottom": "0.9375rem",
      "listItemMarginBottom": "0.75rem",
      "listItemPaddingLeft": "1rem",
      "underlineWidth": "3rem",
      "underlineHeight": "0.1rem",
      "underlineMarginTop": "0.85rem",
      "nameUnderlineHeight": "0.11rem",
      "nameUnderlineMargin": "1.875rem 0 1.875rem 0"
    },
    "layout": {
      "cvWidth": "210mm",
      "gridColumns": "1fr 2fr",
      "paddingLeft": "1.5rem",
      "boxShadow": "0 0 10px rgba(0, 0, 0, 0.1)"
    },
    "components": {
      "header": {
        "color": "#2c5f6f"
      },
      "sidebar": {
        "backgroundColor": "rgb(218, 228, 235)"
      },
      "profileImage": {
        "size": "200x200"
      },
      "icon": {
        "size": 20,
        "stroke": 2,
        "color": "currentColor"
      }
    }
  }
}
```

### Template Structure

The application uses a simple Handlebars template with universal sections:

```handlebars
<cv-display>
  <cv-profile-image slot="sidebar-header" src="{{profile.image}}"></cv-profile-image>
  <cv-header slot="main-header" name="{{profile.name}}" job-role="{{profile.jobRole}}">
    {{profile.summary}}
  </cv-header>
  
  <div slot="sidebar-content">
    {{#each sidebar}}
    <cv-generic-section section-title="{{title}}" subsections='{{json subsections}}'></cv-generic-section>
    {{/each}}
  </div>
  
  <div slot="main-content">
    {{#each main}}
    <cv-generic-section section-title="{{title}}" subsections='{{json subsections}}'></cv-generic-section>
    {{/each}}
  </div>
</cv-display>
```

### Flexible Bullet System

The new generic system supports multiple bullet types:

- **Icons**: `{"bullet": {"icon": "phone"}, "value": "Contact info"}`
- **Text bullets**: `{"bullet": "•", "value": "List item"}`  
- **Custom bullets**: `{"bullet": "-", "value": "Custom marker"}`

### Key Component Props

#### cv-generic-section
- `section-title`: Section heading text
- `subsections`: JSON string of subsection data

#### cv-subsection
- `heading`: Item title (for main sections)
- `subtitle`: Secondary text (company/institution)
- `period`: Date range
- `content`: JSON string of content data

#### cv-list-item-generic
- `bullet`: JSON string of bullet data (icon object or text)
- `value`: List item content

#### cv-header
- `name`: Person's full name
- `job-role`: Current position title

#### cv-profile-image
- `src`: Image source URL

## 🎨 Styling System

### CSS Custom Properties
The styling system uses CSS custom properties for complete customisation:

```css
:root {
  --colour-primary: #666;
  --colour-accent: #2c5f6f;
  --font-family: Poppins, sans-serif;
  --font-size-body: 14px;
  --spacing-section-margin-bottom: 2rem;
}
```

### JSON-Driven Styling
Configure all styling through the `styling` section in `cv.json`:

- **Colours**: Primary, accent, backgrounds, bullet colours
- **Typography**: Font family, weights, sizes, line heights, letter spacing
- **Spacing**: Margins, padding, underline dimensions
- **Layout**: CV width, grid columns, box shadows
- **Components**: Specific styling for header, sidebar, icons

Each component uses shadow DOM for style encapsulation while respecting global CSS custom properties.

## 📱 Development

### Creating New Components
```bash
bun run generate
```

### Component Structure
```
src/components/
├── cv-component-name/
│   ├── cv-component-name.tsx    # Component logic
│   ├── cv-component-name.css    # Component styles
│   └── readme.md               # Auto-generated docs
```

## 📋 Project Structure

```
cv-editor/
├── src/
│   ├── components/          # StencilJS components
│   │   ├── cv-display/      # Main layout container
│   │   ├── cv-generic-section/ # Universal section system
│   │   ├── cv-subsection/   # Subsection handler
│   │   ├── cv-list-item-generic/ # Flexible list items
│   │   └── ...
│   ├── components.ts        # Component exports
│   └── index.ts            # Main entry point
├── dist/                   # Built components
├── cv.json                 # CV content data (gitignored)
├── cv.json.backup.*.json   # Backup files (gitignored)
├── cv.json.example         # Example template
├── index.hbs               # Handlebars template
├── server.ts               # Bun server with Handlebars rendering
├── styles.css              # Global styles with CSS custom properties
├── reset.css               # CSS reset
└── stencil.config.ts       # StencilJS configuration
```

## 🔒 Privacy & Security

- **PII Protection**: Personal data in `cv.json` is excluded from version control
- **Safe Templates**: `cv.json.example` provides safe placeholder data
- **Private Repository Ready**: Designed for private repository version control

## 🖨️ Print Support

The CV is optimised for A4 print format with:
- Exact A4 dimensions (210mm width)
- Print-friendly colour preservation
- Proper page break handling
- Background colour preservation

## 🔧 Technologies

- **StencilJS**: Web component compiler
- **TypeScript**: Type-safe development
- **Bun**: Fast JavaScript runtime and package manager
- **Shadow DOM**: Style encapsulation
- **CSS Grid**: Responsive layout
- **Handlebars**: Template rendering
- **Tabler Icons**: Consistent icon system

## 📄 Licence

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Perfect for developers who want full control over their resume's appearance and content through code and configuration.

Built with ❤️ using StencilJS and Bun