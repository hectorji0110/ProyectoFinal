import Mascota from "../models/mascota.models.js";
import User from "../models/user.models.js";


/**
 * @route POST /mascotas
 * @access Privado (usuario autenticado)
 * @description Crea una nueva mascota
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Datos de la mascota (nombre, tipo, edad, raza, etc.)
 * @param {Object} req.user - Usuario autenticado (extraído del token)
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Retorna la mascota creada
 */
export const createMascota = async (req, res) => {
  try {
    // req.user.id viene del verifyToken
    const creadorId = req.user.id;

    // body con datos de la mascota
    const data = {
      ...req.body,
      id_usuario: creadorId
    };

    const mascota = new Mascota(data);
    await mascota.save();
    res.status(201).json(mascota);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al crear mascota" });
  }
};


/**
 * @route PATCH /mascotas/:id
 * @access Privado (admin o dueño de la mascota)
 * @description Actualiza una mascota
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID de la mascota a actualizar
 * @param {Object} req.body - Campos que se desean modificar
 * @param {Object} req.user - Usuario autenticado
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Retorna la mascota actualizada
 */

// Actualizar mascota por id
export const updateMascota = async (req, res) => {
  try {
    const { id } = req.params;
    const mascota = await Mascota.findById(id);

    if (!mascota) return res.status(404).json({ msg: "Mascota no encontrada" });

    // Solo el dueño o admin puede actualizar
    if (mascota.id_usuario.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({ msg: "No tienes permisos para actualizar esta mascota" });
    }

    const actualizado = await Mascota.findByIdAndUpdate(id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar la mascota" });
  }
};

/**
 * @route DELETE /mascotas/:id
 * @access Privado (admin o dueño de la mascota)
 * @description Elimina una mascota
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID de la mascota a eliminar
 * @param {Object} req.user - Usuario autenticado
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Mensaje de confirmación de eliminación
 */

// Eliminar mascota por id
export const deleteMascota = async (req, res) => {
  try {
    const { id } = req.params;
    const mascota = await Mascota.findById(id);

    if (!mascota) return res.status(404).json({ msg: "Mascota no encontrada" });

    // Solo el dueño o admin puede eliminar
    if (mascota.id_usuario.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({ msg: "No tienes permisos para eliminar esta mascota" });
    }

    // ---- SOFT DELETE CORRECTO ----
    mascota.borrado = true;
    mascota.borradoEn = new Date();
    await mascota.save();

    res.json({ msg: "Mascota eliminada correctamente (soft delete)", mascota });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar la mascota" });
  }
};
/**
 * @route GET /mascotas
 * @access Público
 * @description Obtiene todas las mascotas
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.query - Parámetros de consulta
 * @param {string} req.query.nombre - Nombre del usuario a buscar
 * @param {string} req.query.tipo - Tipo de mascota a buscar
 * @param {string} req.query.raza - Raza de la mascota a buscar
 * @param {string} req.query.genero - Genero de la mascota a buscar
 * @param {string} req.query.tamano - Tamano de la mascota a buscar
 * @param {string} req.query.ubicacion - Ubicacion de la mascota a buscar
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Array} - Lista de mascotas con los datos del usuario creador y de la mascota, filtradas por los parámetros de consulta
 */

// Traer todas las mascotas
export const getAllMascotas = async (req, res) => {
  try {
    const { nombre, tipo, raza, genero, tamano, ubicacion } = req.query;
let filter = {}; // excluir mascotas borradas
if (req.query.borradas === "true") {
  filter.borrado = true;
} else {
  filter.borrado = false; // por defecto solo activas
}
 // Buscar por nombre del usuario (si se proporciona)
    if (nombre) {
      const usuarios = await User.find({ nombre: new RegExp(nombre, "i") }).select("_id");
      const idsUsuarios = usuarios.map(u => u._id);
      filter.id_usuario = { $in: idsUsuarios };
    }
;
  if (tipo) filter.tipo = new RegExp(tipo, "i");
  if (raza) filter.raza = new RegExp(raza, "i");
  if (genero) filter.genero = genero;
  if (tamano) filter.tamano = tamano;
  if (ubicacion) filter.ubicacion = new RegExp(ubicacion, "i");

    // Configuración de paginación
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: 10,
      sort: { createdAt: -1 },
      populate: [
        { path: "id_usuario", select: "nombre email" }
      ],
      lean: true,
    };


    const mascotas = await Mascota.paginate(filter, options);
    res.json(mascotas);
  } catch (error) {
    console.error("❌ Error al obtener adopciones:", error);
    res.status(500).json({ msg: "Error al obtener las mascotas" });
  }
};

/**
 * @route GET /mascotas/:id
 * @access Público
 * @description Obtiene una mascota por ID
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID de la mascota a consultar
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Información detallada de la mascota
 */

// Traer mascota por id
export const getMascotaById = async (req, res) => {
  try {
    const { id } = req.params;
    const mascota = await Mascota.findById(id).populate("id_usuario", "nombre email foto_perfil");

    if (!mascota) return res.status(404).json({ msg: "Mascota no encontrada" });

    res.json(mascota);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener la mascota" });
  }
};