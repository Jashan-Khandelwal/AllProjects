const db = require("../db/queries");
const { query } = require("../db/pool");
// const usersStorage = require("../storages/usersStorage");

// This just shows the new stuff we're adding to the existing contents
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstname")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastname")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(), // optional: converts to lowercase, removes dots for Gmail, etc.
  body("age")
    .optional({ values: "falsy" })
    .isInt({ min: 12, max: 120 })
    .withMessage("number between 12 and 120")
    .toInt(),
  body("bio")
    .optional({ values: "falsy" })
    .isLength({ min: 0, max: 200 })
    .withMessage("0 to 200 characters pls"),
];

exports.usersListGet = async (req, res, next) => {
  try {
    const users = await db.getUsers();
    res.render("index", { title: "User list", users });
  } catch (e) {
    next(e);
  }
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    // const { firstname, lastname, email, age = 0, bio = "none" } = req.body;
    try {
      const { firstname, lastname, email, age = 0, bio = "none" } = req.body;
      await db.insertUser({
        firstname: firstname,
        lastname: lastname,
        email,
        age,
        bio,
      });
      res.redirect("/");
    } catch (e) {
      next(e);
    }
  },
];

exports.usersUpdateGet = async (req, res, next) => {
  try {
    const user = await db.getUser(req.params.id);
    res.render("updateUser", { title: "Update user", user });
  } catch (e) {
    next(e);
  }
};

exports.usersUpdatePost = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    try {
      const user = await db.getUser(req.params.id);
      if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
          title: "Update user",
          user,
          errors: errors.array(),
        });
      }
      const { firstname, lastname, email, age = 0, bio = "none" } = req.body;
      await db.updateUser(req.params.id, {
        firstname: firstname,
        lastname: lastname,
        email,
        age,
        bio,
      });
      res.redirect("/");
    } catch (e) {
      next(e);
    }
  },
];

// Tell the server to delete a matching user, if any. Otherwise, respond with an error.
exports.usersDeletePost = async (req, res, next) => {
  try {
    await db.deleteUser(req.params.id);
    res.redirect("/");
  } catch (e) {
    next(e);
  }
};


exports.usersSearchGet = async (req, res, next) => {
  try {
    const { name = "", email = "" } = req.query;
    const results = await db.searchUsers({ name, email });
    res.render("search", {
      title: "Search users",
      query: { name, email },
      results,
    });
  } catch (e) {
    next(e);
  }
};
// GET /users/search?name=...&email=...
// exports.usersSearchGet = (req, res, next) => {
//   try {
//     const { name = "", email = "" } = req.query;

//     // Case-insensitive partial match for name (first or last), partial for email
//     const n = name.trim().toLowerCase();
//     const e = email.trim().toLowerCase();

//     const results = db.getUsers().filter((u) => {
//       const fullName = `${u.firstname || ""} ${u.lastname || ""}`.toLowerCase();
//       const emailL = (u.email || "").toLowerCase();

//       const nameOk = n
//         ? fullName.includes(n) ||
//           (u.firstname || "").toLowerCase().includes(n) ||
//           (u.lastname || "").toLowerCase().includes(n)
//         : true;
//       const emailOk = e ? emailL.includes(e) : true;

//       return nameOk && emailOk; // both filters if both provided
//     });

//     res.render("search", {
//       title: "Search users",
//       query: { name, email },
//       results,
//     });
//   } catch (e) {
//     next(e);
//   }
// };
