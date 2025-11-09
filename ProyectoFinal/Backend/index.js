import express from "express";//importamos express
import authRoutes from "./routes/auth.routes.js";
import mascotasRoutes from "./routes/mascotas.routes.js";
import adopcionesRoutes from "./routes/adopciones.routes.js";
import mensajesRoutes from "./routes/mensajes.routes.js";
import userAdminRoutes from "./routes/userAdmin.routes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Mongo OK"));

app.use("/auth", authRoutes);
app.use("/admin/users", userAdminRoutes); // Para panel admin
app.use("/mascotas", mascotasRoutes);
app.use("/adopciones", adopcionesRoutes);
app.use("/mensajes", mensajesRoutes);


app.listen(process.env.PORT || 3000, ()=>console.log("Server running"));















/*const app = express(); // Crear el servidor ejecutando express
const port = 3000;//crear un puerto
app.use(express.json());// Middleware para parsear JSON
// Ruta principal
app.get('/', (req, res) => {
  res.send('Bienvenido a la API con Express');
});
// 📌 Montamos las rutas de artículos
app.use("/api/articulos", articulosRoutes);
//iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});*/