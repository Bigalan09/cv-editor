
Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";

// import .css files directly and it works
import './index.css';

import { createRoot } from "react-dom/client";

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.

## CV Editor Project

A modern, JSON-driven CV builder with StencilJS web components, complete styling customisation, and PII protection. Perfect for developers who want full control over their resume's appearance and content through code and configuration.

### Architecture

- **Components**: StencilJS web components with shadow DOM and TypeScript in `src/components/`
- **Content**: JSON-driven content in `cv.json` with example template `cv.json.example`
- **Styling**: Complete JSON-based styling system with CSS custom properties
- **Template**: Handlebars template `index.hbs` with dynamic CSS injection
- **Server**: Bun server in `server.ts` with Handlebars compilation and custom CSS generation
- **Icons**: Tabler Icons integrated via dedicated `cv-icon` component
- **Privacy**: PII protection with gitignored personal data and safe example templates

### Development

```bash
# Install dependencies
bun install

# Build StencilJS components
bun run build

# Start development server (with auto-rebuild)
bun run server.ts

# Alternative: Start with hot reload
bun --hot server.ts
```

### Generic Component System

**Core Layout:**
- `cv-display` - Main container with grid layout and slots
- `cv-header` - Professional header with name, job role, and summary
- `cv-profile-image` - Circular profile image with customisable source

**Universal Section System:**
- `cv-generic-section` - Universal section container for both sidebar and main content
- `cv-subsection` - Handles both sidebar lists and main content items with title/subtitle/period
- `cv-section` - Basic section wrapper with title styling
- `cv-section-item` - Employment/education item with heading, subheading, period
- `cv-list` - Clean list container for bullet points
- `cv-list-item-generic` - Flexible list items supporting icons or text bullets
- `cv-icon` - Consistent icon system (phone, house, mail, github, linkedin)

### JSON-Driven Styling System

Complete styling control through `cv.json` styling section:

```json
{
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
      "fontWeights": { "light": 300, "normal": 400, "medium": 500 },
      "fontSizes": {
        "body": "14px", "name": "2em", "jobRole": "1.2em", 
        "sectionTitle": "1.125rem", "listItem": "0.875rem"
      },
      "lineHeights": { "content": 1.6, "listItem": 1.5 },
      "letterSpacing": {
        "name": "0.125em", "jobRole": "0.1875em", "sectionTitle": "0.125em"
      }
    },
    "spacing": {
      "sectionMarginBottom": "2rem",
      "sectionTitleMarginBottom": "1.2rem",
      "underlineWidth": "3rem",
      "underlineHeight": "0.1rem"
    },
    "layout": {
      "cvWidth": "210mm",
      "gridColumns": "1fr 2fr",
      "paddingLeft": "1.5rem",
      "boxShadow": "0 0 10px rgba(0, 0, 0, 0.1)"
    },
    "components": {
      "header": { "color": "#2c5f6f" },
      "sidebar": { "backgroundColor": "rgb(218, 228, 235)" },
      "icon": { "size": 20, "stroke": 2, "color": "currentColor" }
    }
  }
}
```

### CSS Custom Properties System

- All components use CSS custom properties with fallbacks
- Server dynamically generates CSS from JSON styling config
- Handlebars `customCSS` helper injects styling as CSS variables
- Shadow DOM encapsulation with global CSS variable inheritance

### Generic Section Structure

**Unified JSON Schema:**
```json
{
  "sidebar": [
    {
      "title": "Contact",
      "subsections": [{
        "content": {
          "type": "list",
          "data": [
            {"bullet": {"icon": "phone"}, "value": "+44 20 1234 5678"},
            {"bullet": "•", "value": "Skills or interests"}
          ]
        }
      }]
    }
  ],
  "main": [
    {
      "title": "Employment History", 
      "subsections": [{
        "title": "Senior Software Engineer",
        "subtitle": "Company Name",
        "period": "Jan 2020 - Present",
        "content": {
          "type": "list",
          "data": [
            {"bullet": "•", "value": "Achievement description"}
          ]
        }
      }]
    }
  ]
}
```

**Flexible Bullet System:**
- **Icons**: `{"bullet": {"icon": "phone"}, "value": "Contact info"}`
- **Text bullets**: `{"bullet": "•", "value": "List item"}`
- **Custom bullets**: `{"bullet": "-", "value": "Custom marker"}`

### PII Protection

- `cv.json` contains personal data and is gitignored
- `cv.json.backup.*.json` backup files also ignored
- `cv.json.example` provides safe template with placeholder data
- Git history cleaned of personal information using `git filter-branch`
- Perfect for private repository version control

### Icon System

Consistent Tabler Icons via `cv-icon` component:
- **Icons**: phone, house, mail, github, linkedin
- **Props**: icon, size (default: 20), stroke (default: 2), color (default: currentColor)
- **Usage**: `<cv-contact-item icon="phone">+44 123 456 7890</cv-contact-item>`

### Print Support

- **A4 Format**: Exact 210mm width with proper margins
- **Print CSS**: Optimised print styles with color preservation
- **Professional Layout**: Grid-based layout maintains structure when printed

### Handlebars Integration

**Built-in Helpers:**
- `json` - Converts objects to JSON strings for component props
- `customCSS` - Injects styling configuration as CSS custom properties

**Template Structure:**
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

### Development Workflow

1. **Content Updates**: Edit `cv.json` for content and styling changes
2. **Component Development**: Add/modify StencilJS components in `src/components/`
3. **Build**: `bun run build` to compile components
4. **Server**: `bun run server.ts` to start development server
5. **Testing**: Visual testing in browser, print preview for A4 layout

### File Structure

```
cv-editor/
├── src/
│   ├── components/          # StencilJS components
│   │   ├── cv-display/      # Main layout container
│   │   ├── cv-header/       # Header component
│   │   ├── cv-generic-section/ # Universal section system
│   │   ├── cv-subsection/   # Subsection handler
│   │   ├── cv-list-item-generic/ # Flexible list items
│   │   ├── cv-icon/         # Icon system
│   │   └── ...
│   └── components.ts        # Component exports
├── cv.json                  # Personal CV data (gitignored)
├── cv.json.backup.*.json   # Backup files (gitignored)
├── cv.json.example         # Safe template file
├── index.hbs               # Handlebars template with CSS injection
├── server.ts               # Bun server with styling generation
├── styles.css              # Global CSS with custom properties
└── stencil.config.ts       # StencilJS configuration
```

### British English Implementation

- **Documentation**: British spelling (customise, optimise, colour)
- **Interface**: `lang="en-GB"` in HTML template
- **Content**: UK phone/address formats in examples
- **Technical**: CSS property names remain standard (colors, not colours)

### License

MIT License - see LICENSE file for details.
