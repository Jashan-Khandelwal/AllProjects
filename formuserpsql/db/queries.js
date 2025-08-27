const pool = require("./pool");

async function getAllUsernames() {
  const { rows } = await pool.query("SELECT * FROM usernames");
  return rows;
}

async function insertUsername(username) {
  await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
  //   await pool.query("INSERT INTO usernames (username) VALUES ('" + username + "')");
}

async function searchUsernames(term) {
  const like = `%${term}%`; // ✅ put % in parameter
  const { rows } = await pool.query(
    "SELECT id, username FROM usernames WHERE LOWER(username) LIKE $1 ORDER BY username",
    [like]
  );
  return rows;
}

async function deleteall() {
  await pool.query("TRUNCATE TABLE usernames RESTART IDENTITY CASCADE");
}
module.exports = {
  getAllUsernames,
  insertUsername,
  searchUsernames,
  deleteall,
};
