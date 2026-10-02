import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const types = { html: "text/html", css: "text/css", js: "text/javascript", jpg: "image/jpeg", png: "image/png" };

createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const file = pathname === "/" ? "index.html" : pathname.slice(1);
  if (!["index.html", "styles.css", "script.js", "catalog-data.js"].includes(file) && !/^assets\/[a-z0-9-]+\.(jpg|png)$/.test(file)) {
    response.writeHead(404).end();
    return;
  }
  try {
    const body = await readFile(new URL(file, import.meta.url));
    response.writeHead(200, { "Content-Type": types[file.split(".").pop()] }).end(body);
  } catch {
    response.writeHead(404).end();
  }
}).listen(5173, "127.0.0.1", () => console.log("Catálogo: http://localhost:5173"));
