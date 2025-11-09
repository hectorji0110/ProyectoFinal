import Mensaje from "../models/mensaje.models.js";

// Crear mensaje o soporte
export const createMensaje = async (req, res) => {
  try {
    const { asunto, contenido, tipo } = req.body;

    if (!asunto || !contenido || !tipo) {
      return res.status(400).json({ msg: "Debe incluir asunto, contenido y tipo" });
    }

    const nuevoMensaje = new Mensaje({
      id_usuario: req.user.id, // del token
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

// Eliminar mensaje
export const deleteMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    const mensaje = await Mensaje.findById(id);

    if (!mensaje) return res.status(404).json({ msg: "Mensaje no encontrado" });

    if (mensaje.id_usuario.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({ msg: "No tienes permisos para eliminar este mensaje" });
    }

    await Mensaje.findByIdAndDelete(id);
    res.json({ msg: "Mensaje eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar el mensaje" });
  }
};

// Obtener todos los mensajes
export const getAllMensajes = async (req, res) => {
  try {
    const mensajes = await Mensaje.find().populate("id_usuario", "nombre email");
    res.json(mensajes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los mensajes" });
  }
};

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