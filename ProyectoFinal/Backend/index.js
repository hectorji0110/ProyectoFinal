import express from "express";//importamos express
import authRoutes from "./routes/auth.routes.js";
import mascotasRoutes from "./routes/mascotas.routes.js";
import adopcionesRoutes from "./routes/adopciones.routes.js";
import mensajesRoutes from "./routes/mensajes.routes.js";
import userAdminRoutes from "./routes/userAdmin.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
/**
 * @description Configuraciones
 * @access Public
 * @returns {Object} - Objeto con el mensaje dexito
 */
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @description Configuraciones cors
 * @access solo los que esten en la lista blanca
 */

//configurar cors
const whitelist = ['http://localhost:3000', 'http://localhost:5173', 'http://192.168.0.108:5173']; // Lista blanca de dominios permitidos
//Opcion privada
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
};
app.use(cors(corsOptions));


// Opcion publica
//app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(join(__dirname, "uploads")));


/**
 * @description Conectar a la base de datos
 * @access Public
 * @returns {Object} - Objeto con el mensaje dexito
 */
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Mongo OK"));


/**
 * @description Rutas
 * @access Public
 * @returns {Object} - Objeto con el mensaje dexito
 */
app.use("/auth", authRoutes);
app.use("/admin/users", userAdminRoutes); // Para panel admin
app.use("/mascotas", mascotasRoutes);
app.use("/adopciones", adopcionesRoutes);
app.use("/mensajes", mensajesRoutes);



app.listen(process.env.PORT || 3000, "0.0.0.0", ()=>console.log("Server running"));















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