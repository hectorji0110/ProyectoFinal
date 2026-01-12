import express from "express"; //importamos express
import authRoutes from "./routes/auth.routes.js";
import mascotasRoutes from "./routes/mascotas.routes.js";
import mensajesRoutes from "./routes/mensajes.routes.js";
import userAdminRoutes from "./routes/userAdmin.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
/**
 *
 * @description Configuración principal del servidor Express, conexión a MongoDB,
 * manejo de CORS, rutas principales y configuración de archivos estáticos.
 *
 */
//configuraciones iniciales del servidor
/**
 * @description Carga las variables de entorno desde .env
 */
dotenv.config();
/**
 * @description Inicialización del servidor Express
 */
const app = express();
/**
 * @description Habilita el uso de JSON y formularios (body parser)
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/**
 * @description Configuraciones cors
 * @access solo los que esten en la lista blanca
 */
//configurar cors
const whitelist = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://192.1688.0.10:5173",
  "https://frontend-kappa-sandy-73.vercel.app"
]; // Lista blanca de dominios permitidos
/**
 * @constant corsOptions
 * @description Configuración del middleware CORS con verificación
 * de origen antes de permitir la solicitud.
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Verificar si el origen de la solicitud pertenece a la lista blanca
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // Permitir el origen de la solicitud
      callback(null, true);
    } else {
      // Denegar el origen de la solicitud
      callback(new Error("No permitido por CORS"));
    }
  },
};
// Habilitar CORS
app.use(cors(corsOptions));
// Opcion publica
//app.use(cors());
// Configuración de archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(join(__dirname, "uploads")));
// Conectar a la base de datos
/**
 * @description Conectar a la base de datos
 * @access Public
 * @returns {Object} - Objeto con el mensaje dexito
 */
mongoose.connect(process.env.MONGO_URI).then(() => console.log("Mongo OK"));
// Rutas principales
/**
 * @description Rutas
 * @access Public
 * @returns {Object} - Objeto con el mensaje dexito
 */
app.use("/auth", authRoutes);
app.use("/admin/users", userAdminRoutes); // Para panel admin
app.use("/mascotas", mascotasRoutes);
app.use("/mensajes", mensajesRoutes);
// Iniciar el servidor
/**
 * @description Inicia el servidor en el puerto indicado en .env
 */
app.listen(process.env.PORT || 3000, "0.0.0.0", () =>
  console.log("Server running")
);