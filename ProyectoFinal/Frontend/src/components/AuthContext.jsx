import { createContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  // 🔹 Logout centralizado (NO recarga la app)
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("La sesión ha expirado por inactividad. Vuelva a iniciar sesión.");
  }, []);

  useEffect(() => {
    let timeout;
    const INACTIVIDAD_MS = 10 * 60 * 1000; // 10 min

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout(); // ❗ sin reload
      }, INACTIVIDAD_MS);
    };

    

    // Eventos que reinician el contador
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
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};