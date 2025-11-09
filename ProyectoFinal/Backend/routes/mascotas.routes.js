import { Router } from 'express';
import { getAllMascotas, getMascotaById, createMascota, updateMascota, deleteMascota } from '../controllers/mascotas.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// Ruta para traer todos las mascotas
router.get('/', getAllMascotas);

//Ruta para traer una mascota por ID
router.get('/:id', getMascotaById);

// Ruta para crear una nueva mascota
router.post('/', verifyToken, createMascota);

// Ruta para actualizar una mascota
router.patch('/:id', verifyToken, updateMascota);

// Ruta para eliminar una mascota (soft delete)D
router.delete('/:id', verifyToken, deleteMascota);

export default router;