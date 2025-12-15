import ThemeToggle from "../ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../AuthContext";
/**
 * Componente: Navbar
 *
 * Barra de navegación principal de la aplicación.
 *
 * FUNCIONALIDADES:
 * - Mostrar navegación diferente según si el usuario está autenticado o no.
 * - Ocultar menú en vistas especiales (login, register).
 * - Contiene menú hamburguesa (mobile) y menú desplegable de usuario (engranaje).
 * - Integración con ThemeToggle para cambiar tema claro/oscuro.
 * - Acceso a rutas protegidas y rutas administrativas.
 * - Cierre de sesión seguro y sincronizado con AuthContext.
 *
 *
 *
 */
const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  // Estado del menú hamburguesa (solo móvil)
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); // menú engranaje abierto/cerrado
  /**
   * handleLogout
   * Cierra la sesión eliminando token y reseteando AuthContext.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    logout(); // esto fuerza re-render del Navbar
    navigate("/login");
    toast.success("¡Hasta pronto!");
  };
  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setIsOpen(false); // opcional: también cierra menú mobile
  };
  // Rutas donde NO debe aparecer menú / hamburguesa / botones login register
  const hideMenu =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/recuperar-password" ||
    location.pathname.startsWith("/restablecer-password/");
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b bg-white backdrop-blur-md dark:bg-gray-900">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo principal*/}
        <Link
          to="/"
          className="text-lg sm:text-xl font-bold text-orange-500 hover:text-orange-600"
        >
          <span className="text-lg sm:text-xl">❤️</span>AdoptaMascotas
        </Link>
        {/*  Botones móviles (NO aparecerán en login/register) */}
        {!hideMenu && (
          <div className="flex items-center gap-2 lg:hidden ">
            <ThemeToggle />
            <button
              className="flex items-center px-2 py-1 border rounded text-orange-500 border-orange-500 text-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          </div>
        )}
        {/* Menú principal - Desktop + Mobile  */}
        {!hideMenu && (
          <div
            className={`flex-col lg:flex lg:flex-row lg:items-center gap-6 absolute lg:static top-16 left-0 w-full lg:w-auto bg-white/85 lg:bg-transparent dark:bg-gray-900/95 transition-all duration-300 ${
              isOpen ? "flex" : "hidden"
            }`}
          >
            {/* Si el usuario está logueado */}
            {isLoggedIn ? (
              <>
                <Link
                  className="hover:text-orange-500 px-4 py-2"
                  to="/lista-mascotas"
                  onClick={closeDropdown}
                >
                  Lista de Mascotas
                </Link>
                <Link
                  className="hover:text-orange-500 px-4 py-2"
                  to="/publicar-mascota"
                  onClick={closeDropdown}
                >
                  Publicar Mascota
                </Link>
                <Link
                  className="hover:text-orange-500 px-4 py-2"
                  to="/mis-publicaciones"
                  onClick={closeDropdown}
                >
                  Mis Publicaciones
                </Link>
                {/* Menu de configuración (engranaje) */}
                <div className="relative px-4">
                  <button
                    onClick={toggleDropdown}
                    className="p-2 rounded-full hover:bg-gray-100 bg-gray-300 dark:hover:bg-gray-700  transition cursor-pointer"
                  >
                    <img
                      src="../src/assets/material-symbols-light--subtitles-gear-outline-sharp.svg"
                      alt="Configuración"
                      className="w-8 h-8 object-contain"
                    />
                  </button>
                  {/* Dropdown de usuario */}
                  {isDropdownOpen && (
                    <div
                      className={`${
                        isOpen
                          ? "relative w-full mt-2"
                          : "lg:absolute lg:right-0 lg:mt-2 w-48  bg-white dark:bg-gray-800 shadow-lg rounded"
                      }bg-white dark:bg-gray-900 rounded-md z-50`}
                    >
                      {" "}
                      <span className=" px-4 py-2 text-gray-900 font-bold dark:text-gray-200 ">
                        Hola, {user?.nombre || "Usuario"}{" "}
                      </span>
                      <Link
                        to="/perfil"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        to="/seguridad"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Seguridad
                      </Link>
                      <Link
                        to="/contacto"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Contacto
                      </Link>
                      <Link
                        to="/politica-privacidad"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Privacidad
                      </Link>
                      <Link
                        to="/ayuda"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Ayuda
                      </Link>
                    </div>
                  )}
                </div>
                {/* Boton de admin solo si el usuario es admin*/}
                {isLoggedIn && user?.rol === "admin" && (
                  <button
                    onClick={() => {
                      closeDropdown();
                      navigate("/admin");
                    }}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition cursor-pointer"
                  >
                    Admin
                  </button>
                )}
                {/* Cerrar Sesión */}
                <button
                  onClick={() => {
                    closeDropdown();
                    handleLogout();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              /* Si NO está logueado */
              <>
                <Link
                  to="/login"
                  className="border border-orange-500 text-orange-500 hover:bg-orange-100 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-900/40 px-4 py-2 rounded-lg"
                  onClick={closeDropdown}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                  onClick={closeDropdown}
                >
                  Registrarse
                </Link>
              </>
            )}
            {/* Toggle siempre visible en desktop */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>
        )}
        {/*Toggle siempre visible en login/register */}
        {hideMenu && (
          <div className="md:block">
            <ThemeToggle />
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
