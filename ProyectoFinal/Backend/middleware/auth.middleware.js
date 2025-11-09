import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const verifyToken = async (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
  if (!token) return res.status(401).json({ msg: "No token, autorización denegada" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded tiene payload: { id, rol, iat, exp }
    req.user = { id: decoded.id, rol: decoded.rol }; // lo pondremos disponible
    // opcional: cargar usuario completo si lo necesitas
    // req.userDoc = await User.findById(decoded.id).select("-contrasena");
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};

export const isAdminOrOwner = (req, res, next) => {
  // si rol es admin, permitir
  if (req.user.rol === "admin") return next();
  // si se está accediendo al recurso propio (por ejemplo :id)
  if (req.params.id && req.params.id === req.user.id) return next();
  return res.status(403).json({ msg: "Acceso restringido" });
};