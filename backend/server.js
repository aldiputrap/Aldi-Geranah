const express = require("express");
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Init DB Tables
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price VARCHAR(100) NOT NULL,
      image TEXT,
      kategori VARCHAR(100) DEFAULT 'UMUM',
      stok INTEGER DEFAULT 0,
      deskripsi TEXT
    );
    `);

    // Add columns if table already exists (for existing deployment)
    await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS kategori VARCHAR(100) DEFAULT 'UMUM'; `);
    await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS stok INTEGER DEFAULT 0; `);
    await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS deskripsi TEXT; `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(50) NOT NULL,
        total_amount VARCHAR(100) NOT NULL,
        items JSONB,
        status VARCHAR(50) DEFAULT 'Diproses',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add status column if it doesn't exist
    await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Diproses';`);

    console.log("Database tables initialized.");
  } catch (err) {
    console.error("Error initializing database tables:", err.message);
  }
};
const startServer = async () => {
  await initDb();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

startServer();

app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Username sudah terdaftar" });
    }
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, password]
    );
    res.status(201).json({ message: "Register Berhasil", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (result.rows.length > 0) {
      const token = jwt.sign({ id: result.rows[0].id }, "RAHASIA", { expiresIn: "1h" });
      res.json({ message: "Login Berhasil", token });
    } else {
      res.status(401).json({ message: "Username atau Password Salah" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CRUD MASTER PRODUK ---

// READ All
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ Single Product
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
app.post("/api/products", async (req, res) => {
  const { name, price, image, kategori, stok, deskripsi } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO products (name, price, image, kategori, stok, deskripsi) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, price, image, kategori || 'UMUM', stok || 0, deskripsi || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, image, kategori, stok, deskripsi } = req.body;
  try {
    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, image = $3, kategori = $4, stok = $5, deskripsi = $6 WHERE id = $7 RETURNING *",
      [name, price, image, kategori || 'UMUM', stok || 0, deskripsi || '', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ORDER HANDLING ---
app.post("/api/orders", async (req, res) => {
  console.log("Incoming order request:", req.body);
  const { customer_name, address, phone, total_amount, items } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO orders (customer_name, address, phone, total_amount, items) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [customer_name, address, phone, total_amount, JSON.stringify(items)]
    );
    res.status(201).json({ message: "Pesanan berhasil dibuat!", order: result.rows[0] });
  } catch (err) {
    console.error("Order error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET All Orders
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Order Status
app.put("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Order
app.delete("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM orders WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }
    res.json({ message: "Pesanan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});