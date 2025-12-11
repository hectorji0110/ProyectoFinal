import { Router } from "express";
import {
  login,
  register,
  solicitarRecuperacion,
  restablecerContrasena,
  cambiarContrasena,
  obtenerPerfil,
  actualizarPerfil,
} from "../controllers/auth.controller.js";
import { logout, verifyToken } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.js";
/**
 *
 *   Rutas para autenticación y gestión de usuarios
 *
 * Este módulo gestiona todo el flujo de autenticación, registro,
 * manejo de contraseñas y administración del perfil del usuario.
 *
 */
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
// Router para registrar un nuevo usuario
router.post("/register", register);
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
// Router para iniciar sesión
router.post("/login", login);
/**
 * @route POST /auth/logout
 * @access Privado (requiere JWT)
 * @description Invalida el token del usuario actual.
 *
 * @header Authorization: Bearer <token>
 *
 * @returns {Object} Mensaje de cierre de sesión.
 */
// Rota para cerrar sesión
router.post("/logout", verifyToken, logout);
/**
 * @route POST /auth/recuperar-password
 * @access Público
 * @description Envía un correo con un enlace para restablecer contraseña.
 *
 * @body {string} email - Correo del usuario que solicita el cambio.
 *
 * @returns {Object} Mensaje de confirmación.
 */
// Rutas de recuperar contraseña
router.post("/recuperar-password", solicitarRecuperacion);
/**
 * @route POST /auth/restablecer-password/:token
 * @access Público
 * @description Establece nueva contraseña mediante token enviado al correo.
 *
 * @param {string} token - Token temporal para restablecer contraseña.
 *
 * @returns {Object} Mensaje de éxito.
 */
// Rutas de restablecimiento de contraseña
router.post("/restablecer-password/:token", restablecerContrasena);
/**
 * @route PATCH /auth/cambiar-password
 * @access Privado (requiere JWT)
 * @description Cambia contraseña del usuario autenticado.
 *
 *
 * @returns {Object} Mensaje de confirmación.
 */
// Rutas de cambio de contraseña
router.patch("/cambiar-password", verifyToken, cambiarContrasena);
/**
 * @route GET /auth/perfil
 * @access Privado (requiere JWT)
 * @description Obtiene la información del usuario autenticado.
 *
 * @returns {Object} Datos del usuario.
 */
// Rutas de perfil
router.get("/perfil", verifyToken, obtenerPerfil);
/**
 * @route PATCH /auth/perfil
 * @access Privado (requiere JWT)
 * @description Actualiza información del perfil del usuario (incluye foto).
 *
 * @middleware upload.single("fotoPerfil")
 *
 * @returns {Object} Perfil actualizado.
 */
// Ruta para actualizar el perfil
router.patch(
  "/perfil",
  verifyToken,
  upload.single("fotoPerfil"),
  actualizarPerfil
);
export default router;
