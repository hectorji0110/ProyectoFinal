import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";
/**
 * Componente CTA (Call To Action) para invitar a los usuarios
 * a publicar una mascota en adopción.
 *
 * - Muestra un título y una breve descripción.
 * - Incluye un botón que redirige a la ruta `/publicar-mascota`.
 *
 * @component
 * @returns {JSX.Element} Sección con el llamado a la acción.
 */
const PublishPetCTA = () => {
  // Hook de React Router para redireccionar al usuario
  const navigate = useNavigate();

  return (
    /**
     * Sección principal que contiene la llamada a la acción.
     */
    <section className="py-16 bg-gradient-to-r from-orange-300 to-blue-300 dark:from-orange-700 dark:to-blue-700 text-center">
      {/* Título principal*/}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        ¿Tienes una mascota para dar en adopción?
      </h2>
      {/* Descripción del propósito */}
      <p className="text-gray-700 dark:text-gray-200 mt-2 mb-6">
        Ayuda a encontrar un hogar amoroso para tu mascota. Publica su perfil de
        forma
        <br />
        gratuita y conecta con adoptantes responsables.
      </p>
      {/* Botón que redirige*/}
      <Button
        variant="outline"
        className="border-gray-300 dark:border-gray-600 cursor-pointer"
        onClick={() => navigate("/publicar-mascota")}
      >
        Publicar Mascota
      </Button>
    </section>
  );
};
export default PublishPetCTA;
