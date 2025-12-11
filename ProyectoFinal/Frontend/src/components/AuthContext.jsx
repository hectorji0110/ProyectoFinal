import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();
/**
 * AuthContext
 *
 * Proveedor de contexto global para la autenticación del usuario.
 * Gestiona token, usuario, inicio/cierre de sesión y expiración por inactividad.
 *
 * FUNCIONALIDAD PRINCIPAL:
 * - login(email, password):
 *      - Envía credenciales al backend.
 *      - Guarda token en localStorage.
 *      - Decodifica el token para obtener la información del usuario.
 *      - Actualiza el contexto y retorna éxito o error.
 *
 * - logout():
 *     - Limpia token y usuario de memoria y localStorage.
 *     - Cierra sesión global para toda la app.
 *
 * - Cargar usuario al iniciar la aplicación:
 *     - Si hay un token en localStorage, se decodifica.
 *     - Consulta al backend para obtener el usuario completo.
 *
 * - Expiración automática por inactividad:
 *      - Si el usuario no mueve el mouse o presiona teclas, la sesión se cierra tras 10 minutos.
 *
 * PROPS:
 * @param {React.ReactNode} children - Componentes hijos envueltos por el proveedor.
 *
 *
 * @component
 * @returns {JSX.Element} Proveedor de contexto para autenticación global.
 */
export const AuthProvider = ({ children }) => {
  // Token de autenticación almacenado localmente
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  // Información del usuario autenticado
  const [user, setUser] = useState(null);
  // Estado booleano simplificado de autenticación
  const isLoggedIn = !!token;
  // Login
  /**
   * Inicia sesión enviando credenciales al backend.
   * @param {string} email - Correo del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<boolean>} true si el login es exitoso, false si falla.
   */
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email,
          contrasena: password,
        }
      );
      const token = res.data.token;
      // Guardar token localmente
      localStorage.setItem("token", token);
      setToken(token);
      // Decodificar token (rol, id, expiración, etc.)
      const decoded = jwtDecode(token);
      setUser(decoded);
      toast.success("Inicio de sesión exitoso");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Credenciales incorrectas");
      return false;
    }
  };
  // logout
  /**
   * Cierra sesión limpiando token y usuario.
   * Utiliza useCallback para evitar recreación innecesaria.
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    toast.success("Sesión cerrada");
  }, []);
  // Cargar usuario desde token al iniciar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Traer usuario completo desde backend
        axios
          .get(`${import.meta.env.VITE_API_URL}/users/${decoded.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setUser(res.data))
          .catch((err) => {
            console.error("Error cargando usuario:", err);
          });
        setToken(token);
      } catch (err) {
        console.error("Token inválido");
        logout();
      }
    }
  }, [logout]);
  // Expiración automática por inactividad
  useEffect(() => {
    let timeout;
    const INACTIVIDAD_MS = 10 * 60 * 1000;
    /**
     * Reinicia el contador de inactividad.
     * Si el contador llega a 0 se ejecuta logout().
     */
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => logout(), INACTIVIDAD_MS);
    };
    // Eventos que reinician el contador
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);
    // Inicializar contador
    resetTimer();
    // Cleanup de eventos al desmontar
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [logout]);
  // Retornno del contexto
  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
