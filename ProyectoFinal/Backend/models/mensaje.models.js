import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  asunto: { type: String },
  contenido: { type: String, required: true },
  fecha_envio: { type: Date, default: Date.now },
  tipo: { type: String, enum: ["consulta","soporte","reporte"] },
  estado: { type: String, enum: ["abierto","en_proceso","cerrado"], default: "abierto" }
});

export default mongoose.model("Mensaje", mensajeSchema);