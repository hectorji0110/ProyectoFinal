import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  contrasena: { type: String, required: true }, // guardar hashed
  telefono: { type: String },
  direccion: { type: String },
  rol: { type: String, enum: ["usuario", "admin"], default: "usuario" },
  activo: { type: Boolean, default: true }, // 👈 este campo es clave
  fecha_registro: { type: Date, default: Date.now },
  foto_perfil: { type: String } // URL o path
});

export default mongoose.model("User", userSchema);