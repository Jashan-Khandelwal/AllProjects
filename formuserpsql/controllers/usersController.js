
const db = require("../db/queries");
const { query } = require("../db/pool");

exports.getUsernames = async (req, res) => {
  const usernames = await db.getAllUsernames();
  console.log("Usernames: ", usernames);
  res.render("dbindex", { title: "dbusers", users: usernames });
  // res.send("Usernames: " + us ernames.map((user) => user.username).join(", "));
};

exports.createUsernameGet = async (req, res) => {
  // render the form
  res.render("dbcreateUser", { title: "DBcreateUser" });
};

exports.createUsernamePost = async (req, res) => {
  const { username } = req.body;
  await db.insertUsername(username);
  res.redirect("/");
};

// controllers/usersController.js
exports.dbSearchGet = async (req, res, next) => {
  try {
    const { name = "" } = req.query; // ✅ from querystring
    const term = name.trim().toLowerCase();

    const results = term
      ? await db.searchUsernames(term) // partial, case-insensitive
      : await db.getAllUsernames(); // if empty, show all (optional)

    res.render("dbsearch", {
      title: "Search DB Users",
      query: { name },
      results,
    });
  } catch (err) {
    next(err);
  }
};

exports.dbdeleteall = async (req, res) => {
  await db.deleteall();
  res.redirect("/");
};
