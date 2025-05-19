import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';

const router = Router();

// Définir les routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

export default router;