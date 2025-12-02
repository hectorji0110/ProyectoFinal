import { Router } from 'express';
import { getAllMensajes, getMensajeById, createMensaje, updateMensaje, deleteMensaje, restaurarMensaje } from '../controllers/mensajes.controller.js';
import { verifyToken } from "../middleware/auth.middleware.js";

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
router.get('/', getAllMensajes);

/**
 * @route GET /mensajes/:id
 * @description Obtiene un mensaje por ID
 * @access Público
 * @function getMensajeById
 * 
 * @returns {Array} - Información detallada del mensaje por ID
 */
//Ruta para traer un mensaje por ID
router.get('/:id', getMensajeById);

/**
 * @route POST /mensajes
 * @description Crea un nuevo mensaje
 * @access Privado (usuario autenticado)
 * @function createMensaje
 * 
 * @returns {Object} - Retorna el mensaje creado
 */
// Ruta para crear un nuevo mensaje
router.post('/', verifyToken, createMensaje);

/**
 * @route PATCH /mensajes/:id
 * @description Actualiza un mensaje por ID
 * @access Privado (usuario autenticado)
 * @function updateMensaje
 * 
 * @returns {Object} - Retorna el mensaje actualizado
 */
// Ruta para actualizar un mensaje
router.patch('/:id', verifyToken, updateMensaje);

/**
 * @route DELETE /mensajes/:id
 * @description Elimina un mensaje por ID
 * @access Privado (usuario autenticado)
 * @function deleteMensaje
 * 
 * @returns {Object} - Retorna el mensaje eliminado
 */
// Ruta para eliminar un mensaje (soft delete)
router.delete('/:id', verifyToken, deleteMensaje);
// PATCH /mensajes/restore/:id
router.patch("/restore/:id", restaurarMensaje);

export default router;