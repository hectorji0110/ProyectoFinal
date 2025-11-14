import { Router } from 'express';
import { getAllMascotas, getMascotaById, createMascota, updateMascota, deleteMascota } from '../controllers/mascotas.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route GET /mascotas
 * @description Obtiene todas las mascotas
 * @access Público 
 * @function getAllMascotas
 * 
 * @returns {Array} - Lista de mascotas
 */
// Ruta para traer todos las mascotas
router.get('/', getAllMascotas);

/**
 * @route GET /mascotas/:id
 * @description Obtiene una mascota por ID
 * @access Público
 * @function getMascotaById
 * 
 * @returns {Array} - Información detallada de la mascota por ID
 */
//Ruta para traer una mascota por ID
router.get('/:id', getMascotaById);

/**
 * @route POST /mascotas
 * @description Crea una nueva mascota
 * @access Privado (usuario autenticado)
 * @function createMascota
 * 
 * @returns {Object} - Retorna la mascota creada
 */
// Ruta para crear una nueva mascota
router.post('/', verifyToken, createMascota);

/**
 * @route PATCH /mascotas/:id
 * @description Actualiza una mascota por ID
 * @access Privado (usuario autenticado)
 * @function updateMascota
 * 
 * @returns {Object} - Retorna la mascota actualizada
 */
// Ruta para actualizar una mascota
router.patch('/:id', verifyToken, updateMascota);


/**
 *  @route DELETE /mascotas/:id
 *  @description Elimina una mascota por ID
 *  @access Privado (usuario autenticado)
 *  @function deleteMascota
 * 
 *  @returns {Object} - Retorna la mascota eliminada
 */
// Ruta para eliminar una mascota (soft delete)D
router.delete('/:id', verifyToken, deleteMascota);

export default router;