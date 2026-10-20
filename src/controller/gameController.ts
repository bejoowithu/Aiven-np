import type { Request, Response } from 'express';
import connection from '../db/index.ts';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Game extends RowDataPacket {
    id: number;
    nama: string;
    deskripsi: string | null;
    gambar: string | null;
    link_download: string;
    platform: string | null;
}

interface GameBody {
    nama: string;
    deskripsi?: string;
    gambar?: string;
    link_download: string;
    platform?: string;
}

export function getGames(
    req: Request,
    res: Response
): void {
    connection.query<Game[]>(
        'SELECT * FROM games ORDER BY id DESC',
        (err, results) => {
            if (err) {
                res.status(500).json({
                    message: 'Gagal mengambil data game!'
                });
                return;
            }

            res.json({ data: results });
        }
    );
}

export function getGameById(
    req: Request,
    res: Response
): void {
    connection.query<Game[]>(
        'SELECT * FROM games WHERE id = ?',
        [req.params.id],
        (err, results) => {
            if (err) {
                res.status(500).json({
                    message: 'Gagal mengambil detail game!'
                });
                return;
            }

            if (results.length === 0) {
                res.status(404).json({
                    message: 'Game tidak ditemukan!'
                });
                return;
            }

            res.json({ data: results[0] });
        }
    );
}

export function createGame(
    req: Request<{}, {}, GameBody>,
    res: Response
): void {
    const {
        nama,
        deskripsi,
        gambar,
        link_download,
        platform
    } = req.body;

    if (
        typeof nama !== 'string' || !nama.trim() ||
        typeof link_download !== 'string' || !link_download.trim()
    ) {
        res.status(400).json({
            message: 'Nama dan link download wajib diisi!'
        });
        return;
    }

    connection.query<ResultSetHeader>(
        `INSERT INTO games
        (nama, deskripsi, gambar, link_download, platform)
        VALUES (?, ?, ?, ?, ?)`,
        [
            nama.trim(),
            deskripsi || null,
            gambar || null,
            link_download.trim(),
            platform || null
        ],
        (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Gagal menambahkan game!'
                });
                return;
            }

            res.status(201).json({
                message: 'Game berhasil ditambahkan!',
                id: result.insertId
            });
        }
    );
}

export function updateGame(
    req: Request<{ id: string }, {}, GameBody>,
    res: Response
): void {
    const {
        nama,
        deskripsi,
        gambar,
        link_download,
        platform
    } = req.body;

    if (
        typeof nama !== 'string' || !nama.trim() ||
        typeof link_download !== 'string' || !link_download.trim()
    ) {
        res.status(400).json({
            message: 'Nama dan link download wajib diisi!'
        });
        return;
    }

    connection.query<ResultSetHeader>(
        `UPDATE games SET
        nama = ?, deskripsi = ?, gambar = ?,
        link_download = ?, platform = ?
        WHERE id = ?`,
        [
            nama.trim(),
            deskripsi || null,
            gambar || null,
            link_download.trim(),
            platform || null,
            req.params.id
        ],
        (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Gagal mengedit game!'
                });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: 'Game tidak ditemukan!'
                });
                return;
            }

            res.json({
                message: 'Game berhasil diperbarui!'
            });
        }
    );
}

export function deleteGame(
    req: Request<{ id: string }>,
    res: Response
): void {
    connection.query<ResultSetHeader>(
        'DELETE FROM games WHERE id = ?',
        [req.params.id],
        (err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'Gagal menghapus game!'
                });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: 'Game tidak ditemukan!'
                });
                return;
            }

            res.json({
                message: 'Game berhasil dihapus!'
            });
        }
    );
}