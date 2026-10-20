import "dotenv/config";
import type { Request, Response } from "express";
import connection from "../db/index.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  role: "admin" | "member";
}

export async function register(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    password.length < 8
  ) {
    res.status(400).json({
      message: "Username harus diisi dan Password nya minimal 8 huruf bre",
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query<ResultSetHeader>(
      `INSERT INTO users (username, password, role)
             VALUES (?, ?, 'member')`,
      [username.trim(), hashedPassword],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            res.status(409).json({
              message: "Username udah dipake",
            });
            return;
          }

          res.status(500).json({
            message: "Gagal ngebuat akun",
          });
          return;
        }

        res.status(201).json({
          message: "Register berhasil",
        });
      },
    );
  } catch {
    res.status(500).json({
      message: "Terjadi kesalahan di server",
    });
  }
}

export function login(req: Request, res: Response): void {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).json({
      message: "Username sama password wajib diisi",
    });
    return;
  }

  connection.query<User[]>(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        console.error("ERROR LOGIN MYSQL:", err);

        res.status(500).json({
          message: "Gagal mengambil data pengguna",
        });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({
          message: "Username ato password salah meureun",
        });
        return;
      }

      const user = results[0];
      const cocok = await bcrypt.compare(password, user.password);

      if (!cocok) {
        res.status(401).json({
          message: "Username ato password salah meureun",
        });
        return;
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "2h" },
      );

      res.json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    },
  );
}
