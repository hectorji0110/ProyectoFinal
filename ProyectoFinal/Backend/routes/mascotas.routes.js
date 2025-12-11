import { Router } from "express";
import {
  getAllMascotas,
  getMascotaById,
  createMascota,
  updateMascota,
  deleteMascota,
  getMascotasByUser,
  restaurarMascota,
} from "../controllers/mascotas.controller.js";
import { upload } from "../middleware/upload.js";
import { verifyToken } from "../middleware/auth.middleware.js";
/**
 *
 * Rutas para gestionar mascotas
 *
 * Este módulo define las rutas relacionadas con la gestión de
 * mascotas dentro del sistema de adopciones. Incluye funciones
 * para listar, crear, actualizar, eliminar y restaurar mascotas.
 *
 */
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
router.get("/", getAllMascotas);
/**
 * @route GET /mascotas/mis-publicaciones
 * @description Obtiene las mascotas creadas por el usuario autenticado.
 * @access Privado (usuario autenticado)
 * @middleware verifyToken
 * @function getMascotasByUser
 *
 * @returns {Array} Lista de mascotas creadas por el usuario.
 */
// Ruta para traer todas las mascotas de un usuario
router.get("/mis-publicaciones", verifyToken, getMascotasByUser);
/**
 * @route GET /mascotas/:id
 * @description Obtiene una mascota por ID
 * @access Público
 * @function getMascotaById
 *
 * @returns {Object} Información de la mascota encontrada.
 */
//Ruta para traer una mascota por ID
router.get("/:id", getMascotaById);
/**
 * @route POST /mascotas
 * @description  Crea una nueva mascota. Requiere autenticación y permite subir una foto.
 * @access Privado (usuario autenticado)
 * @middleware verifyToken
 * @middleware upload.single('foto')
 * @function createMascota
 *
 * @returns {Object} - Retorna la mascota creada
 */
// Ruta para crear una nueva mascota
router.post("/", verifyToken, upload.single("foto"), createMascota);
/**
 * @route PATCH /mascotas/:id
 * @description Actualiza una mascota por ID
 * @access Privado (usuario autenticado)
 * @middleware verifyToken
 * @middleware upload.single('foto')
 * @function updateMascota
 *
 * @returns {Object} - Retorna la mascota actualizada
 */
// Ruta para actualizar una mascota
router.patch("/:id", verifyToken, upload.single("foto"), updateMascota);
/**
 *  @route DELETE /mascotas/:id
 *  @description Elimina una mascota por ID
 *  @access Privado (usuario autenticado)
 *  @middleware verifyToken
 *  @function deleteMascota
 *
 *  @returns {Object} - Confirmación de eliminación.
 */
// Ruta para eliminar una mascota (soft delete)D
router.delete("/:id", verifyToken, deleteMascota);
/**
 * @route PATCH /mascotas/restore/:id
 * @description Restaura una mascota previamente eliminada (soft delete).
 * @access Público (podría protegerse con verifyToken si lo deseas)
 * @function restaurarMascota
 *
 * @returns {Object} Mascota restaurada.
 */
//Ruta para restaurar una mascota
router.patch("/restore/:id", restaurarMascota);
export default router;
