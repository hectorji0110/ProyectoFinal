import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  const isLoggedIn = !!token;

  // ----- LOGIN -----
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        contrasena: password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);

      // Decodificar token para extraer rol y demás info
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

  // ----- LOGOUT -----
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    toast.success("Sesión cerrada");
  }, []);

  // ----- CARGAR USUARIO DESDE TOKEN AL INICIAR -----
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);

      // Traer usuario completo desde backend
      axios.get(`${import.meta.env.VITE_API_URL}/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error("Error cargando usuario:", err);
      });

      setToken(token);
    } catch (err) {
      console.error("Token inválido");
      logout();
    }
  }
}, [logout]);

  // ----- EXPIRACIÓN POR INACTIVIDAD -----
  useEffect(() => {
    let timeout;
    const INACTIVIDAD_MS = 10 * 60 * 1000;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => logout(), INACTIVIDAD_MS);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, token, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};