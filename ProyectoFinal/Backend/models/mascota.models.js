import mongoose from "mongoose";

const mascotaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: { type: Number },
  tipo: { type: String, enum: ["perro", "gato", "otro"], required: true },
  raza: { type: String },
  genero: { type: String, enum: ["macho", "hembra", "desconocido"] },
  tamano: { type: String, enum: ["pequeño", "mediano", "grande"] },
  descripcion: { type: String },
  fotos: [{ type: String }], // array de URLs
  ubicacion: { type: String },
  telefono: { type: String },
  fecha_publicacion: { type: Date, default: Date.now },
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

export default mongoose.model("Mascota", mascotaSchema);