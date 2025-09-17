# CV Editor - StencilJS Components

A modern CV/Resume editor built with StencilJS components featuring shadow DOM and slot-based architecture. This project provides reusable, encapsulated web components for building professional CVs with customizable styling and flexible content management.

## 🚀 Features

- **Shadow DOM Encapsulation**: Each component has isolated styles preventing CSS conflicts
- **Slot-based Architecture**: Flexible content insertion with named and default slots
- **Customizable Props**: Color schemes, background colors, and data binding through properties
- **Print-Ready**: Optimized CSS for A4 print format
- **Modular Design**: Reusable components that can be used across different projects
- **TypeScript Support**: Full TypeScript definitions for all components

## 📦 Components

### Layout Components
- **`cv-sidebar`** - Sidebar container with background color customization
- **`cv-main`** - Main content area with header and content sections

### Content Components
- **`cv-header`** - Professional header with name, job role, and description
- **`cv-profile-image`** - Circular profile image with customizable source
- **`cv-section`** - Reusable section with title and content area
- **`cv-contact-item`** - Contact information item with icon and content
- **`cv-skills-list`** - Bulleted list for skills or interests
- **`cv-section-item`** - Generic section item with heading, subheading, and period
- **`cv-list`** - Unstyled list container for clean list markup
- **`cv-list-item`** - Individual list item with customizable bullet styling

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

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

### Basic HTML Structure
```html
<!doctype html>
<html lang="en">
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
                    <cv-contact-item icon="📱">+44 123 456 7890</cv-contact-item>
                    <cv-contact-item icon="✉️">email@example.com</cv-contact-item>
                </cv-section>
            </div>
        </cv-sidebar>

        <cv-main>
            <div slot="header">
                <cv-header name="John Doe" job-role="Software Engineer">
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
- `background-color`: Background color for the sidebar (default: "rgb(218, 228, 235)")

#### cv-header
- `name`: Person's full name
- `job-role`: Current position title
- `color`: Text color for name and job role (default: "#2c5f6f")

#### cv-profile-image
- `src`: Image source URL (default: placeholder)
- `alt`: Alt text for the image

#### cv-section
- `section-title`: Title for the section
- `color`: Color for the title and underline (default: "#2c5f6f")

#### cv-contact-item
- `icon`: Emoji or icon to display

#### cv-skills-list
- `skills`: JSON array of skills/interests
- `bullet-color`: Color for bullet points (default: "#2c5f6f")

#### cv-section-item
- `heading`: Main heading text (e.g., job position)
- `subheading`: Secondary text (e.g., company name)
- `period`: Time period or date range
- `heading-color`: Color for the heading text (default: "#2c5f6f")

#### cv-list
- No props - pure container component

#### cv-list-item
- `bullet-color`: Color for the bullet point (default: "#2c5f6f")

## 🎨 Styling

Each component uses shadow DOM for style encapsulation. Global styles can be applied to the main container:

```css
.cv {
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 210mm; /* A4 width */
    margin: 0 auto;
    font-family: 'Poppins', sans-serif;
}
```

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
├── index.html              # Demo/main HTML file
├── server.ts               # Development server
├── styles.css              # Global styles
├── reset.css               # CSS reset
└── stencil.config.ts       # StencilJS configuration
```

## 🖨️ Print Support

The CV is optimized for A4 print format with:
- Exact A4 dimensions (210mm width)
- Print-friendly color preservation
- Proper page break handling
- Background color preservation

## 🔧 Technologies

- **StencilJS**: Web component compiler
- **TypeScript**: Type-safe development
- **Bun**: Fast JavaScript runtime and package manager
- **Shadow DOM**: Style encapsulation
- **CSS Grid**: Responsive layout

## 📄 License

This project is private and for personal use.

---

Built with ❤️ using StencilJS and Bun