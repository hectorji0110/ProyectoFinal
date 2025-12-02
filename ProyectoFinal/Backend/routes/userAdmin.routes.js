import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, restoreUser } from '../controllers/userAdmin.controller.js';
import { verifyToken, isAdminOrOwner } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @route GET /users
 * @description Obtiene todos los usuarios
 * @access Público 
 * @function getAllUsers
 * 
 * @returns {Array} - Lista de usuarios
 */
// Ruta para traer todos los usuarios
router.get("/", verifyToken, isAdminOrOwner, getAllUsers); // Solo admin

/**
 * @route GET /users/:id
 * @description Obtiene un usuario por ID
 * @access Público
 * @function getUserById
 * 
 * @returns {Array} - Información detallada del usuario por ID
 */
//Ruta para traer un usuario por ID
router.get("/:id", verifyToken, isAdminOrOwner, getUserById);

/**
 * @route POST /users
 * @description Crea un nuevo usuario
 * @access Privado (usuario autenticado)
 * @function createUser
 * 
 * @returns {Object} - Retorna el usuario creado
 */
// Ruta para que el admin cree usuarios desde el panel
router.post("/", verifyToken, isAdminOrOwner, createUser);

/**
 * @route PATCH /users/:id
 * @description Actualiza un usuario por ID
 * @access Privado (usuario autenticado)
 * @function updateUser
 * 
 * @returns {Object} - Retorna el usuario actualizado
 */
// Ruta para actualizar un usuario
router.patch("/:id", verifyToken, isAdminOrOwner, updateUser);


/**
 * @route DELETE /users/:id
 * @description Elimina un usuario por ID
 * @access Privado (usuario autenticado)
 * @function deleteUser
 * 
 * @returns {Object} - Retorna el usuario eliminado
 */
// Ruta para eliminar un usuario (soft delete)
router.delete('/:id', verifyToken, isAdminOrOwner, deleteUser);
router.patch("/restore/:id", restoreUser);

export default router;