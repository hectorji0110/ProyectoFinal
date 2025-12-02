import Mensaje from "../models/mensaje.models.js";
import User from "../models/user.models.js";

/**
 * 💬 Crear un nuevo mensaje o solicitud de soporte
 * 
 * @route POST /mensajes
 * @access Privado (usuario autenticado)
 * @description Crea un nuevo mensaje
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Contiene asunto, contenido y tipo del mensaje
 * @param {string} req.body.asunto - Asunto del mensaje o consulta
 * @param {string} req.body.contenido - Texto principal del mensaje
 * @param {string} req.body.tipo - Tipo de mensaje (consulta | soporte | reporte)
 * @param {Object} req.user - Usuario autenticado (extraído del token)
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Retorna el mensaje creado
 */

// Crear mensaje o soporte
export const createMensaje = async (req, res) => {
  try {
  const { id_usuario, asunto, contenido, tipo } = req.body;

if (!asunto || !contenido || !tipo || !id_usuario) {
  return res.status(400).json({ msg: "Debe incluir usuario, asunto, contenido y tipo" });
}


    const nuevoMensaje = new Mensaje({
      id_usuario,
      asunto,
      contenido,
      tipo,
      estado: "abierto",
      fecha_envio: new Date()
    });

    await nuevoMensaje.save();
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al enviar el mensaje" });
  }
};


/**
 * @route PATCH /mensajes/:id
 * @access Privado (admin o autor del mensaje)
 * @description Actualiza un mensaje
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID del mensaje a actualizar
 * @param {Object} req.body - Datos actualizados del mensaje
 * @param {Object} req.user - Usuario autenticado
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Retorna el mensaje actualizado
 */

// Actualizar mensaje (solo admin o autor)
export const updateMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    const mensaje = await Mensaje.findById(id);

    if (!mensaje) return res.status(404).json({ msg: "Mensaje no encontrado" });

    if (mensaje.id_usuario.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({ msg: "No tienes permisos para actualizar este mensaje" });
    }

    const actualizado = await Mensaje.findByIdAndUpdate(id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar el mensaje" });
  }
};


/**
 * @route DELETE /mensajes/:id
 * @access Privado (admin o autor del mensaje)
 * @description Elimina un mensaje
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID del mensaje a eliminar
 * @param {Object} req.user - Usuario autenticado
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Mensaje de confirmación de eliminación
 */

// Eliminar mensaje
export const deleteMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    const mensaje = await Mensaje.findById(id);

    if (!mensaje) return res.status(404).json({ msg: "Mensaje no encontrado" });

    if (mensaje.id_usuario.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({ msg: "No tienes permisos para eliminar este mensaje" });
    }
    
    // ---- SOFT DELETE CORRECTO ----
    mensaje.borrado = true;
    mensaje.borradoEn = new Date();
    await mensaje.save();

    res.json({ msg: "Mensaje eliminado correctamente", mensaje });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar el mensaje" });
  }
};

/**
 * @route GET /mensajes
 * @access Privado (admin)
 * @description Obtiene todos los mensajes
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.query - Parámetros de consulta
 * @param {string} req.query.nombre - Nombre del usuario a buscar
 * @param {string} req.query.asunto - Asunto del mensaje a buscar
 * @param {string} req.query.tipo - Tipo de mensaje a buscar
 * @param {string} req.query.estado - Estado del mensaje a buscar
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Array} - Lista de mensajes con los datos del usuario asociado y de la mascota, filtradas por los parámetros de consulta
 */

// Obtener todos los mensajes
export const getAllMensajes = async (req, res) => {
  try {
    const { nombre, asunto, tipo, estado} = req.query;

let filter = {}; // siempre excluir borrados
if (req.query.borradas === "true") {
  filter.borrado = true;
} 

// Buscar por nombre del usuario (si se proporciona)
    if (nombre) {
      const usuarios = await User.find({ nombre: new RegExp(nombre, "i") }).select("_id");
      const idsUsuarios = usuarios.map(u => u._id);
      filter.id_usuario = { $in: idsUsuarios };
    }
// Filtrar por asunto
if (asunto) filter.asunto = new RegExp(asunto, "i");

// Filtrar por tipo
if (tipo) filter.tipo = tipo;

// Filtrar por estado
if (estado) filter.estado = estado;

 // Configuración de paginación
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: 6,
      sort: { createdAt: -1 },
      populate: [
        { path: "id_usuario", select: "nombre email" }
      ],
      lean: true,
    };


    const mensajes = await Mensaje.paginate(filter, options);
    res.json(mensajes);
  } catch (error) {
    console.error("❌ Error al obtener adopciones:", error);
    res.status(500).json({ msg: "Error al obtener los mensajes" });
  }
};


/**
 * @route GET /mensajes/:id
 * @access Privado (usuario autenticado)
 * @description Obtiene un mensaje por ID
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID del mensaje a consultar
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Mensaje con los datos del usuario asociado
 */

// Obtener mensaje por ID
export const getMensajeById = async (req, res) => {
  try {
    const { id } = req.params;
    const mensaje = await Mensaje.findById(id).populate("id_usuario", "nombre email");

    if (!mensaje) return res.status(404).json({ msg: "Mensaje no encontrado" });

    res.json(mensaje);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el mensaje" });
  }
};

// Restaurar mensaje
export const restaurarMensaje = async (req, res) => {
  const { id } = req.params;

  try {
    const mensaje = await Mensaje.findById(id);

    if (!mensaje) {
      return res.status(404).json({ msg: "Mensaje no encontrado" });
    }

    if (!mensaje.borrado) {
      return res.status(400).json({ msg: "El mensaje ya está activo" });
    }

    mensaje.borrado = false;
    mensaje.borradoEn = null; // si tienes un campo de fecha de borrado
    await mensaje.save({ validateBeforeSave: false });

    res.status(200).json({ msg: "Mensaje restaurado correctamente", mensaje });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al restaurar el mensaje" });
  }
};