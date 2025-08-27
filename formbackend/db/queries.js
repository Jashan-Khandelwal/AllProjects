const pool = require("./pool");

async function getUsers() {
  const { rows } = await pool.query(
    "SELECT id,firstname,lastname,email,age,bio FROM users ORDER BY id"
  );
  return rows;
}

async function insertUser({
  firstname,
  lastname,
  email,
  age = 0,
  bio = "none",
}) {
  await pool.query(
    `INSERT INTO users (firstname, lastname, email, age, bio) 
     VALUES ($1, $2, $3, $4, $5)`,
    [firstname, lastname, email, (age = 0), bio]
  );
}

async function getUser(id) {
  const { rows } = await pool.query(
    "SELECT id, firstname, lastname, email, age, bio FROM users WHERE id = $1",
    [id]
  );
  return rows[0] || null; // return one user or null
}

async function searchUsernames(term) {
  const like = `%${term}%`; // ✅ put % in parameter
  const { rows } = await pool.query(
    "SELECT id, firstname FROM users WHERE LOWER(firstname) LIKE $1 ORDER BY username",
    [like]
  );
  return rows;
}

async function deleteUser(id) {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
}

async function updateUser(id, { firstname, lastname, email, age, bio }) {
  await pool.query(
    `UPDATE users 
     SET firstname = $1, lastname = $2, email = $3, age = $4, bio = $5 
     WHERE id = $6`,
    [firstname, lastname, email, age, bio, id]
  );
}

// Search (name partial on first/last, email partial)
async function searchUsers({ name = "", email = "" }) {
  const conds = [];
  const params = [];

  if (name.trim()) {
    params.push(`%${name.trim().toLowerCase()}%`);
    conds.push(
      "(LOWER(firstname) LIKE $" +
        params.length +
        " OR LOWER(lastname) LIKE $" +
        params.length +
        ")"
    );
  }
  if (email.trim()) {
    params.push(`%${email.trim().toLowerCase()}%`);
    conds.push("LOWER(email) LIKE $" + params.length);
  }

  const where = conds.length ? "WHERE " + conds.join(" AND ") : "";
  const { rows } = await pool.query(
    `SELECT id, firstname, lastname, email, age, bio FROM users ${where} ORDER BY id`,
    params
  );
  return rows;
}
module.exports = {
  getUsers,
  insertUser,
  searchUsernames,
  deleteUser,
  updateUser,
  getUser,
  searchUsers,
};
