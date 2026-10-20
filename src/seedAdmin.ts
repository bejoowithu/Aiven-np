
import "dotenv/config";
import connection from "./db/index.ts";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const username = "admin";
  const password = "Admin12345";

  const hashedPassword = await bcrypt.hash(password, 10);

  connection.query(
    "SELECT id FROM users WHERE username = ? LIMIT 1",
    [username],
    (err, results: any[]) => {
      if (err) {
        console.error("Gagal mencari admin:", err.message);
        connection.end();
        return;
      }

      const sql = results.length > 0
        ? "UPDATE users SET password = ?, role = 'admin' WHERE username = ?"
        : "INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')";

      const values = results.length > 0
        ? [hashedPassword, username]
        : [username, hashedPassword];

      connection.query(sql, values, (error) => {
        if (error) {
          console.error("Gagal menyimpan admin:", error.message);
        } else {
          console.log("Admin berhasil disiapkan!");
          console.log("Username:", username);
          console.log("Password:", password);
        }

        connection.end();
      });
    }
  );
}

seedAdmin();
