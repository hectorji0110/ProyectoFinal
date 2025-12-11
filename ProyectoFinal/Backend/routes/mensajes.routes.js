import { Router } from "express";
import {
  getAllMensajes,
  getMensajeById,
  createMensaje,
  updateMensaje,
  deleteMensaje,
  restaurarMensaje,
} from "../controllers/mensajes.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
/**
 *
 * Rutas para gestionar mensajes
 *
 *
 * Este módulo define las rutas relacionadas con el manejo de
 * mensajes dentro del sistema. Los mensajes pueden ser enviados
 * por usuarios autenticados y están sujetos a operaciones CRUD.
 *
 *
 */
const router = Router();
/**
 * @route GET /mensajes
 * @description Obtiene todos los mensajes
 * @access Público
 * @function getAllMensajes
 *
 * @returns {Array} - Lista de mensajes
 */
// Ruta para traer todos los mensajes
router.get("/", getAllMensajes);
/**
 * @route GET /mensajes/:id
 * @description Obtiene un mensaje por ID
 * @access Público
 * @function getMensajeById
 *
 * @returns {Object} Información detallada del mensaje encontrado.
 */
//Ruta para traer un mensaje por ID
router.get("/:id", getMensajeById);
/**
 * @route POST /mensajes
 * @description Crea un nuevo mensaje
 * @access Privado (usuario autenticado)
 * @middleware verifyToken
 * @function createMensaje
 *
 * @returns {Object} - Retorna el mensaje creado
 */
// Ruta para crear un nuevo mensaje
router.post("/", verifyToken, createMensaje);
/**
 * @route PATCH /mensajes/:id
 * @description Actualiza un mensaje por ID
 * @access Privado (usuario autenticado)
 * @middleware verifyToken
 * @function updateMensaje
 *
 * @returns {Object} - Retorna el mensaje actualizado
 */
// Ruta para actualizar un mensaje
router.patch("/:id", verifyToken, updateMensaje);
/**
 * @route DELETE /mensajes/:id
 * @description Elimina un mensaje (soft delete) manteniéndolo recuperable.
 * @access Privado (usuario autenticado)
 * @middleware verifyToken
 * @function deleteMensaje
 *
 * @returns {Object} - Retorna el mensaje eliminado
 */
// Ruta para eliminar un mensaje (soft delete)
router.delete("/:id", verifyToken, deleteMensaje);
/**
 * @route PATCH /mensajes/restore/:id
 * @description Restaura un mensaje previamente eliminado con soft delete.
 * @access Público (según tu sistema; se puede proteger si quieres)
 * @function restaurarMensaje
 *
 * @returns {Object} Mensaje restaurado.
 */
// Ruta para restaurar un mensaje
router.patch("/restore/:id", restaurarMensaje);
export default router;
