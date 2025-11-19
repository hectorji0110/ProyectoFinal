import { Button } from "./ui/Button";
import ThemeToggle from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn} = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false); // ← menú hamburguesa abierto/cerrado

const handleLogout = () => {
  localStorage.removeItem("token");
  setIsLoggedIn(false); // esto fuerza re-render del Navbar
  navigate("/login");
  toast.success("¡Hasta pronto!");
};

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* 🔸 Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-lg sm:text-xl font-bold text-orange-500">
        <span className="text-lg sm:text-xl text-orange-500">❤️</span>AdoptaMascotas
      </Link>

        </div>

          
          {/* Contenedor botones móviles */}
    <div className="flex items-center gap-2 md:hidden">
      {/* Botón modo claro/oscuro */}
      <ThemeToggle />

      {/* Botón hamburguesa */}
      <button
        className="flex items-center px-2 py-1 border rounded text-orange-500 border-orange-500 text-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
    </div>
          

        {/* Menú */}
        <div
          className={`flex-col md:flex md:flex-row md:items-center gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-900 md:bg-transparent transition-all duration-300 ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          
          {/* SI EL USUARIO ESTÁ LOGUEADO */}
        {isLoggedIn ? (
          <>
            <Link className="hover:text-orange-500 px-4 py-2" to="/lista-mascotas" onClick={() => setIsOpen(false)}>
              Lista de Mascotas
            </Link>

            <Link className="hover:text-orange-500 px-4 py-2" to="/publicar-mascota" onClick={() => setIsOpen(false)}>
              Publicar Mascota
            </Link>

            <Link className="hover:text-orange-500 px-4 py2" to="/mi-cuenta" onClick={() => setIsOpen(false)}>
              Mi Cuenta
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          // SI EL USUARIO NO ESTÁ LOGUEADO
          <>
            <Link
              to="/login"
              className="border border-orange-500 text-orange-500 hover:bg-orange-100 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-900/40 focus-visible:ring-orange-400 px-4 py-2 rounded-lg"
            onClick={() => setIsOpen(false)}>
              Iniciar Sesión
            </Link>

            <Link
              to="/register"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600" 
              onClick={() => setIsOpen(false)}
            >
              Registrarse
            </Link>
          </>
        )}

     {/* 🔸 Botón modo claro/oscuro solo en escritorio */}
      <div className="hidden md:block">
        <ThemeToggle />
      </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;