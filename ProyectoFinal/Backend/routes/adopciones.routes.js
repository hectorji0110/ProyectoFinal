import { Router } from 'express';
import { getAllAdopciones, getAdopcionById, createAdopcion, updateAdopcion, deleteAdopcion } from '../controllers/adopciones.controller.js';
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// Ruta para traer todos las adopciones
router.get('/', getAllAdopciones);

//Ruta para traer una adopcion por ID
router.get('/:id', getAdopcionById);

// Ruta para crear una nueva adopcion
router.post('/', verifyToken, createAdopcion);

// Ruta para actualizar una adopcion
router.patch('/:id', verifyToken, updateAdopcion);

// Ruta para eliminar una adopcion (soft delete)
router.delete('/:id', verifyToken, deleteAdopcion);

export default router;