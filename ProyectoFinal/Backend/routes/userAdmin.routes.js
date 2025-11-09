import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userAdmin.controller.js';
import { verifyToken, isAdminOrOwner } from "../middleware/auth.middleware.js";

const router = Router();

// Ruta para traer todos los usuarios
router.get("/", verifyToken, isAdminOrOwner, getAllUsers); // Solo admin

//Ruta para traer un usuario por ID
router.get("/:id", verifyToken, getUserById);

// ✅ Ruta para que el admin cree usuarios desde el panel
router.post("/", verifyToken, isAdminOrOwner, createUser);

// Ruta para actualizar un usuario
router.patch("/:id", verifyToken, isAdminOrOwner, updateUser);

// Ruta para eliminar un usuario (soft delete)
router.delete('/:id', verifyToken, isAdminOrOwner, deleteUser);

export default router;