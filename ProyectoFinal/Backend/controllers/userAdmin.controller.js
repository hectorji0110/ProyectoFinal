import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

/**
 *@route GET /admin/users
 *@Descripción  gestiona todas las operaciones relacionadas con la administración de usuarios del sistema.
 *Solo los administradores pueden acceder a estas rutas. 
 *Incluye funciones CRUD (crear, leer, actualizar y eliminar).
 *@Acceso Solo admin
 *@param {Object} req - Objeto de solicitud Express
 *@param {Object} req.query - Parámetros de consulta
 *@param {string} req.query.nombre - Nombre del usuario a buscar
 *@param {string} req.query.apellido - Apellido del usuario a buscar
 *@param {Object} res - Objeto de respuesta Express
 *@returns {Object} - Objeto con el mensaje de exito y todos los usuario obtenido, filtrados por los parámetros de consulta
 */

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const { nombre, apellido } = req.query; // Obtener el parámetro de consulta 'nombre'
  let filter = {}; 
  if (nombre) {
    filter.nombre = new RegExp(nombre, 'i'); // Filtro por nombre si se proporciona
  }
  if (apellido) {
    filter.apellido = new RegExp(apellido, 'i'); // Filtro por apellido si se proporciona
  }
  // Configuración de paginación
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: 10,
      sort: { createdAt: -1 },
      select: "-contrasena"
    };


    const usuarios = await User.paginate(filter, options);
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

/**
 *@route GET /admin/users/id:
 *@Descripción Obtiene la información de un usuario específico
 * mediante su ID, siempre que esté activo.
 *@Acceso Solo admin
 *@param {Object} req - Objeto de solicitud Express
 *@param {string} req.params.id - ID del usuario
 *@param {Object} res - Objeto de respuesta Express
 *@returns {Object} - Información del usuario
 */

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const usuario = await User.findOne({ _id: req.params.id, activo: true}).select("-contrasena");
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error });
  }
};

/**
 * @route POST /admin/users
 * @description Crea un nuevo usuario en la base de datos.
 * Solo los administradores pueden usar este endpoint.
 *
 * @access Privado (usuario autenticado)
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Datos del nuevo usuario
 * @param {string} req.body.nombre - Nombre del usuario
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.contrasena - Contraseña del usuario
 * @param {string} req.body.rol - Rol del usuario (admin o usuario)
 * @param {Object} res - Objeto de respuesta Express
 *
 * @returns {Object} - Objeto con el mensaje dexito y el usuario
 */

// Crear usuario (solo admin)
export const createUser = async (req, res) => {
  try {
    const { nombre, apellido, email, contrasena, rol } = req.body;

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ message: "El usuario ya existe" });


    const nuevoUsuario = new User({
      nombre,
      apellido,
      email,
      contrasena,
      rol: rol || "usuario",
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario creado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

/**
 * @route PATCH /admin/users/:id
 * @description Actualiza los datos de un usuario existente.
 * Si el campo 'contrasena' se envía, se vuelve a encriptar.
 * @access Solo admin
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID del usuario a actualizar
 * @param {Object} req.body - Datos actualizados del usuario
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Objeto con el mensaje dexito y el usuario
 */

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.contrasena) {
      updates.contrasena = await bcrypt.hash(updates.contrasena, 10);
    }

    const actualizado = await User.findByIdAndUpdate(id, updates, { new: true }).select("-contrasena");
    if (!actualizado) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario actualizado correctamente", usuario: actualizado });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

/**
 * @route DELETE /admin/users/:id
 * @description Elimina un usuario de la base de datos. Marca un usuario como inactivo (sin eliminarlo).
 * Esto evita la pérdida de datos.
 * @access Solo admin
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.params.id - ID del usuario a eliminar
 * @param {Object} res - Objeto de respuesta Express
 * 
 * @returns {Object} - Objeto con el mensaje dexito
 */


// Eliminar (soft delete)
export const deleteUser = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    usuario.borrado = true;
    usuario.borradoEn = new Date();
    usuario.activo = false;

    await usuario.save();

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};