import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";

/**
 * @description Registro de usuario con validaciones, hashing automático y generación de token JWT.
 * @route POST /auth/register
 * @access Public
 * @description Registro de usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.body.nombre - Nombre del usuario
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.contrasena - Contraseña del usuario
 * @param {string} req.body.rol - Rol del usuario (admin o usuario)
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Objeto con el mensaje dexito y el usuario
 */

export const register = async (req, res) => {
  try {
    const { nombre, email, contrasena, rol } = req.body;

    // validar campos básicos
    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ msg: "Nombre, email y contraseña son obligatorios" });
    }

    // Validar que no exista el usuario
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ message: "El usuario ya existe" });


    // Crear usuario
    const nuevoUsuario = new User({
      nombre,
      email,
      contrasena,
      rol: rol || "usuario",
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario creado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

/**
 * @description Login de usuario con validaciones y generación de token JWT.
 * @route POST /auth/login
 * @access Public
 * @description Login de usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.contrasena - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Objeto con el mensaje dexito y el usuario
 */
export const login = async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    if (!user.activo || user.borrado) {
      return res.status(403).json({ msg: "Cuenta inactiva o eliminada" });
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    // 🔹 Aquí se genera el token
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } // duración del token
    );

    res.json({
      msg: "Inicio de sesión exitoso",
      token, // 👈 aquí te lo devuelve
      user: {
        id: user._id,
        nombre: user.nombre,
        rol: user.rol,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};