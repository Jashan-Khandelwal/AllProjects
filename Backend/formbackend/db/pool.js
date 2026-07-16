const { Pool } = require("pg");

// On a host like Render, DATABASE_URL is provided and requires SSL.
// Locally there is no DATABASE_URL, so fall back to local dev defaults.
module.exports = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.PGHOST || "localhost",
      user: process.env.PGUSER || "postgres",
      database: process.env.PGDATABASE || "form",
      password: process.env.PGPASSWORD || "0005",
      port: process.env.PGPORT || 5432,
    });