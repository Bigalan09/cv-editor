import { serve } from "bun";

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response(Bun.file("index.html"));
    }

    if (url.pathname === "/reset.css") {
      return new Response(Bun.file("reset.css"), {
        headers: { "Content-Type": "text/css" }
      });
    }

    if (url.pathname === "/styles.css") {
      return new Response(Bun.file("styles.css"), {
        headers: { "Content-Type": "text/css" }
      });
    }

    if (url.pathname.startsWith("/dist/")) {
      const filePath = url.pathname.slice(1); // Remove leading slash
      return new Response(Bun.file(filePath), {
        headers: { "Content-Type": "application/javascript" }
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log("Server running at http://localhost:3000");
