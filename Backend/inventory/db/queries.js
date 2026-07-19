const pool = require("./pool");

// ========== TYPES (categories) ==========

// Every type, alphabetically, plus a count of how many Pokémon have it.
async function getAllTypes() {
  const { rows } = await pool.query(
    `SELECT t.id, t.name, t.description, t.color,
            COUNT(pt.pokemon_id)::int AS pokemon_count
     FROM types t
     LEFT JOIN pokemon_types pt ON pt.type_id = t.id
     GROUP BY t.id
     ORDER BY t.name`,
  );
  return rows;
}

// One type by id (or null if not found).
async function getTypeById(id) {
  const { rows } = await pool.query(
    "SELECT id, name, description, color FROM types WHERE id = $1",
    [id],
  );
  return rows[0] || null;
}

// All Pokémon that have a given type (reaches across the junction table).
async function getPokemonByType(typeId) {
  const { rows } = await pool.query(
    `SELECT p.id, p.name, p.dex_number, p.level, p.quantity, p.image_url
        FROM pokemon p
        JOIN pokemon_types pt ON pt.pokemon_id = p.id
        WHERE pt.type_id = $1
        ORDER BY p.name`,
    [typeId],
  );
  return rows;
}

// ========== POKEMON (items) ==========

async function getAllPokemon() {
  const { rows } = await pool.query(
    `SELECT id, name, dex_number, level, quantity, image_url
     FROM pokemon
     ORDER BY name`,
  );
  return rows;
}

// One Pokémon, plus its trainer's name (LEFT JOIN because trainer can be null).
async function getPokemonById(id) {
  const { rows } = await pool.query(
    `SELECT p.id, p.name, p.dex_number, p.description, p.level, p.quantity,
            p.image_url, p.trainer_id, tr.name AS trainer_name
     FROM pokemon p
     LEFT JOIN trainers tr ON tr.id = p.trainer_id
     WHERE p.id = $1`,
    [id],
  );
  return rows[0] || null;
}

// The types attached to one Pokémon (its 1–2 badges).
async function getTypesForPokemon(pokemonId) {
  const { rows } = await pool.query(
    `SELECT t.id, t.name, t.color
     FROM types t
     JOIN pokemon_types pt ON pt.type_id = t.id
     WHERE pt.pokemon_id = $1
     ORDER BY t.name`,
    [pokemonId],
  );
  return rows;
}

// ========== TRAINERS ==========

async function getAllTrainers() {
  const { rows } = await pool.query(
    `SELECT tr.id, tr.name, tr.hometown,
            COUNT(p.id)::int AS pokemon_count
     FROM trainers tr
     LEFT JOIN pokemon p ON p.trainer_id = tr.id
     GROUP BY tr.id
     ORDER BY tr.name`,
  );
  return rows;
}

async function getTrainerById(id) {
  const { rows } = await pool.query(
    "SELECT id, name, hometown, bio FROM trainers WHERE id = $1",
    [id],
  );
  return rows[0] || null;
}

async function getPokemonByTrainer(trainerId) {
  const { rows } = await pool.query(
    `SELECT id, name, dex_number, level, quantity, image_url
     FROM pokemon
     WHERE trainer_id = $1
     ORDER BY name`,
    [trainerId],
  );
  return rows;
}

async function insertType({ name, description, color }) {
  await pool.query(
    "INSERT INTO types (name, description, color) VALUES ($1, $2, $3)",
    [name, description, color],
  );
}

async function updateType(id, { name, description, color }) {
  await pool.query(
    "UPDATE types SET name = $1, description = $2, color = $3 WHERE id = $4",
    [name, description, color, id],
  );
}

// Helper (internal): link a Pokémon to each selected type. Uses the transaction client.
async function linkPokemonTypes(client, pokemonId, typeIds) {
  for (const typeId of typeIds) {
    await client.query(
      "INSERT INTO pokemon_types (pokemon_id, type_id) VALUES ($1, $2)",
      [pokemonId, typeId],
    );
  }
}

// Insert a Pokémon AND its type links together (all-or-nothing).
async function insertPokemon(data, typeIds) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO pokemon (name, dex_number, description, level, quantity, image_url, trainer_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        data.name,
        data.dex_number,
        data.description,
        data.level,
        data.quantity,
        data.image_url,
        data.trainer_id,
      ],
    );
    await linkPokemonTypes(client, rows[0].id, typeIds);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Update a Pokémon: change its fields, then REPLACE its type links.
async function updatePokemon(id, data, typeIds) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE pokemon
       SET name=$1, dex_number=$2, description=$3, level=$4, quantity=$5, image_url=$6, trainer_id=$7
       WHERE id=$8`,
      [
        data.name,
        data.dex_number,
        data.description,
        data.level,
        data.quantity,
        data.image_url,
        data.trainer_id,
        id,
      ],
    );
    await client.query("DELETE FROM pokemon_types WHERE pokemon_id = $1", [id]);
    await linkPokemonTypes(client, id, typeIds);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function insertTrainer({ name, hometown, bio }) {
  await pool.query(
    "INSERT INTO trainers (name, hometown, bio) VALUES ($1, $2, $3)",
    [name, hometown, bio],
  );
}

async function updateTrainer(id, { name, hometown, bio }) {
  await pool.query(
    "UPDATE trainers SET name = $1, hometown = $2, bio = $3 WHERE id = $4",
    [name, hometown, bio, id],
  );
}

// ========== DELETES ==========

async function deletePokemon(id) {
  // The pokemon_types links are removed automatically (ON DELETE CASCADE).
  await pool.query("DELETE FROM pokemon WHERE id = $1", [id]);
}

// How many Pokémon currently have this type — used to guard type deletion.
async function countPokemonForType(typeId) {
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS count FROM pokemon_types WHERE type_id = $1",
    [typeId],
  );
  return rows[0].count;
}

async function deleteType(id) {
  await pool.query("DELETE FROM types WHERE id = $1", [id]);
}

async function deleteTrainer(id) {
  // Their Pokémon become wild automatically (trainer_id ON DELETE SET NULL).
  await pool.query("DELETE FROM trainers WHERE id = $1", [id]);
}

module.exports = {
  getAllTypes,
  getTypeById,
  getPokemonByType,
  getAllPokemon,
  getPokemonById,
  getTypesForPokemon,
  getAllTrainers,
  getTrainerById,
  getPokemonByTrainer,
  insertType,
  updateType,
  insertPokemon,
  updatePokemon,
  insertTrainer,
  updateTrainer,
  deletePokemon,
  countPokemonForType,
  deleteType,
  deleteTrainer,
};
