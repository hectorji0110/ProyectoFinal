import multer from "multer";
import path from "path";
/**
 * upload
 * @description
 * Middleware encargado de manejar la subida de archivos al servidor usando Multer.
 * Se utiliza principalmente para subir fotos de mascotas y fotos de perfil de usuarios.
 *
 * Este middleware:
 * - Define el almacenamiento local de los archivos.
 * - Controla el nombre final del archivo.
 * - Gestiona automáticamente extensiones y colisiones en nombres.
 *
 */
/**
 * Configuración del almacenamiento de Multer.
 *
 * @property {Function} destination
 *  - Carpeta donde se guardarán los archivos.
 *  - En este caso: `/uploads/`
 *
 * @property {Function} filename
 *  - Función que define el nombre final del archivo.
 */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
// Exportar el middleware
export const upload = multer({ storage });
