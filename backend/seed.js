const pool = require("./db");

const seedUsers = async () => {
    try {
        // Hapus dulu kalau sudah ada agar bersih
        await pool.query("DELETE FROM users WHERE username = $1", ["admin"]);

        // Buat Admin baru
        await pool.query(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
            ["admin", "admin123", "admin"]
        );

        // Buat Pembeli (jika belum ada)
        await pool.query(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING",
            ["pembeli", "buyer123", "user"]
        );

        console.log("Seed sukses: Akun admin dan pembeli telah diperbarui.");
        process.exit(0);
    } catch (err) {
        console.error("Seed gagal:", err.message);
        process.exit(1);
    }
};

seedUsers();
