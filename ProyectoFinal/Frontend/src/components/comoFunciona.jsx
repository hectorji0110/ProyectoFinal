/**
 * HowItWorks
 *
 * Componente informativo que explica el proceso de adopción
 * en tres pasos: buscar, conocer y adoptar.
 *
 * FUNCIONALIDAD:
 * - Muestra tres tarjetas, cada una representando un paso del proceso.
 * - Incluye iconos ilustrativos cargados desde la carpeta de assets.
 * - Utiliza un diseño responsivo basado en grid.
 *
 *
 * @component
 * @returns {JSX.Element} Sección explicativa del proceso de adopción en 3 pasos.
 */
const HowItWorks = () => {
  return (
    <section className="py-20 bg-blue-100 dark:bg-gray-800">
      <div className="container mx-auto px-6 text-center">
        {/* Título principal */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          ¿Cómo Funciona?
        </h2>
        {/* Subtítulo descriptivo */}
        <p className="text-gray-600 dark:text-gray-300 mt-2 mb-12">
          Adopta es simple y gratificante
        </p>
        {/* Grid principal con los 3 pasos */}
        <div className="grid md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-500 text-white text-3xl">
              <img
                src="/icons/search.svg"
                alt="Buscar"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold mt-4">Busca tu mascota</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Explora entre cientos de perros y gatos disponibles para adopción.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-500 text-white text-3xl">
              <img
                src="/icons/material-symbols-light--map-pin-heart-rounded.svg"
                alt="Buscar"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold mt-4">Conócela</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Contacta con el refugio y conoce a tu futura mascota en persona.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-500 text-white text-3xl">
              <img
                src="/icons/material-symbols-light--garage-home-rounded.svg"
                alt="Buscar"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold mt-4">Adopta</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Completa el proceso de adopción y lleva a tu nuevo amigo a casa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
