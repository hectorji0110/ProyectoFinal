import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react"; // O cualquier icono que tengas
/**
 * Componente: ThemeToggle
 *
 * Componente que permite alternar entre los temas "light" y "dark"
 * utilizando TailwindCSS y la clase global "dark".
 *
 * Funcionalidad principal:
 * - Guarda el tema seleccionado en localStorage para persistencia.
 * - Cambia los íconos dinámicamente según el tema actual.
 *
 */
const ThemeToggle = () => {
  /**
   * Estado local que representa el tema actual.
   * Puede ser:
   *  - "light"
   *  - "dark"
   */
  const [theme, setTheme] = useState("light");
  /**
   * Al cargar el componente:
   * - Obtiene el tema guardado en localStorage.
   * - Si no existe, por defecto es "light".
   * - Aplica la clase "dark" al <html> si corresponde.
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  /**
   * toggleTheme()
   *
   * Cambia el tema actual entre "light" y "dark".
   * - Actualiza el estado interno.
   * - Guarda el valor en localStorage.
   */
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 flex items-center justify-center rounded-md border p-1"
    >
      {/* Ícono dinámico basado en el tema actual */}
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      {/* Accesibilidad: texto oculto */}
      <span className="sr-only">Cambiar tema</span>
    </button>
  );
};
export default ThemeToggle;
