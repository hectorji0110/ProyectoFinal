import { Router } from 'express';
import { getAllMensajes, getMensajeById, createMensaje, updateMensaje, deleteMensaje } from '../controllers/mensajes.controller.js';
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// Ruta para traer todos los mensajes
router.get('/', getAllMensajes);

//Ruta para traer un mensaje por ID
router.get('/:id', getMensajeById);

// Ruta para crear un nuevo mensaje
router.post('/', verifyToken, createMensaje);

// Ruta para actualizar un mensaje
router.patch('/:id', verifyToken, updateMensaje);

// Ruta para eliminar un mensaje (soft delete)
router.delete('/:id', verifyToken, deleteMensaje);

export default router;