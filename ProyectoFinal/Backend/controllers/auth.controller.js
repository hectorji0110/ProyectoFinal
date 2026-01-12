import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/user.models.js";
import crypto from "crypto";
/**
 * @route POST /auth/register
 * @access Public
 * @description Registro de usuario con validaciones, hashing automático y generación de token JWT.
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.body.nombre - Nombre del usuario
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.contrasena - Contraseña del usuario
 * @param {string} req.body.rol - Rol del usuario (admin o usuario por defecto)
 * @param {Object} res - Objeto de respuesta Express
 *
 * @returns {Object} - Objeto con el mensaje dexito y el usuario
 */
export const register = async (req, res) => {
  try {
    const { nombre, apellido, email, contrasena, rol } = req.body;
    // validar campos básicos
    if (!nombre || !apellido || !email || !contrasena) {
      return res
        .status(400)
        .json({ msg: "Nombre, apellido, email y contraseña son obligatorios" });
    }
    // Validar que no exista el usuario
    const existe = await User.findOne({ email });
    if (existe)
      return res.status(400).json({ message: "El usuario ya existe" });
    // Crear usuario
    const nuevoUsuario = new User({
      nombre,
      apellido,
      email,
      contrasena,
      rol: rol || "usuario",
    });
    await nuevoUsuario.save();
    res
      .status(201)
      .json({ message: "Usuario creado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};
/**
 * @route POST /auth/login
 * @access Public
 * @description Login de usuario con validaciones y generación de token JWT.
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
    // Aquí se genera el token
    const token = jwt.sign(
      { id: user._id, rol: user.rol, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "3h" } // duración del token
    );
    res.json({
      msg: "Inicio de sesión exitoso",
      token, // aquí te lo devuelve
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
/**
 * @route POST /auth/solicitar-recuperacion
 * @access Público
 * @description Solicita recuperación de contraseña. Genera token temporal y envía correo al usuario.
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {Object} res - Objeto de respuesta Express
 *
 * @returns {Object} - Mensaje confirmando envío de correo
 */
export const solicitarRecuperacion = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ msg: "No existe un usuario con ese email" });
    // Crear token único
    const token = crypto.randomBytes(32).toString("hex");
    // Guardar token en BD
    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hora
    await user.save();
    // URL que se le envía al usuario
    const url = `${process.env.FRONTEND_URL}/restablecer-password/${token}`;
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
 * @route POST /auth/restablecer-password/:token
 * @access Público
 * @description Restablece la contraseña mediante token de recuperación.
 * - Verifica token válido y no expirado.
 * - Valida la nueva contraseña antes de hashear.
 * - Borra el token tras usarlo.
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.token - Token de recuperación
 * @param {string} req.body.nuevaContrasena - Nueva contraseña
 * @param {Object} res - Objeto de respuesta Express
 *
 * @returns {Object} - Mensaje confirmando restablecimiento de contraseña
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
/**
 * @route PATCH /auth/cambiar-contrasena
 * @access Privado (usuario autenticado)
 * @description Cambia la contraseña del usuario autenticado.
 * - Valida coincidencia de nuevas contraseñas.
 * - Hashea la nueva contraseña antes de guardar.
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.body.nuevaPassword - Nueva contraseña
 * @param {string} req.body.confirmarPassword - Confirmación de la nueva contraseña
 * @param {Object} req.user - Usuario autenticado (extraído del token)
 * @param {Object} res - Objeto de respuesta Express
 *
 * @returns {Object} - Mensaje de confirmación de cambio de contraseña
 */
export const cambiarContrasena = async (req, res) => {
  try {
    const userId = req.user.id; // viene del verifyToken
    const { nuevaPassword, confirmarPassword } = req.body;
    if (!nuevaPassword || !confirmarPassword) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    if (nuevaPassword.length < 6) {
      return res
        .status(400)
        .json({ msg: "La contraseña debe tener al menos 6 caracteres" });
    }
    if (nuevaPassword !== confirmarPassword) {
      return res.status(400).json({ msg: "Las contraseñas no coinciden" });
    }
    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(nuevaPassword, salt);
    await User.findByIdAndUpdate(userId, { contrasena: hashed });
    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({ msg: "Error al cambiar la contraseña" });
  }
};
/**
 * @route GET /auth/perfil
 * @access Privado (usuario autenticado)
 * @description Obtiene el perfil completo del usuario autenticado.
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.user - Usuario autenticado
 * @param {Object} res - Objeto de respuesta Express
 *
 * @returns {Object} - Perfil del usuario sin contraseña
 */
export const obtenerPerfil = async (req, res) => {
  try {
    // req.user ya viene del verifyToken
    const userId = req.user.id;
    // Buscar usuario real con info completa
    const usuario = await User.findById(userId).select("-contrasena");
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    return res.json({
      msg: "Perfil obtenido correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        fechaRegistro: usuario.fecha_registro,
        foto_perfil: usuario.foto_perfil,
      },
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
/**
 * @route PATCH /auth/perfil
 * @access Privado (usuario autenticado)
 * @description Actualiza datos del perfil del usuario autenticado.
 * - Permite actualizar nombre, apellido y foto de perfil.
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Datos a actualizar (nombre, apellido)
 * @param {Object} req.file - Foto de perfil opcional
 * @param {Object} req.user - Usuario autenticado
 * @param {Object} res - Objeto de respuesta Express
 *
 * @returns {Object} - Perfil actualizado del usuario
 */
export const actualizarPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, apellido } = req.body;
    const usuario = await User.findById(userId);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    //  si viene una foto en la petición
    if (req.file) {
      usuario.foto_perfil = [`/uploads/${req.file.filename}`]; // lo guardamos como array
    }
    await usuario.save();
    return res.json({
      msg: "Perfil actualizado correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        fechaRegistro: usuario.fecha_registro,
        foto_perfil: usuario.foto_perfil,
      },
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
