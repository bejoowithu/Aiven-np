import { Router } from 'express';

import {
    getGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
} from '../controller/gameController.ts';

import authMiddleware from '../middleware/authMiddleware.ts';
import adminMiddleware from '../middleware/adminMidleware.ts';

const router = Router();

// Semua orang bisa melihat katalog
router.get('/', getGames);
router.get('/:id', getGameById);

// Hanya admin yang boleh mengelola game
router.post('/', authMiddleware, adminMiddleware, createGame);
router.put('/:id', authMiddleware, adminMiddleware, updateGame);
router.delete('/:id', authMiddleware, adminMiddleware, deleteGame);

export default router;