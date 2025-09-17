import { serve } from "bun";
import Handlebars from "handlebars";

// Register JSON helper for handlebars
Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

// Helper function to generate CSS custom properties from styling config
function generateCSSCustomProperties(styling) {
  if (!styling) return "";

  const cssVars = [];

  // Colors
  if (styling.colors) {
    Object.entries(styling.colors).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      cssVars.push(`${cssVarName}: ${value};`);
    });
  }

  // Typography
  if (styling.typography) {
    if (styling.typography.fontFamily) {
      cssVars.push(`--font-family: ${styling.typography.fontFamily};`);
    }

    if (styling.typography.fontWeights) {
      Object.entries(styling.typography.fontWeights).forEach(([key, value]) => {
        cssVars.push(`--font-weight-${key}: ${value};`);
      });
    }

    if (styling.typography.fontSizes) {
      Object.entries(styling.typography.fontSizes).forEach(([key, value]) => {
        const cssVarName = `--font-size-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        cssVars.push(`${cssVarName}: ${value};`);
      });
    }

    if (styling.typography.lineHeights) {
      Object.entries(styling.typography.lineHeights).forEach(([key, value]) => {
        const cssVarName = `--line-height-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        cssVars.push(`${cssVarName}: ${value};`);
      });
    }

    if (styling.typography.letterSpacing) {
      Object.entries(styling.typography.letterSpacing).forEach(
        ([key, value]) => {
          const cssVarName = `--letter-spacing-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
          cssVars.push(`${cssVarName}: ${value};`);
        },
      );
    }
  }

  // Spacing
  if (styling.spacing) {
    Object.entries(styling.spacing).forEach(([key, value]) => {
      const cssVarName = `--spacing-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      cssVars.push(`${cssVarName}: ${value};`);
    });
  }

  // Layout
  if (styling.layout) {
    Object.entries(styling.layout).forEach(([key, value]) => {
      const cssVarName = `--layout-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      cssVars.push(`${cssVarName}: ${value};`);
    });
  }

  return cssVars.length > 0 ? `:root {\n  ${cssVars.join("\n  ")}\n}` : "";
}

// Register helper to inject custom CSS
Handlebars.registerHelper("customCSS", function (styling) {
  return new Handlebars.SafeString(generateCSSCustomProperties(styling));
});

// Load template and data
const templateFile = Bun.file("index.hbs");
const cvDataFile = Bun.file("cv.json");

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      try {
        // Read template and data
        const templateContent = await templateFile.text();
        const cvData = await cvDataFile.json();

        // Compile and render template
        const template = Handlebars.compile(templateContent);
        const html = template(cvData);

        return new Response(html, {
          headers: { "Content-Type": "text/html" },
        });
      } catch (error) {
        return new Response(`Error rendering template: ${error.message}`, {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        });
      }
    }

    if (url.pathname === "/reset.css") {
      return new Response(Bun.file("reset.css"), {
        headers: { "Content-Type": "text/css" },
      });
    }

    if (url.pathname === "/styles.css") {
      return new Response(Bun.file("styles.css"), {
        headers: { "Content-Type": "text/css" },
      });
    }

    if (url.pathname.startsWith("/dist/")) {
      const filePath = url.pathname.slice(1); // Remove leading slash
      return new Response(Bun.file(filePath), {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log("Server running at http://localhost:3000");
