// db/seed.js — recreate the schema and fill it with dummy data.
// Run locally:  npm run seed
// On Render:    node db/seed.js   (uses DATABASE_URL via pool.js)
//
// WARNING: this DROPS the existing tables and rebuilds them from scratch.
require("dotenv").config();
const pool = require("./pool");

// ---------------------------------------------------------------- data
const TYPES = [
  { name: "Normal", color: "#A8A878", description: "Ordinary Pokémon with no elemental affinity." },
  { name: "Fire", color: "#F08030", description: "Hot-headed Pokémon." },
  { name: "Water", color: "#6890F0", description: "Aquatic Pokémon." },
  { name: "Grass", color: "#78C850", description: "Plant-based Pokémon." },
  { name: "Electric", color: "#F8D030", description: "Shockingly fast Pokémon." },
  { name: "Ice", color: "#98D8D8", description: "Frozen Pokémon." },
  { name: "Fighting", color: "#C03028", description: "Martial-arts Pokémon." },
  { name: "Poison", color: "#A040A0", description: "Toxic Pokémon." },
  { name: "Ground", color: "#E0C068", description: "Earthy Pokémon." },
  { name: "Flying", color: "#A890F0", description: "Sky-bound Pokémon." },
  { name: "Psychic", color: "#F85888", description: "Mind-bending Pokémon." },
  { name: "Bug", color: "#A8B820", description: "Insect Pokémon." },
  { name: "Rock", color: "#B8A038", description: "Stony Pokémon." },
  { name: "Ghost", color: "#705898", description: "Spooky Pokémon." },
  { name: "Dragon", color: "#7038F8", description: "Legendary dragon Pokémon." },
  { name: "Dark", color: "#705848", description: "Sinister Pokémon." },
  { name: "Steel", color: "#B8B8D0", description: "Metallic Pokémon." },
  { name: "Fairy", color: "#EE99AC", description: "Enchanting Pokémon." },
];

const TRAINERS = [
  { name: "Ash Ketchum", hometown: "Pallet Town", bio: "Wants to be the very best." },
  { name: "Misty", hometown: "Cerulean City", bio: "Water-type gym leader." },
  { name: "Brock", hometown: "Pewter City", bio: "Rock-type gym leader and cook." },
  { name: "Gary Oak", hometown: "Pallet Town", bio: "Ash's lifelong rival." },
];

// dex number drives the sprite image url
const sprite = (dex) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dex}.png`;

const POKEMON = [
  { name: "Bulbasaur", dex: 1, level: 5, qty: 2, trainer: "Ash Ketchum", types: ["Grass", "Poison"], description: "A strange seed was planted on its back at birth." },
  { name: "Charmander", dex: 4, level: 7, qty: 1, trainer: "Ash Ketchum", types: ["Fire"], description: "The flame on its tail shows its life force." },
  { name: "Charizard", dex: 6, level: 36, qty: 1, trainer: "Ash Ketchum", types: ["Fire", "Flying"], description: "Breathes fire hot enough to melt boulders." },
  { name: "Squirtle", dex: 7, level: 6, qty: 3, trainer: "Ash Ketchum", types: ["Water"], description: "Shoots water at prey while in the water." },
  { name: "Pikachu", dex: 25, level: 12, qty: 1, trainer: "Ash Ketchum", types: ["Electric"], description: "Stores electricity in its cheeks." },
  { name: "Pidgey", dex: 16, level: 4, qty: 5, trainer: "Ash Ketchum", types: ["Normal", "Flying"], description: "A common sight in forests and woods." },
  { name: "Staryu", dex: 120, level: 15, qty: 2, trainer: "Misty", types: ["Water"], description: "Regenerates limbs if they are lost." },
  { name: "Psyduck", dex: 54, level: 10, qty: 1, trainer: "Misty", types: ["Water"], description: "Always troubled by headaches." },
  { name: "Gyarados", dex: 130, level: 30, qty: 1, trainer: "Misty", types: ["Water", "Flying"], description: "An extremely vicious and violent Pokémon." },
  { name: "Geodude", dex: 74, level: 8, qty: 4, trainer: "Brock", types: ["Rock", "Ground"], description: "Found on mountain trails." },
  { name: "Onix", dex: 95, level: 14, qty: 1, trainer: "Brock", types: ["Rock", "Ground"], description: "A rock snake that burrows underground." },
  { name: "Vulpix", dex: 37, level: 9, qty: 2, trainer: "Brock", types: ["Fire"], description: "Its tails split as it grows older." },
  { name: "Eevee", dex: 133, level: 10, qty: 1, trainer: "Gary Oak", types: ["Normal"], description: "Has an unstable genetic makeup." },
  { name: "Gengar", dex: 94, level: 28, qty: 1, trainer: "Gary Oak", types: ["Ghost", "Poison"], description: "Hides in shadows and steals warmth." },
  { name: "Nidoking", dex: 34, level: 32, qty: 1, trainer: "Gary Oak", types: ["Poison", "Ground"], description: "Uses its powerful tail in battle." },
  { name: "Dratini", dex: 147, level: 18, qty: 1, trainer: null, types: ["Dragon"], description: "A rarely seen Pokémon said to be a mirage." },
  { name: "Snorlax", dex: 143, level: 25, qty: 1, trainer: null, types: ["Normal"], description: "Does nothing but eat and sleep." },
];

// ---------------------------------------------------------------- schema
const SCHEMA = `
  DROP TABLE IF EXISTS pokemon_types;
  DROP TABLE IF EXISTS pokemon;
  DROP TABLE IF EXISTS trainers;
  DROP TABLE IF EXISTS types;

  CREATE TABLE types (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description TEXT,
    color       VARCHAR(7)   DEFAULT '#777777'
  );

  CREATE TABLE trainers (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    hometown VARCHAR(100),
    bio      TEXT
  );

  CREATE TABLE pokemon (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    dex_number  INTEGER,
    description TEXT,
    level       INTEGER     DEFAULT 1  CHECK (level BETWEEN 1 AND 100),
    quantity    INTEGER     NOT NULL DEFAULT 1  CHECK (quantity >= 0),
    image_url   TEXT,
    trainer_id  INTEGER     REFERENCES trainers(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE pokemon_types (
    pokemon_id INTEGER NOT NULL REFERENCES pokemon(id) ON DELETE CASCADE,
    type_id    INTEGER NOT NULL REFERENCES types(id)   ON DELETE CASCADE,
    PRIMARY KEY (pokemon_id, type_id)
  );
`;

// ---------------------------------------------------------------- seed
async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(SCHEMA);

    // Insert types, remembering each name's new id.
    const typeId = {};
    for (const t of TYPES) {
      const { rows } = await client.query(
        "INSERT INTO types (name, description, color) VALUES ($1, $2, $3) RETURNING id",
        [t.name, t.description, t.color],
      );
      typeId[t.name] = rows[0].id;
    }

    // Insert trainers, remembering each name's new id.
    const trainerId = {};
    for (const tr of TRAINERS) {
      const { rows } = await client.query(
        "INSERT INTO trainers (name, hometown, bio) VALUES ($1, $2, $3) RETURNING id",
        [tr.name, tr.hometown, tr.bio],
      );
      trainerId[tr.name] = rows[0].id;
    }

    // Insert each Pokémon, then link it to its types via the junction table.
    for (const p of POKEMON) {
      const { rows } = await client.query(
        `INSERT INTO pokemon (name, dex_number, description, level, quantity, image_url, trainer_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [p.name, p.dex, p.description, p.level, p.qty, sprite(p.dex), p.trainer ? trainerId[p.trainer] : null],
      );
      const pid = rows[0].id;
      for (const typeName of p.types) {
        await client.query(
          "INSERT INTO pokemon_types (pokemon_id, type_id) VALUES ($1, $2)",
          [pid, typeId[typeName]],
        );
      }
    }

    await client.query("COMMIT");
    console.log(
      `✅ Seeded ${TYPES.length} types, ${TRAINERS.length} trainers, ${POKEMON.length} Pokémon.`,
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
