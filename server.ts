import { serve } from "bun";
import Handlebars from "handlebars";

// Register JSON helper for handlebars
Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
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
