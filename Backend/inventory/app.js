// app.js — application entry point
require("dotenv").config();
const path = require("node:path");
const express = require("express");

const app = express();

// View engine: EJS templates live in /views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse HTML form submissions (req.body) and serve static files (CSS) from /public
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes

const indexRouter = require("./routes/indexRouter");
app.use("/", indexRouter);

const typeRouter = require("./routes/typeRouter");
app.use("/types", typeRouter);

const pokemonRouter = require("./routes/pokemonRouter");
app.use("/pokemon", pokemonRouter);

const trainerRouter = require("./routes/trainerRouter");
app.use("/trainers", trainerRouter);

// 404 — reached when no route above matched.
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Not found",
    status: 404,
    message: "That page doesn't exist.",
  });
});

// Error handler — the 4-argument signature is what tells Express this is one.
// In production we hide the real error; in development we show it to help debugging.
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).render("error", {
    title: "Error",
    status,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong on our end."
        : err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Pokémon Inventory listening on http://localhost:${PORT}`);
});
