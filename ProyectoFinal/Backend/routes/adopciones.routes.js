import { Router } from 'express';
import { getAllAdopciones, getAdopcionById, createAdopcion, updateAdopcion, deleteAdopcion } from '../controllers/adopciones.controller.js';
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @route GET /adopciones
 * @description Obtiene todas las solicitudes de adopción activas.
 * @access Público 
 * @function getAllAdopciones
 * 
 * @returns {Array} - Lista de adopciones activas
 */
// Ruta para traer todos las adopciones
router.get('/', getAllAdopciones);

/**
 * @route GET /adopciones/:id
 * @description Obtiene una adopcion por ID
 * @access Público
 * @function getAdopcionById
 * 
 * @returns {Array} - Información detallada de la adopcion por ID
 */
//Ruta para traer una adopcion por ID
router.get('/:id', getAdopcionById);

/** 
 * @route POST /adopciones
 * @description Crea una nueva solicitud de adopcion
 * @access Privado (usuario autenticado)
 * @function createAdopcion
 * 
 * @returns {Object} - Retorna la adopcion creada
 */
// Ruta para crear una nueva adopcion
router.post('/', verifyToken, createAdopcion);


/**
 * @route PATCH /adopciones/:id
 * @description Actualiza una adopcion por ID
 * @access Privado (usuario autenticado)
 * @function updateAdopcion
 * 
 * @returns {Object} - Retorna la adopcion actualizada
 */
// Ruta para actualizar una adopcion
router.patch('/:id', verifyToken, updateAdopcion);

/**
 * @route DELETE /adopciones/:id
 * @description Elimina una adopcion por ID
 * @access Privado (usuario autenticado)
 * @function deleteAdopcion
 * 
 * @returns {Object} - Retorna la adopcion eliminada
 */
// Ruta para eliminar una adopcion (soft delete)
router.delete('/:id', verifyToken, deleteAdopcion);

export default router;