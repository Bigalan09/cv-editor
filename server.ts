import { serve } from "bun";
const Handlebars = require("handlebars");

// Register JSON helper for handlebars
Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

// Register equality helper for conditionals
Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
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

    // API Routes
    if (url.pathname === "/api/cv/data") {
      if (req.method === "GET") {
        try {
          const cvData = await cvDataFile.json();
          return new Response(JSON.stringify({ success: true, data: cvData }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }
    }

    if (url.pathname === "/api/cv/save") {
      if (req.method === "POST") {
        try {
          const requestData = await req.json();
          const { data, createBackup } = requestData;

          // Create backup if requested
          let backupCreated = null;
          if (createBackup) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const backupFilename = `cv.json.backup.${timestamp}`;

            try {
              const currentContent = await cvDataFile.text();
              await Bun.write(backupFilename, currentContent);
              backupCreated = backupFilename;
            } catch (backupError) {
              console.warn("Failed to create backup:", backupError.message);
            }
          }

          // Validate data structure (basic validation)
          if (!data || typeof data !== "object") {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Invalid data format",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // Save the data
          await Bun.write("cv.json", JSON.stringify(data, null, 2));

          return new Response(
            JSON.stringify({
              success: true,
              backupCreated,
            }),
            {
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              success: false,
              error: error.message,
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }
    }

    if (url.pathname === "/api/cv/backups") {
      if (req.method === "GET") {
        try {
          const glob = new Bun.Glob("cv.json.backup.*");
          const files = [];
          for await (const file of glob.scan(".")) {
            files.push(file);
          }
          const backups = [];

          for (const filename of files) {
            try {
              const file = Bun.file(filename);
              const stat = await file.stat();
              backups.push({
                filename,
                timestamp: stat.mtime.toISOString(),
                size: stat.size,
              });
            } catch (fileError) {
              console.warn(
                `Failed to stat backup file ${filename}:`,
                fileError.message,
              );
            }
          }

          // Sort by timestamp descending (newest first)
          backups.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          );

          return new Response(JSON.stringify({ success: true, backups }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }
    }

    // Main CV view route
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

    // Edit route
    if (url.pathname === "/edit") {
      try {
        const editTemplate = await Bun.file("edit.hbs").text();
        const cvData = await cvDataFile.json();

        const template = Handlebars.compile(editTemplate);
        const html = template(cvData);

        return new Response(html, {
          headers: { "Content-Type": "text/html" },
        });
      } catch (error) {
        return new Response(`Error rendering edit template: ${error.message}`, {
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

    if (url.pathname === "/edit-styles.css") {
      return new Response(Bun.file("edit-styles.css"), {
        headers: { "Content-Type": "text/css" },
      });
    }

    if (url.pathname === "/editor.js") {
      return new Response(Bun.file("editor.js"), {
        headers: { "Content-Type": "application/javascript" },
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
