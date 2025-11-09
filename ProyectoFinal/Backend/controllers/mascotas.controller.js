import Mascota from "../models/mascota.models.js";

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

    await Mascota.findByIdAndDelete(id);
    res.json({ msg: "Mascota eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar la mascota" });
  }
};

// Traer todas las mascotas
export const getAllMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find().populate("id_usuario", "nombre email foto_perfil");
    res.json(mascotas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las mascotas" });
  }
};

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