-- schema.sql — Pokémon Inventory database structure
-- Load it with:  psql -U postgres -d pokemon_inventory -f schema.sql

-- Drop in dependency order (children first) so this file is safe to re-run.
DROP TABLE IF EXISTS pokemon_types;
DROP TABLE IF EXISTS pokemon;
DROP TABLE IF EXISTS trainers;
DROP TABLE IF EXISTS types;

-- CATEGORIES: a Pokémon type, e.g. Fire, Water, Grass
CREATE TABLE types (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50)  NOT NULL UNIQUE,
  description TEXT,
  color       VARCHAR(7)   DEFAULT '#777777'   -- hex colour for the type badge
);

-- THIRD ENTITY: a trainer who can own many Pokémon
CREATE TABLE trainers (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  hometown VARCHAR(100),
  bio      TEXT
);

-- ITEMS: an individual Pokémon in the inventory
CREATE TABLE pokemon (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  dex_number  INTEGER,
  description TEXT,
  level       INTEGER     DEFAULT 1  CHECK (level BETWEEN 1 AND 100),
  quantity    INTEGER     NOT NULL DEFAULT 1  CHECK (quantity >= 0),
  image_url   TEXT,
  -- one-to-many: each Pokémon belongs to at most one trainer.
  -- ON DELETE SET NULL => deleting a trainer makes their Pokémon "wild", not deleted.
  trainer_id  INTEGER     REFERENCES trainers(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- JUNCTION TABLE: turns pokemon <-> types into a many-to-many relation.
-- A Pokémon can have 1–2 types; a type is shared by many Pokémon.
-- ON DELETE CASCADE => removing a pokemon or a type just clears the links.
CREATE TABLE pokemon_types (
  pokemon_id INTEGER NOT NULL REFERENCES pokemon(id) ON DELETE CASCADE,
  type_id    INTEGER NOT NULL REFERENCES types(id)   ON DELETE CASCADE,
  PRIMARY KEY (pokemon_id, type_id)
);
