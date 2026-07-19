# Pokémon Inventory

An inventory-management app for a Pokémon world, built with **Express 5**, **PostgreSQL** (raw `pg`), and **EJS**. Full CRUD for every entity. (The Odin Project — Inventory Application.)

## Data model

Three entities with two kinds of relationship:

- **Trainer → Pokémon** is one-to-many (a trainer owns many Pokémon; each Pokémon has at most one trainer, or is "wild").
- **Pokémon ↔ Type** is many-to-many via the `pokemon_types` junction table (a Pokémon has 1–2 types; a type is shared by many Pokémon).

```
trainers ──1───────*── pokemon ──*──[ pokemon_types ]──*── types
```

### Delete policies

| Delete a… | Effect on related rows |
|---|---|
| Pokémon | Its type-links are removed (`ON DELETE CASCADE`) |
| Type | Blocked while any Pokémon still use it |
| Trainer | Their Pokémon become wild (`trainer_id` `ON DELETE SET NULL`) |

## Run locally

```bash
npm install
cp .env.example .env      # then fill in your local Postgres credentials
npm run seed              # creates the tables and loads dummy data
npm run dev               # http://localhost:3000
```

## Project layout

```
app.js              entry point + middleware + error handling
db/pool.js          PostgreSQL connection pool (local env vars OR DATABASE_URL)
db/queries.js       all SQL queries
db/seed.js          rebuilds the schema and inserts dummy data
routes/             one router per resource
controllers/        request handlers + express-validator rules
views/              EJS templates (partials/ shared header, footer, errors)
public/             stylesheet
```

## Deploy

Runs on any Node host. Set a single `DATABASE_URL` env var (the pool switches to SSL automatically), then run `node db/seed.js` once to populate the database.
