// backend/src/routes/authRoutes.ts
import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

router.post('/login', authController.login);
router.post('/validate', authController.validateToken);

export default router;

