import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/user.models.js";
import crypto from "crypto";

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
    const { nombre, apellido, email, contrasena, rol } = req.body;

    // validar campos básicos
    if (!nombre || !apellido || !email || !contrasena) {
      return res.status(400).json({ msg: "Nombre, apellido, email y contraseña son obligatorios" });
    }

    // Validar que no exista el usuario
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ message: "El usuario ya existe" });


    // Crear usuario
    const nuevoUsuario = new User({
      nombre,
      apellido,
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

    const isMatch = await user.compararContrasena(contrasena);
    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    // 🔹 Aquí se genera el token
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "3h" } // duración del token
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

export const solicitarRecuperacion = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "No existe un usuario con ese email" });

    // Crear token único
    const token = crypto.randomBytes(32).toString("hex");

    // Guardar token en BD
    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hora
    await user.save();

    // URL que se le envía al usuario
    const url = `http://localhost:5173/restablecer-password/${token}`;

    // Enviar correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: "AdoptaMascotas <no-reply@adopta.com>",
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <p>Hola ${user.nombre},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${url}">${url}</a>
      `,
    });

    return res.json({ msg: "Correo enviado. Revisa tu bandeja." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al enviar el correo" });
  }
};


/**
 * @description Controlador para restablecer contraseña mediante token.
 * - Verifica que se reciba la nueva contraseña.
 * - Valida el token y que no haya expirado.
 * - Valida la contraseña antes de hashear.
 * - Hashea y guarda la nueva contraseña.
 * - Borra el token de recuperación después de usarlo.
 * - Guarda el usuario sin validar el schema para evitar errores de hash.
 */
export const restablecerContrasena = async (req, res) => {
  const { token } = req.params;
  const { nuevaContrasena } = req.body;

  if (!nuevaContrasena) {
    return res.status(400).json({ msg: "La nueva contraseña es obligatoria" });
  }

  // Validación de contraseña: al menos 6 caracteres, letras y números
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(nuevaContrasena)) {
    return res.status(400).json({
      msg: "La contraseña debe tener al menos 6 caracteres, incluyendo letras y números",
    });
  }

  try {
    // Buscar usuario con token válido y no expirado
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }

    // Hash de la nueva contraseña
    user.contrasena = nuevaContrasena;

    // Borrar token después de usarlo
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    // Guardar sin ejecutar validaciones del schema para evitar errores
    await user.save({ validateBeforeSave: false });

    return res.json({ msg: "Contraseña restablecida exitosamente" });
  } catch (error) {
    console.error("Error restablecerContrasena:", error);
    return res.status(500).json({ msg: "Error al restablecer la contraseña" });
  }
};