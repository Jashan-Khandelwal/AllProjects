const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("./db/pool");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize()); // ✅ add this
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});

app.get("/", async (req, res, next) => {
  try {
    const { rows: messages } = await pool.query(
      `SELECT m.id,m.content, m.created_at, u.username
       FROM messages m
       JOIN users u ON u.id = m.user_id
       ORDER BY m.created_at DESC`
    );

    // Pass both user (may be undefined) and messages
    res.render("index", { user: req.user, messages });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get("/sign-up", (req, res) => res.render("sign-up"));

app.post("/sign-up", async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      username,
      password,
      confirmpassword,
      membership_status,
    } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).send("Passwords do not match!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (first_name, last_name, username, password, membership_status)
       VALUES ($1, $2, $3, $4, $5)`,
      [first_name, last_name, username, hashedPassword, membership_status]
    );

    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get("/login", (req, res) => res.render("login"));
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/jointheclub", (req, res, next) => {
  res.render("jointheclub");
});

app.post("/jointheclub", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401);
    }
    if (req.body.password.toLowerCase() === "goldfish") {
      const newStatus = "premium";

      await pool.query("update users SET membership_status=$1 where id = $2", [
        newStatus,
        req.user.id,
      ]);
      req.user.membership_status = newStatus;

      return res.redirect("/");
    } else {
      return res.status(403).send("incorrect password");
    }
  } catch (err) {
    console.error(error);
    next(error);
  }
});

app.post("/post-message", async (req, res, next) => {
  try {
    if (!req.user || req.user.membership_status !== "premium") {
      return res.status(403).send("Only premium members can post messages!");
    }

    const message = (req.body.message || "").trim();
    if (!message) return res.status(400).send("Message cannot be empty.");

    await pool.query(
      "INSERT INTO messages (user_id, content) VALUES ($1, $2)",
      [req.user.id, message]
    );

    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post("/delete-message/:id", async (req, res, next) => {
  try {
    if (!req.user || req.user.membership_status !== "admin") {
      return res.status(403).send("only admin can delete");
    }

    const msgId = req.params.id;
    if (!msgId) return res.status(400).send("no such message exists");

    await pool.query("DELETE FROM messages WHERE id=$1", [msgId]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
});
