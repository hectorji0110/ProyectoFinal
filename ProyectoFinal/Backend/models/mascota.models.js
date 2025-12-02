import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


/**
 * @description Modelo de mascota con soporte para soft delete.
 * @property {String} nombre - Nombre de la mascota.
 * @property {String} edad - Edad de la mascota.
 * @property {String} tipo - Tipo de mascota (perro, gato, otro).
 * @property {String} raza - Raza de la mascota.
 * @property {String} genero - Genero de la mascota (macho, hembra, desconocido).
 * @property {String} tamano - Tamaño de la mascota (pequeño, mediano, grande).
 * @property {String} descripcion - Descripción de la mascota.
 * @property {String} fotos - URLs de las fotos de la mascota.
 * @property {String} ubicacion - Ubicación de la mascota.
 *  @property {String} telefono - Número de teléfono del usuario de la mascota.
 * @property {Date} fecha_publicacion - Fecha de publicación de la mascota.
 * @property {ObjectId} id_usuario - ID del usuario que publicó la mascota.
 * @property {Date} borradoEn - Fecha en que la mascota fue marcada como borrada (soft delete).
 * @property {Boolean} borrado - Indica si la mascota ha sido marcada como borrada (soft delete).
 */


const mascotaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre de la mascota es obligatorio"],
    trim: true,
    minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    maxlength: [50, "El nombre no puede superar los 50 caracteres"]
  },
  edad: { type: Number },
  tipo: {
    type: String,
    lowercase: true,
    enum: {
      values: ["perro", "gato", "otro"],
      message: "El tipo debe ser 'perro', 'gato' u 'otro'"
    },
    required: [true, "El tipo de mascota es obligatorio"]
  },
  raza: {
    type: String,
    trim: true,
    maxlength: [50, "La raza no puede superar los 50 caracteres"]
  },
  genero: {
    type: String,
    lowercase: true,
    enum: {
      values: ["macho", "hembra", "desconocido"],
      message: "El género debe ser 'macho', 'hembra' o 'desconocido'"
    }
  },
  tamano: {
    type: String,
    lowercase: true,
    enum: {
      values: ["pequeño", "mediano", "grande"],
      message: "El tamaño debe ser 'pequeño', 'mediano' o 'grande'"
    }
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, "La descripción no puede superar los 500 caracteres"]
  },
  foto: [{ type: String }], // array de URLs
  ubicacion: {
    type: String,
    trim: true,
    maxlength: [100, "La ubicación no puede superar los 100 caracteres"]
  },
  telefono: {
    type: String,
    validate: {
      validator: function (v) {
        // Acepta números con prefijo +, espacios o guiones
        return /^(\+?\d{1,3}[- ]?)?\d{7,15}$/.test(v);
      },
      message: "El número de teléfono no es válido"
    }
  },
  fecha_publicacion: { type: Date, default: Date.now },
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  borradoEn: { type: Date, default: null }, // campo para soft delete
  borrado: { type: Boolean, default: false }, // campo para soft delete
  estado: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

mascotaSchema.plugin(mongoosePaginate);
export default mongoose.model("Mascota", mascotaSchema);