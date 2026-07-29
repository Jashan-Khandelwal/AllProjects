require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("./config/passport");

const app = express();

// Only browsers from these origins may call the API. curl/Postman ignore CORS.
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));

// Parse JSON request bodies into req.body. (No urlencoded — there are no HTML forms.)
app.use(express.json());

// Sets up Passport, but NO passport.session() — we're stateless.
app.use(passport.initialize());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", require("./routes/authRouter"));

app.use("/api/posts", require("./routes/postRouter"));
app.use("/api/comments", require("./routes/commentRouter"));

// Nothing matched → JSON 404.
app.use((req, res) => {
  res.status(404).json({ error: { message: "Not found." } });
});

// Any thrown/rejected error lands here → JSON 500 (or err.status).
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message:
        process.env.NODE_ENV === "production"
          ? "Something went wrong."
          : err.message,
    },
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Blog API listening on http://localhost:${PORT}`),
);
