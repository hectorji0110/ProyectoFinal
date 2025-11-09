import mongoose from "mongoose";

const adopcionSchema = new mongoose.Schema({
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  id_mascota: { type: mongoose.Schema.Types.ObjectId, ref: "Mascota", required: true },
  fecha_solicitud: { type: Date, default: Date.now },
  estado: { type: Boolean, default: false }, // false = pendiente, true = aprobada
  mensaje: { type: String, required: true }
});

export default mongoose.model("Adopcion", adopcionSchema);