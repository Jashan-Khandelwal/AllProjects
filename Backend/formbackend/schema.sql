-- Run this against your hosted Postgres to create the table the app needs.
CREATE TABLE IF NOT EXISTS usernames (
  id        SERIAL PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname  VARCHAR(255) NOT NULL,
  email     VARCHAR(255),
  age       INTEGER,
  bio       TEXT
);