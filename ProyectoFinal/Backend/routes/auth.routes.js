import { Router } from 'express';
import { login, register, solicitarRecuperacion, restablecerContrasena, cambiarContrasena, obtenerPerfil, actualizarPerfil } from '../controllers/auth.controller.js';
import { logout, verifyToken } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.js";

const router = Router();
/**
 * @route POST /auth/register
 * @access Public
 * @description Registro de usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.body.nombre - Nombre del usuario
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.contrasena - Contraseña del usuario
 * @param {string} req.body.rol - Rol del usuario (admin o usuario)
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Objeto con el mensaje dexito y el usuario
 */
// POST /auth/register — registrar usuario
router.post('/register', register);


/** 
 * @route POST /auth/login
 * @access Public
 * @description Login de usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.contrasena - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Objeto con el mensaje dexito y el usuario
 */
// POST /auth/login — obtener JWT
router.post('/login', login);

router.post("/logout", verifyToken, logout);
router.post("/recuperar-password", solicitarRecuperacion);
router.post("/restablecer-password/:token", restablecerContrasena);
router.patch("/cambiar-password", verifyToken, cambiarContrasena);
router.get("/perfil", verifyToken, obtenerPerfil);
router.patch("/perfil", verifyToken,upload.single("fotoPerfil"), actualizarPerfil);

export default router;