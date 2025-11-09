import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';

const router = Router();
// POST /auth/register — registrar usuario
router.post('/register', register);

// POST /auth/login — obtener JWT
router.post('/login', login);

export default router;