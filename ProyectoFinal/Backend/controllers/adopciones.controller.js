import Adopcion from "../models/adopcion.models.js";
import User from "../models/user.models.js";
import Mascota from "../models/mascota.models.js";


/**
 * 
 * @route POST /adopciones
 * @access Privado (usuario autenticado)
 * @description Crea una nueva solicitud de adopcion
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Datos enviados por el usuario
 * @param {string} req.body.id_mascota - ID de la mascota a adoptar
 * @param {string} req.body.mensaje - Mensaje o motivo de la adopción
 * @param {Object} req.user - Usuario autenticado (extraído del token)
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Retorna la adopción creada
 */


// Crear solicitud de adopción
export const createAdopcion = async (req, res) => {
  try {
    const { id_usuario, id_mascota, mensaje } = req.body;

    // validar campos
    if (!id_mascota || !mensaje || !id_usuario) {
      return res.status(400).json({ msg: "Debe incluir id_usuario, id_mascota y mensaje" });
    }

    // verificar que la mascota existe
    const mascota = await Mascota.findById(id_mascota);
    if (!mascota) return res.status(404).json({ msg: "Mascota no encontrada" });

    // verificar que el usuario existe
    const usuario = await User.findById(id_usuario);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    const nuevaAdopcion = new Adopcion({
      id_usuario,
      id_mascota,
      mensaje,
      estado: "pendiente",
      fecha_solicitud: new Date()
    });

    await nuevaAdopcion.save();
    res.status(201).json(nuevaAdopcion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar la adopción" });
  }
};


/**
 * @route PATCH /adopciones/:id
 * @access Privado (admin o usuario creador)
 * @description Actualiza una solicitud de adopcion
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID de la adopción a actualizar
 * @param {Object} req.body - Campos a modificar
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Retorna la adopción actualizada
 */

// Actualizar adopción (solo admin o dueño de mascota)
export const updateAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    const adopcion = await Adopcion.findById(id);

    if (!adopcion) return res.status(404).json({ msg: "Solicitud no encontrada" });

    // Si no es admin, solo el usuario que la creó puede modificarla
    if (adopcion.id_usuario.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({ msg: "No tienes permisos para actualizar esta solicitud" });
    }

    const actualizada = await Adopcion.findByIdAndUpdate(id, req.body, { new: true });
    res.json(actualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar la adopción" });
  }
};

/**
 * @route DELETE /adopciones/:id
 * @access Privado (admin o usuario creador)
 * @description Elimina una solicitud de adopcion
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID de la adopción a eliminar
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Mensaje de éxito
 */

// Eliminar adopción
export const deleteAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    const adopcion = await Adopcion.findById(id);

    if (!adopcion) return res.status(404).json({ msg: "Solicitud no encontrada" });

    if (adopcion.id_usuario.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({ msg: "No tienes permisos para eliminar esta solicitud" });
    }

    // ---- SOFT DELETE CORRECTO ----
    adopcion.borrado = true;
    adopcion.borradoEn = new Date();
    await adopcion.save();

    res.json({ msg: "Solicitud eliminada correctamente", adopcion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar la solicitud" });
  }
};

/**
 * @route GET /adopciones
 * @access Privado (admin)
 * @description Traer todas las adopciones, con opción de filtrar por nombre, tipo o raza y estado.
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.query.nombre - Nombre del usuario o  de la mascota a buscar
 * @param {string} req.query.tipo o req.query.raza - Tipo o raza de la mascota a buscar
 * @param {string} req.query.estado - Estado de la adopcion
 * @param {Object} res - Objeto de respuesta Express
 * 
 * 
 * @returns {Array} - Lista de adopciones con datos de usuario y mascota
 */

// Obtener todas las adopciones
export const getAllAdopciones = async (req, res) => {
  try {
    const { nombre, tipo, raza, estado } = req.query;
    let filter = {}; // Soft delete base
    if (req.query.borradas === "true") {
    filter.borrado = true;
  } 

    // 🔍 Buscar por nombre del usuario (si se proporciona)
    if (nombre) {
      const usuarios = await User.find({ nombre: new RegExp(nombre, "i") }).select("_id");
      const idsUsuarios = usuarios.map(u => u._id);
      filter.id_usuario = { $in: idsUsuarios };
    }

    // 🔍 Buscar por tipo o raza de mascota
    if (tipo || raza) {
      const mascotasQuery = {};
      if (tipo) mascotasQuery.tipo = new RegExp(tipo, "i");
      if (raza) mascotasQuery.raza = new RegExp(raza, "i");

      const mascotas = await Mascota.find(mascotasQuery).select("_id");
      const idsMascotas = mascotas.map(m => m._id);
      filter.id_mascota = { $in: idsMascotas };
    }

    // Filtrar por estado si se pasa
    if (estado) filter.estado = estado;

    // Configuración de paginación
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: 6,
      sort: { createdAt: -1 },
      populate: [
        { path: "id_usuario", select: "nombre email" },
        { path: "id_mascota", select: "nombre tipo raza" },
      ],
      lean: true,
    };

    // Ejecutar búsqueda con paginación
    const adopciones = await Adopcion.paginate(filter, options);

    res.json(adopciones);
  } catch (error) {
    console.error("❌ Error al obtener adopciones:", error);
    res.status(500).json({ msg: "Error al obtener las adopciones" });
  }
};




/**
 * @route GET /adopciones/:id
 * @access Privado (usuario autenticado)
 * @description Obtiene una solicitud de adopcion por ID
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID de la adopción a consultar
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Detalle de la adopción con usuario y mascota
 */
// Obtener adopción por ID
export const getAdopcionById = async (req, res) => {
  try {
    const { id } = req.params;
    const adopcion = await Adopcion.findById(id)
      .populate("id_usuario", "nombre email")
      .populate("id_mascota", "nombre tipo raza");

    if (!adopcion) return res.status(404).json({ msg: "Solicitud no encontrada" });

    res.json(adopcion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener la solicitud" });
  }
};
 
export const restoreAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    const adopcion = await Adopcion.findById(id);
    if (!adopcion) return res.status(404).json({ msg: "Solicitud no encontrada" });
    adopcion.borrado = false;
    await adopcion.save();
    res.json({ msg: "Solicitud restaurada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al restaurar la solicitud" });
  }
};  

