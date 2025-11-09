import { Button } from "./ui/Button";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* 🔸 Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl text-orange-500">❤️</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            AdoptaMascota
          </span>
        </div>

        {/* 🔸 Enlaces y botones */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 font-medium hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            Adoptar
          </a>
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 font-medium hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            Publicar Mascota
          </a>

          {/* 🔸 Usando tu componente Button */}
          <Button variant="outline">Iniciar Sesión</Button>
          <Button variant="outline">Registrarse</Button>

          {/* 🔸 Botón modo claro/oscuro */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;