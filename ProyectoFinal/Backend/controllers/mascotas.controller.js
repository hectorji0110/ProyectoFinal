import Mascota from "../models/mascota.models.js";
import User from "../models/user.models.js";
/**
 * @route POST /mascotas
 * @access Privado (usuario autenticado)
 * @description Crea una nueva mascota
 * Los administradores pueden asignar la mascota a otro usuario usando el email.
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Datos de la mascota (nombre, tipo, edad, raza, etc.)
 * @param {Object} req.user - Usuario autenticado (extraído del token)
 * @param {Object} res - Objeto de respuesta Express
 *
 * @returns {Object} - Retorna la mascota creada
 */
export const createMascota = async (req, res) => {
  try {
    const { email, ...body } = req.body;
    let usuarioId = req.user.id; // por defecto el usuario autenticado
    // Si envían un correo distinto y el usuario es admin, buscar usuario por correo
    if (email) {
      if (req.user.rol !== "admin") {
        return res
          .status(403)
          .json({
            msg: "No tienes permisos para asignar mascotas a otro usuario",
          });
      }
      const usuario = await User.findOne({ email });
      if (!usuario)
        return res
          .status(400)
          .json({ msg: "Usuario con ese correo no encontrado" });
      usuarioId = usuario._id;
    }
    // Crear la mascota
    const data = {
      ...body,
      id_usuario: usuarioId,
      foto: req.file ? [`/uploads/${req.file.filename}`] : null,
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
    if (
      mascota.id_usuario.toString() !== req.user.id &&
      req.user.rol !== "admin"
    ) {
      return res
        .status(403)
        .json({ msg: "No tienes permisos para actualizar esta mascota" });
    }
    // Crear el objeto de actualización
    const updateData = {};
    // Campor a actualizar
    if (req.body.nombre) updateData.nombre = req.body.nombre;
    if (req.body.edad) updateData.edad = req.body.edad;
    if (req.body.tipo) updateData.tipo = req.body.tipo;
    if (req.body.raza) updateData.raza = req.body.raza;
    if (req.body.genero) updateData.genero = req.body.genero;
    if (req.body.tamano) updateData.tamano = req.body.tamano;
    if (req.body.ubicacion) updateData.ubicacion = req.body.ubicacion;
    if (req.body.descripcion) updateData.descripcion = req.body.descripcion;
    if (req.body.telefono) updateData.telefono = req.body.telefono;
    // Estardo(muy importante)
    if (req.body.estado !== undefined) {
      // backend recibe "true"/"false" como textos
      updateData.estado =
        req.body.estado === "true" || req.body.estado === true;
    }
    // Foto (solo si el usuario sube una)
    if (req.file) {
      updateData.foto = `/uploads/${req.file.filename}`;
    }
    const actualizado = await Mascota.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar la mascota" });
  }
};
/**
 * @route DELETE /mascotas/:id
 * @access Privado (admin o dueño de la mascota)
 * @description Elimina una mascota (marca como borrada).
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
    if (
      mascota.id_usuario.toString() !== req.user.id &&
      req.user.rol !== "admin"
    ) {
      return res
        .status(403)
        .json({ msg: "No tienes permisos para eliminar esta mascota" });
    }
    // Soft delete de la mascota
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
 * @description Obtiene todas las mascotas con soporte de filtros y paginación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.query - Parámetros de consulta
 * @param {string} req.query.nombre - Nombre del usuario a buscar
 * @param {string} req.query.tipo - Tipo de mascota a buscar
 * @param {string} req.query.raza - Raza de la mascota a buscar
 * @param {string} req.query.genero - Genero de la mascota a buscar
 * @param {string} req.query.tamano - Tamano de la mascota a buscar
 * @param {string} req.query.ubicacion - Ubicacion de la mascota a buscar
 * @param {string} req.query.inactivas - Mostrar mascotas inactivas
 * @param {string} req.query.borradas - Mostrar mascotas borradas
 * @param {number} [req.query.page] - Página de resultados
 * @param {Object} res - Objeto de respuesta Express
 *
 * @returns {Array} - Lista de mascotas con los datos del usuario creador y de la mascota, filtradas por los parámetros de consulta
 */
// Traer todas las mascotas
export const getAllMascotas = async (req, res) => {
  try {
    const { nombre, tipo, raza, genero, tamano, ubicacion } = req.query;
    let filter = {};
    // Filtro por estado
    // Por defecto: solo activas (estado=true) y no borradas (borrado=false)
    if (req.query.inactivas === "true") {
      filter.estado = false;
    } else if (req.query.inactivas !== "true") {
      filter.estado = true;
    }
    // Filtro por borradas
    if (req.query.borradas === "true") {
      filter.borrado = true;
    } else if (req.query.borradas !== "true") {
      filter.borrado = false;
    }
    // Buscar por nombre del usuario (si se proporciona)
    if (nombre) {
      const usuarios = await User.find({
        nombre: new RegExp(nombre, "i"),
      }).select("_id");
      const idsUsuarios = usuarios.map((u) => u._id);
      filter.id_usuario = { $in: idsUsuarios };
    }
    if (tipo) filter.tipo = new RegExp(tipo, "i");
    if (raza) filter.raza = new RegExp(raza, "i");
    if (genero) filter.genero = genero;
    if (tamano) filter.tamano = tamano;
    if (ubicacion) filter.ubicacion = new RegExp(ubicacion, "i");
    // Paginación
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const docs = await Mascota.find(filter)
      .populate("id_usuario", "nombre email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Mascota.countDocuments(filter);
    res.json({
      docs,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error obteniendo mascotas" });
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
    const mascota = await Mascota.findById(id).populate(
      "id_usuario",
      "nombre email foto_perfil"
    );
    if (!mascota) return res.status(404).json({ msg: "Mascota no encontrada" });
    res.json(mascota);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener la mascota" });
  }
};
/**
 * @route GET /mascotas/mis-mascotas
 * @access Privado (usuario autenticado)
 * @description Obtiene todas las mascotas del usuario autenticado con paginación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.user - Usuario autenticado
 * @param {Object} req.query - Parámetros de consulta
 * @param {number} [req.query.page] - Página de resultados
 * @param {Object} res - Objeto de respuesta Express
 *
 * @returns {Object} Lista paginada de mascotas del usuario
 */
export const getMascotasByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    // Pagina actual y límite por página
    const page = parseInt(req.query.page) || 1;
    const limit = 6; // puedes cambiarlo
    const skip = (page - 1) * limit;
    // Mascotas del usuario
    const mascotas = await Mascota.find({
      id_usuario: userId,
      borrado: false,
      estado: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total de mascotas del usuario (para saber cuántas páginas hay)
    const total = await Mascota.countDocuments({
      id_usuario: userId,
      borrado: false,
      estado: true,
    });
    res.json({
      mascotas,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error obteniendo publicaciones" });
  }
};
/**
 * @route PATCH /mascotas/restore/:id
 * @access Privado (admin)
 * @description Restaura una mascota previamente eliminada (soft delete)
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID de la mascota
 * @param {Object} res - Objeto de respuesta Express
 *
 * @returns {Object} Mensaje de confirmación de restauración
 */
export const restaurarMascota = async (req, res) => {
  try {
    const { id } = req.params;
    await Mascota.findByIdAndUpdate(id, { borrado: false });
    res.json({ message: "Mascota restaurada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error restaurando mascota", error });
  }
};
