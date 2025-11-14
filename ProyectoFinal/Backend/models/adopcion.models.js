import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

/**
 * @description Modelo de adopcion con soporte para soft delete.
 * @property {ObjectId} id_usuario - ID del usuario que solicita la adopcion.
 * @property {ObjectId} id_mascota - ID de la mascota a adoptar.
 * @property {Date} fecha_solicitud - Fecha de solicitud de la adopcion.
 * @property {String} estado - Estado de la solicitud de adopcion (pendiente, aprobada, rechazada).
 * @property {String} mensaje - Mensaje de la solicitud de adopcion.
 * @property {Date} borradoEn - Fecha en que la mascota fue marcada como borrada (soft delete).
 * @property {Boolean} borrado - Indica si la mascota ha sido marcada como borrada (soft delete).
 */

const adopcionSchema = new mongoose.Schema({
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "El ID del usuario es obligatorio"] },
  id_mascota: { type: mongoose.Schema.Types.ObjectId, ref: "Mascota", required: [true, "El ID de la mascota es obligatorio"] },
  fecha_solicitud: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function (value) {
        return value <= Date.now();
      },
      message: "La fecha de solicitud no puede ser futura"
    }
  },
  estado: {
    type: String,
    enum: {
      values: ["pendiente", "aceptada", "rechazada"],
      message: "El estado debe ser 'pendiente', 'aceptada' o 'rechazada'"
    },
    default: "pendiente"
  },
  mensaje: {
    type: String,
    required: [true, "El mensaje es obligatorio"],
    trim: true,
    minlength: [10, "El mensaje debe tener al menos 10 caracteres"],
    maxlength: [200, "El mensaje no puede superar los 200 caracteres"]
  },
  borradoEn: { type: Date, default: null }, // campo para soft delete
  borrado: { type: Boolean, default: false } // campo para soft delete
}, { timestamps: true });



/**
 * @function
 * @name pre("save")
 * @memberof module:Adopcion
 * @param {Function} next - Función que continúa con el flujo de guardado del documento.
 * 
 * @description
 * Verifica si ya existe una solicitud de adopcion para la misma mascota y el mismo usuario.
 * Si ya existe, lanza un error.
 * Si no existe, continua con el guardado.
 */

adopcionSchema.pre("save", async function(next) {
  const Adopcion = mongoose.model("Adopcion");

  const existente = await Adopcion.findOne({
    id_usuario: this.id_usuario,
    id_mascota: this.id_mascota,
    borrado: false // Solo considera las activas
  });

  if (existente && (!this._id || existente._id.toString() !== this._id.toString())) {
    const error = new Error("Ya existe una solicitud de adopción para esta mascota por este usuario.");
    return next(error);
  }

  next();
});

adopcionSchema.plugin(mongoosePaginate);

export default mongoose.model("Adopcion", adopcionSchema);
