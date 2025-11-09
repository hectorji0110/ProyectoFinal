import Adopcion from "../models/adopcion.models.js";
import Mascota from "../models/mascota.models.js";

// Crear solicitud de adopción
export const createAdopcion = async (req, res) => {
  try {
    const { id_mascota, mensaje } = req.body;

    // validar campos
    if (!id_mascota || !mensaje) {
      return res.status(400).json({ msg: "Debe incluir id_mascota y mensaje" });
    }

    // verificar que la mascota existe
    const mascota = await Mascota.findById(id_mascota);
    if (!mascota) return res.status(404).json({ msg: "Mascota no encontrada" });

    const nuevaAdopcion = new Adopcion({
      id_usuario: req.user.id,  // viene del token
      id_mascota,
      mensaje,
      estado: false, // pendiente inicialmente
      fecha_solicitud: new Date()
    });

    await nuevaAdopcion.save();
    res.status(201).json(nuevaAdopcion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar la adopción" });
  }
};

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

// Eliminar adopción
export const deleteAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    const adopcion = await Adopcion.findById(id);

    if (!adopcion) return res.status(404).json({ msg: "Solicitud no encontrada" });

    if (adopcion.id_usuario.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({ msg: "No tienes permisos para eliminar esta solicitud" });
    }

    await Adopcion.findByIdAndDelete(id);
    res.json({ msg: "Solicitud eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar la solicitud" });
  }
};

// Obtener todas las adopciones
export const getAllAdopciones = async (req, res) => {
  try {
    const adopciones = await Adopcion.find()
      .populate("id_usuario", "nombre email")
      .populate("id_mascota", "nombre tipo raza");

    res.json(adopciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las adopciones" });
  }
};

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