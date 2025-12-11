import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
/**
 * ProtectedRoute
 *
 * Componente que protege rutas privadas verificando si el usuario
 * ha iniciado sesión. Si no está autenticado, redirige automáticamente
 * a la página de login.
 *
 * @component
 * @param {JSX.Element} props.children - Componente hijo que será renderizado si el usuario está autenticado.
 * @returns {JSX.Element} Ruta protegida que muestra el contenido solo si el usuario está logueado.
 */
const ProtectedRoute = ({ children }) => {
  // Obtenemos el estado de autenticación desde el contexto global
  const { isLoggedIn } = useContext(AuthContext);
  /**
   * Si el usuario NO está autenticado, se redirige a /login
   * replace evita que el usuario pueda volver atrás con el navegador.
   */
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  // Si está autenticado, mostramos el contenido protegido
  return children;
};
export default ProtectedRoute;
