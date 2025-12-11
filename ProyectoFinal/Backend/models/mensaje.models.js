import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
// Modelo de mensaje
/**
 * @description Modelo de mensaje con soporte para soft delete.
 * @property {ObjectId} id_usuario - ID del usuario que envió el mensaje.
 * @property {String} asunto - Asunto del mensaje.
 * @property {String} contenido - Contenido del mensaje.
 * @property {Date} fecha_envio - Fecha de envío del mensaje.
 * @property {String} tipo - Tipo de mensaje (consulta, soporte, reporte).
 * @property {String} estado - Estado del mensaje (abierto, en_proceso, cerrado).
 * @property {Date} borradoEn - Fecha en que el usuario fue marcado como borrado (soft delete).
 * @property {Boolean} borrado - Indica si el usuario ha sido marcado como borrado (soft delete).
 * @property {Date} createdAt
 * @property {Date} updatedAt
 *  Manejados automáticamente gracias a `{ timestamps: true }`
 */
const mensajeSchema = new mongoose.Schema(
  {
    id_usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    asunto: {
      type: String,
      trim: true,
      minlength: [3, "El asunto debe tener al menos 3 caracteres"],
      maxlength: [100, "El asunto no puede superar los 100 caracteres"],
    },
    contenido: {
      type: String,
      required: [true, "El contenido del mensaje es obligatorio"],
      trim: true,
      minlength: [10, "El contenido debe tener al menos 10 caracteres"],
      maxlength: [1000, "El contenido no puede superar los 1000 caracteres"],
    },
    fecha_envio: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (value) {
          return value <= Date.now();
        },
        message: "La fecha de envío no puede ser futura",
      },
    },
    tipo: {
      type: String,
      enum: {
        values: ["consulta", "soporte", "reporte"],
        message: "El tipo debe ser 'consulta', 'soporte' o 'reporte'",
      },
    },
    estado: {
      type: String,
      enum: {
        values: ["abierto", "en_proceso", "cerrado"],
        message: "El estado debe ser 'abierto', 'en_proceso' o 'cerrado'",
      },
      default: "abierto",
    },
    borradoEn: { type: Date, default: null },
    borrado: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// Plugin para paginación
mensajeSchema.plugin(mongoosePaginate);
// Exportamos el modelo
export default mongoose.model("Mensaje", mensajeSchema);
