const { Pool } = require("pg");
// require("dotenv").config(); // Pastikan mengimpor dotenv untuk membaca file .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/latihan_login",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

module.exports = pool;
