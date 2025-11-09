import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

// 🟢 Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const usuarios = await User.find().select("-contrasena");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// 🟢 Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select("-contrasena");
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error });
  }
};

// 🟢 Crear usuario (solo admin)
export const createUser = async (req, res) => {
  try {
    const { nombre, email, contrasena, rol } = req.body;

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ message: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = new User({
      nombre,
      email,
      contrasena: hashedPassword,
      rol: rol || "usuario",
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario creado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

// 🟡 Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.contrasena) {
      updates.contrasena = await bcrypt.hash(updates.contrasena, 10);
    }

    const actualizado = await User.findByIdAndUpdate(id, updates, { new: true }).select("-contrasena");
    if (!actualizado) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario actualizado correctamente", usuario: actualizado });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

// 🔴 Eliminar (soft delete)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findById(id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    usuario.activo = false; // marca inactivo si tu modelo lo tiene
    await usuario.save();

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};