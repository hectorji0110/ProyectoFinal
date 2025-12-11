import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  getAllUsersForSelect,
} from "../controllers/userAdmin.controller.js";
import { verifyToken, isAdminOrOwner } from "../middleware/auth.middleware.js";
/**
 *
 * Rutas administrativas para gestionar usuarios
 *
 * Este módulo define las rutas utilizadas exclusivamente por el administrador
 * para gestionar usuarios dentro del sistema. Incluye funciones como:
 * - Listado de usuarios
 * - Obtención por ID
 * - Creación
 * - Actualización
 * - Eliminación (soft delete)
 * - Restauración
 *
 * Todas las rutas están protegidas mediante:
 * 1. verifyToken → Verifica que el usuario esté autenticado.
 * 2. isAdminOrOwner → Restringe acceso únicamente a administradores.
 *
 */
const router = Router();
/**
 * @route GET /admin/users
 * @description Obtiene todos los usuarios registrados dentro del sistema.
 * @access Privado (solo administrador o dueño)
 * @function getAllUsers
 *
 * @returns {Object} - Objeto con paginación y arreglo de usuarios.
 */
// Ruta para traer todos los usuarios
router.get("/", verifyToken, isAdminOrOwner, getAllUsers); // Solo admin
/** 
 * @route GET /admin/users/all
 * @description Obtiene todos los usuarios registrados dentro del sistema.
 * @access Privado (solo administrador o dueño)
 * @function getAllUsersForSelect
 * 
 * @returns {Object} - Objeto con arreglo de usuarios.
 */
// Ruta para traer todos los usuarios para select
router.get("/all", verifyToken, isAdminOrOwner, getAllUsersForSelect);
/**
 * @route GET /admin/users/:id
 * @description Obtiene un usuario específico según su ID.
 * @access Privado (solo admin o owner)
 * @function getUserById
 *
 *  @returns {Object} - Datos completos del usuario.
 */
//Ruta para traer un usuario por ID
router.get("/:id", verifyToken, isAdminOrOwner, getUserById);
/**
 * @route POST /admin/users
 * @description Permite al administrador crear un nuevo usuario desde el panel administrativo.
 * @access Privado (solo admin o owner)
 * @function createUser
 *
 * @returns {Object} - Retorna el usuario creado
 */
// Ruta para que el admin cree usuarios desde el panel
router.post("/", verifyToken, isAdminOrOwner, createUser);
/**
 * @route PATCH /admin/users/:id
 * @description Actualiza los datos de un usuario identificado por su ID.
 * @access Privado (solo admin o owner)
 * @function updateUser
 *
 * @returns {Object} - Retorna el usuario actualizado
 */
// Ruta para actualizar un usuario
router.patch("/:id", verifyToken, isAdminOrOwner, updateUser);
/**
 * @route DELETE /admin/users/:id
 * @description Realiza un "soft delete" del usuario, marcándolo como borrado sin eliminarlo físicamente.
 * @access Privado (solo admin o owner)
 * @function deleteUser
 *
 * @returns {Object} - Retorna el usuario eliminado
 */
// Ruta para eliminar un usuario (soft delete)
router.delete("/:id", verifyToken, isAdminOrOwner, deleteUser);


/**
 * @route PATCH /admin/users/restore/:id
 * @description Restaura un usuario eliminado (soft delete).
 * @access Privado (solo admin o owner)
 * @function restoreUser
 *
 * @returns {Object} - Usuario restaurado (borrado: false)
 */
// Ruta para restaurar un usuario
router.patch("/restore/:id", restoreUser);

export default router;
