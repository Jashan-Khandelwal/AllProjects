const express = require("express");
const app = express();
const path = require("path");
// app.get("/", (req, res) => res.send("Hello, world!"));
const root = path.join(__dirname, "");
const PORT = 3000;
app.get("/", (req, res) => {
  console.log(req);
  res.sendFile("index.html", { root });
});
app.get("/about", (req, res) => {
  console.log(req);

  res.sendFile("about.html", { root });
});
app.get("/contact-me", (req, res) => {
  console.log(req);
  res.sendFile("contact-me.html", { root });
});
app.use((req, res) => res.status(404).sendFile("404.html", { root }));
app.listen(PORT, (error) => {
  // This is important!
  // Without this, any startup errors will silently fail
  // instead of giving you a helpful error message.
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});
