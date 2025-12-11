import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";
import puppy from "../assets/golden.png"; // Imagen principal del hero
/**
 * Hero
 *
 * Componente principal de portada para la página de inicio.
 *
 * FUNCIONALIDAD:
 * - Muestra un título destacado invitando a adoptar mascotas.
 * - Contiene una breve descripción motivacional.
 * - Incluye dos botones con navegación programática:
 *    - "Ver Mascotas": Redirige al listado de mascotas.
 *    - "Publicar Mascota": Redirige al formulario para publicar una mascota.
 * - Muestra una imagen decorativa de un perrito.
 *
 *
 * @component
 * @returns {JSX.Element} Sección hero del sitio con botones y una imagen ilustrativa.
 */
const Hero = () => {
  // Hook de navegación de React Router para redirigir a distintas páginas
  const navigate = useNavigate();
  return (
    <section className="pt-26 pb-12 w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-100 to-blue-100 dark:from-gray-600 dark:to-gray-800">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* Texto principal */}
        <div className="text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Encuentra a tu
            <span className="block text-orange-500 dark:text-orange-500">
              nuevo mejor amigo
            </span>
          </h1>
          {/* Descripción motivacional */}
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-md">
            Miles de mascotas esperan un hogar lleno de amor. Adopta, no
            compres, y cambia una vida para siempre.
          </p>
          {/* Botones de acción (Ver Mascotas y Publicar Mascota) */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => navigate("/lista-mascotas")}
            >
              Ver Mascotas
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600"
              onClick={() => navigate("/publicar-mascota")}
            >
              Publicar Mascota
            </Button>
          </div>
        </div>
        {/* Imagen decorativa */}
        <div className="flex justify-center md:justify-end">
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900">
            <img
              src={puppy}
              alt="Perrito feliz"
              className="w-[400px] h-[300px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
