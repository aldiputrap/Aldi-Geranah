const pool = require("./db");

const checkUsers = async () => {
    try {
        const result = await pool.query("SELECT id, username, password, role FROM users");
        console.log("Current Users in DB:");
        console.table(result.rows);
        process.exit(0);
    } catch (err) {
        console.error("Error checking users:", err.message);
        process.exit(1);
    }
};

checkUsers();
