import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
/**
 * @description Middleware para verificar el token JWT y adjuntar el usuario al request.
 * - Valida formato y existencia del token.
 * - Verifica la firma y expiración del JWT.
 * - Carga al usuario desde la BD (si no está borrado ni inactivo).
 * - Permite acceso a admin o dueño del recurso.
 * 
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.headers - Headers de la solicitud, se espera Authorization: Bearer <token>.
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 * 
 * 
 * @returns {Function} - Función middleware
 * 
 * @throws {Error} - Si ocurre un error durante la verificación del token
 */
export const tokenBlacklist = new Set();
export const verifyToken = async (req, res, next) => {
  try {
    // 1. Extraer el token del header
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    if (!token) {
      return res
        .status(401)
        .json({ msg: "No se proporcionó un token. Acceso denegado." });
    }
    // 1.5. Verificar si el token está en la blacklist
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ msg: "Token inválido o expirado." });
    }
    // 2. Verificar el token y obtener el payload
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: "Token inválido o expirado." });
    }
    // decoded debe contener { id, rol, iat, exp }
    if (!decoded.id) {
      return res
        .status(401)
        .json({ msg: "Token inválido: falta el ID de usuario." });
    }
    // 3. Buscar usuario en base de datos
    const user = await User.findById(decoded.id).select("-contrasena");
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }
    // 4. Verificar si el usuario sigue activo y no borrado
    // Si el usuario está borrado pero es admin, permitir
    if (user.borrado && user.rol !== "admin") {
      return res.status(403).json({
        msg: "Cuenta desactivada o eliminada. Acceso denegado.",
      });
    }
    // 5. Adjuntar info útil al request
    req.user = {
      id: user._id.toString(),
      rol: user.rol,
      nombre: user.nombre,
      email: user.email,
    };
    next(); //Continuar hacia el siguiente middleware/controlador
  } catch (error) {
    console.error("Error en verifyToken:", error);
    res.status(500).json({ msg: "Error interno en autenticación" });
  }
};
/**
 * @description Middleware para restringir acceso solo a administradores o dueños del recurso.
 * - Permite acceso si el usuario es admin.
 * - Permite acceso si el usuario intenta acceder a su propio recurso (:id).
 * - Denega acceso en cualquier otro caso.
 *
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.user - Usuario autenticado agregado por verifyToken.
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función de middleware siguiente
 *
 * @returns {Function} - Función middleware
 *
 * @throws {Error} - Si ocurre un error durante la verificación
 */
export const isAdminOrOwner = (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ msg: "Usuario no autenticado." });
    }
    // Si el rol es admin → acceso directo
    if (user.rol === "admin") {
      return next();
    }
    // Si intenta acceder a su propio perfil → permitido
    if (req.params.id && req.params.id === user.id) {
      return next();
    }
    // Si no cumple ninguna condición → acceso denegado
    return res
      .status(403)
      .json({ msg: "Acceso restringido. No tienes permisos suficientes." });
  } catch (error) {
    console.error("Error en isAdminOrOwner:", error);
    res.status(500).json({ msg: "Error interno de autorización" });
  }
};
/**
 * @description Cierra sesión del usuario agregando su token a la blacklist.
 * - El token ya no será válido para futuras solicitudes.
 *
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.headers - Headers de la solicitud, se espera Authorization: Bearer <token>.
 * @param {Object} res - Objeto de respuesta Express.
 *
 * @returns {JSON} - Mensaje de éxito indicando que la sesión se cerró correctamente.
 *
 * @throws {500} - Error interno del servidor.
 */
export const logout = (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;

    if (token) {
      tokenBlacklist.add(token);
    }
    return res.json({ msg: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ msg: "Error al cerrar sesión" });
  }
};
