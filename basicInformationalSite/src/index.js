const http = require("node:http");
const fs = require("node:fs/promises");
// const path = require('node:path');

async function serveFile(res, path, status = 200) {
  try {
    const content = await fs.readFile(path, "utf8");
    res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
    res.end(content);
  } catch (err) {
    const content = await fs.readFile(path, "utf8");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(notFound);
  }
}

http
  .createServer((req, res) => {
    if (req.url === "/" || req.url === "/index.html") {
      return serveFile(res, "index.html");
    }
    if (req.url === "/about") {
      return serveFile(res, "about.html");
    }
    if (req.url === "/contact-me") {
      return serveFile(res, "contact-me.html");
    }
    return serveFile(res, "404.html", 404);
  })
  .listen(8000, () => {
    console.log("server running at http://localhost:8000");
  });
