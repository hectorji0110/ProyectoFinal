import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import mongoosePaginate from "mongoose-paginate-v2";
/**
 *  Modelo de usuario
 *
 * Descripción:
 *   Representa a los usuarios registrados en el sistema,
 *   incluyendo autenticación, roles, perfil, y sistema de
 *   eliminación lógica (soft delete).
 *
 * Tecnologías Utilizadas:
 *   - Mongoose (modelado de datos)
 *   - bcryptjs (hash de contraseñas)
 *   - validator (validación de email)
 *   - mongoose-paginate-v2 (paginación del modelo)
 *
 */
/**
 * @description Modelo de usuario con soporte para soft delete.
 * @property {String} nombre - Nombre del usuario.
 * @property {String} apellido - Apellido del usuario.
 * @property {String} email - Correo electrónico del usuario.
 * @property {String} contrasena - Contraseña del usuario (debe ser almacenada hasheada). Ejemplo: "Password123".
 * @property {String} telefono - Número de teléfono del usuario.
 * @property {String} direccion - Dirección del usuario.
 * @property {String} rol - Rol del usuario (usuario o admin).
 * @property {Boolean} activo - Indica si el usuario está activo o no.
 * @property {Date} fecha_registro - Fecha de registro del usuario.
 * @property {Array<String>} foto_perfil - URL o path de la foto de perfil del usuario.
 * @property {String} resetPasswordToken - Token temporal para recuperar contraseña.
 * @property {Date} resetPasswordExpire - Expira token de recuperación.
 * @property {Date} borradoEn - Fecha en que el usuario fue marcado como borrado (soft delete).
 * @property {Boolean} borrado - Indica si el usuario ha sido marcado como borrado (soft delete).
 * @property {Date} createdAt  
 * @property {Date} updatedAt  
 *  Manejados automáticamente gracias a `{ timestamps: true }`
 */
const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [30, "El nombre no puede tener más de 30 caracteres"],
      lowercase: true,
      match: [
        /^[a-zA-ZÀ-ÿ\s]+$/,
        "El nombre solo puede contener letras y espacios",
      ],
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [30, "El nombre no puede tener más de 30 caracteres"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-ZÀ-ÿ\s]+$/,
        "El nombre solo puede contener letras y espacios",
      ],
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "El correo electrónico no es válido",
      },
    },
    contrasena: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Ejemplo: acepta +, espacios y 8-15 dígitos
          return !v || /^[+]?[\d\s]{8,15}$/.test(v);
        },
        message: "El número de teléfono no es válido",
      },
    },
    direccion: {
      type: String,
      trim: true,
      maxlength: [100, "La dirección no puede tener más de 100 caracteres"],
    },
    rol: { type: String, enum: ["usuario", "admin"], default: "usuario" },
    activo: { type: Boolean, default: true },
    fecha_registro: { type: Date, default: Date.now },
    foto_perfil: [{ type: String }],
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
    borradoEn: { type: Date, default: null }, // campo para soft delete
    borrado: { type: Boolean, default: false }, // campo para soft delete
  },
  { timestamps: true }
);
/**
 * @function
 * @name pre("save")
 * @memberof module:SeguridadUsuario
 * @param {Function} next - Función que continúa con el flujo de guardado del documento.
 *
 * @description
 * - Verifica si el campo `contrasena` ha sido modificado.
 * - Si **no** ha cambiado, continúa con `next()` sin hacer nada.
 * - Si **sí** cambió (nuevo usuario o actualización de contraseña):
 *   1. Genera un `salt` (valor aleatorio para fortalecer el hash).
 *   2. Hashea la contraseña usando `bcrypt.hash`.
 *   3. Reemplaza la contraseña original con su versión hasheada.
 */
//  Middleware: antes de guardar, hasheamos la contraseña si fue modificada
userSchema.pre("save", async function (next) {
  if (!this.isModified("contrasena")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
    next();
  } catch (error) {
    next(error);
  }
});
/**
 * Método personalizado para comparar contraseñas (login)
 * @param {string} passwordIngresada - Contraseña en texto plano
 * @returns {Promise<boolean>} - true si coincide, false si no
 */
userSchema.methods.compararContrasena = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.contrasena);
};
// Plugin para paginación
userSchema.plugin(mongoosePaginate);
// Exportamos el modelo
export default mongoose.model("User", userSchema);
