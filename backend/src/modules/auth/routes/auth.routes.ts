import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../../../shared/middleware/auth.middleware';

const router = Router();

router.post('/login', (req, res, next) => authController.login(req, res, next));
router.get('/me', authenticate, (req, res, next) => authController.me(req, res, next));
router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));

export default router;
