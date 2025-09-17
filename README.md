# CV Editor - Modern JSON-Driven Resume Builder

A streamlined, component-based CV builder powered by StencilJS web components and Bun runtime. Create professional, print-ready resumes with complete customisation control through JSON configuration.

## ✨ Key Features

- **🧩 Component Architecture** - Reusable StencilJS web components with shadow DOM encapsulation
- **📝 JSON-Driven Content** - Separate content from presentation with structured JSON data files
- **🎨 Complete Style Control** - Customise colours, typography, spacing, and layout through JSON configuration
- **🖨️ Print-Ready** - Perfect A4 formatting with print-optimised CSS
- **🔒 PII Protection** - Example templates prevent accidental exposure of personal information
- **⚡ Modern Stack** - Bun runtime, Handlebars templating, CSS custom properties
- **🎯 Consistent Icons** - Integrated Tabler Icons with dedicated component system

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

### Layout Components
- **`cv-sidebar`** - Sidebar container with background colour customisation
- **`cv-main`** - Main content area with header and content sections

### Content Components
- **`cv-header`** - Professional header with name, job role, and description
- **`cv-profile-image`** - Circular profile image with customisable source
- **`cv-section`** - Reusable section with title and content area
- **`cv-contact-item`** - Contact information item with icon and content
- **`cv-skills-list`** - Bulleted list for skills or interests
- **`cv-section-item`** - Generic section item with heading, subheading, and period
- **`cv-list`** - Unstyled list container for clean list markup
- **`cv-list-item`** - Individual list item with customisable bullet styling
- **`cv-icon`** - Consistent icon system with dedicated SVG icons

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

### Content Management

All CV content is stored in `cv.json` for easy editing:

```json
{
  "profile": {
    "name": "Your Name",
    "jobRole": "Your Job Title", 
    "summary": "Your professional summary...",
    "image": "path/to/your/image.jpg"
  },
  "contact": [
    { "icon": "phone", "text": "+44 123 456 7890" },
    { "icon": "mail", "text": "email@example.com" },
    { "icon": "github", "text": "github.com/username" },
    { "icon": "linkedin", "text": "in/username" }
  ],
  "skills": ["JavaScript", "TypeScript", "React"],
  "interests": ["Photography", "Hiking"],
  "employment": [
    {
      "position": "Senior Developer",
      "company": "Tech Corp", 
      "period": "2020 - Present",
      "achievements": [
        "Led team of 5 developers",
        "Increased performance by 40%"
      ]
    }
  ],
  "references": "Available upon request",
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

The application uses Handlebars templating with `index.hbs`:

```handlebars
<cv-header name="{{profile.name}}" job-role="{{profile.jobRole}}">
  {{profile.summary}}
</cv-header>

{{#each employment}}
<cv-section-item heading="{{position}}" subheading="{{company}}" period="{{period}}">
  <cv-list>
    {{#each achievements}}
    <cv-list-item>{{this}}</cv-list-item>
    {{/each}}
  </cv-list>
</cv-section-item>
{{/each}}
```

### Component Usage
```html
<!doctype html>
<html lang="en-GB">
<head>
    <script type="module" src="/dist/cv-components/cv-components.esm.js"></script>
</head>
<body>
    <div class="cv">
        <cv-sidebar background-color="rgb(218, 228, 235)">
            <div slot="header">
                <cv-profile-image src="path/to/image.jpg"></cv-profile-image>
            </div>
            <div slot="content">
                <cv-section section-title="Contact">
                    <cv-contact-item icon="phone">+44 123 456 7890</cv-contact-item>
                    <cv-contact-item icon="mail">email@example.com</cv-contact-item>
                </cv-section>
            </div>
        </cv-sidebar>

        <cv-main>
            <div slot="header">
                <cv-header name="John Smith" job-role="Software Engineer">
                    Professional summary goes here...
                </cv-header>
            </div>
            <div slot="content">
                <cv-section section-title="Experience">
                    <cv-section-item 
                        heading="Senior Developer"
                        subheading="Tech Corp"
                        period="2020 - Present">
                        <cv-list>
                            <cv-list-item>Led team of 5 developers</cv-list-item>
                            <cv-list-item>Increased performance by 40%</cv-list-item>
                        </cv-list>
                    </cv-section-item>
                </cv-section>
            </div>
        </cv-main>
    </div>
</body>
</html>
```

### Component Props

#### cv-sidebar
- `background-color`: Background colour for the sidebar (default: "rgb(218, 228, 235)")

#### cv-header
- `name`: Person's full name
- `job-role`: Current position title
- `color`: Text colour for name and job role (default: "#2c5f6f")

#### cv-profile-image
- `src`: Image source URL (default: placeholder)
- `alt`: Alt text for the image

#### cv-section
- `section-title`: Title for the section
- `color`: Colour for the title and underline (default: "#2c5f6f")

#### cv-contact-item
- `icon`: Icon name (phone, house, mail, github, linkedin)

#### cv-skills-list
- `skills`: JSON array of skills/interests
- `bullet-color`: Colour for bullet points (default: "#2c5f6f")

#### cv-section-item
- `heading`: Main heading text (e.g., job position)
- `subheading`: Secondary text (e.g., company name)
- `period`: Time period or date range
- `heading-color`: Colour for the heading text (default: "#2c5f6f")

#### cv-list
- No props - pure container component

#### cv-list-item
- `bullet-color`: Colour for the bullet point (default: "#2c5f6f")

#### cv-icon
- `icon`: Icon name (phone, house, mail, github, linkedin)
- `size`: Icon size in pixels (default: 20)
- `stroke`: Stroke width (default: 2)
- `color`: Icon colour (default: "currentColor")

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
│   ├── components.ts        # Component exports
│   └── index.ts            # Main entry point
├── dist/                   # Built components
├── cv.json                 # CV content data (gitignored)
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