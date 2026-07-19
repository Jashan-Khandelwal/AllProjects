const { Pool } = require("pg");

// Connection info comes from environment variables (see .env / .env.example).
// In production (e.g. Render) a single DATABASE_URL is provided and needs SSL.
module.exports = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    });
