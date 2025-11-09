import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react"; // O cualquier icono que tengas

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  // Para que se mantenga al recargar la página
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, []);

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
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Cambiar tema</span>
    </button>
  );
};

export default ThemeToggle;