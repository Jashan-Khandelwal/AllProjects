// app.js
const express = require("express");
const app = express();
const authorRouter = require("./routes/authorRouter");
// const bookRouter = require("./routes/bookRouter");
// const indexRouter = require("./routes/indexRouter");
const path = require("node:path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/authors", authorRouter);


const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// app.use("/books", bookRouter);
// app.use("/", indexRouter);
// app.js

// app.js
const links = [
  { href: "/", text: "Home" },
  { href: "about", text: "About" },
];

const users = ["Rose", "Cake", "Biff"];

app.get("/", (req, res) => {
  res.render("index", { links: links, users: users });
});

// app.get("/", (req, res) => {
//   res.render("index", { message: "EJS rocks!" });
// });

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});

// Every thrown error in the application or the previous middleware function calling `next` with an error as an argument will eventually go to this middleware function
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).send(err);
// });

app.use((err, req, res, next) => {
  console.error(err);
  // We can now specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
  res.status(err.statusCode || 500).send(err.message);
});

// const express = require("express");
// const path = require("path");
// const app = express();

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Middleware: put shared values on res.locals (available to all views)
// app.use((req, res, next) => {
//   res.locals.appName = "My Express App";
//   res.locals.flash = "Saved successfully!";
//   next();
// });

// // Route A: pass `message` directly to res.render
// app.get("/direct", (req, res) => {
//   res.render("index", { message: "Hello from res.render object" });
// });

// // Route B: set `message` on res.locals earlier, then render with no object
// app.get(
//   "/indirect",
//   (req, res, next) => {
//     res.locals.message = "Hello from res.locals";
//     next();
//   },
//   (req, res) => {
//     res.render("index"); // no explicit locals passed
//   }
// );

// app.listen(3000, () => console.log("http://localhost:3000"));
