/**
 * Página: Ayuda / Preguntas Frecuentes (FAQ)
 *
 * Este componente muestra una sección informativa donde los usuarios pueden
 * encontrar respuestas a las preguntas más frecuentes dentro de la plataforma.
 *
 * @returns {JSX.Element} La sección de ayuda con preguntas frecuentes.
 */
const Ayuda = () => {
  return (
    <>
      {/* Contenedor principal de la página */}
      <div className="pt-28 pb-12 bg-gradient-to-b from-white to-blue-100 dark:from-gray-600 dark:to-gray-900 min-h-screen">
        <section className="max-w-4xl mx-auto px-4 py-12">
          {/* Encabezado */}
          <div className="text-left mb-10">
            <div className="flex items-center mb-4 gap-2">
              <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                <img
                  src="../src/assets/material-symbols-light--help-outline.svg"
                  alt="Seguridad"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mt-4">
                Centro de Ayuda
              </h1>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg">
              Encuentra respuestas a las preguntas más frecuentes
            </p>
          </div>
          {/* Título de la sección FAQ */}
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-left">
            Preguntas Frecuentes
          </h2>
          {/* Lista de preguntas y respuestas
           *
           * Se utiliza un arreglo estático con preguntas y respuestas
           * que se recorre con .map() para generar cada acordeón FAQ.
           * Cada elemento utiliza la etiqueta <details> para crear
           * un sistema de expandir/contraer accesible y nativo.
           * 
           */}
          <div className="space-y-4">
            {[
              {
                q: "¿Cómo puedo publicar una mascota en adopción?",
                a: "Para publicar una mascota, inicia sesión en tu cuenta, ve a la sección 'Publicar', completa el formulario con la información de la mascota y sube una foto. Incluye datos como tipo, raza, edad y ubicación.",
              },
              {
                q: "¿Puedo editar la información de mi perfil?",
                a: "Sí. Ve a 'Configuraciones' y luego a 'Mi Perfil', donde puedes editar tu información personal como nombre y apellido e incluso puedes colocar una foto de perfil.",
              },
              {
                q: "¿Cómo contacto a alguien que publicó una mascota?",
                a: "En la página de detalles verás el número de contacto del publicador. Puedes copiarlo con un click.",
              },
              {
                q: "¿Es gratuito usar la plataforma?",
                a: "Sí, la plataforma es totalmente gratuita tanto para publicar mascotas como para adoptar.",
              },
              {
                q: "¿Puedo eliminar mi publicación?",
                a: "Sí, desde 'Mis Publicaciones'. Una vez eliminada, no puede recuperarse.",
              },
              {
                q: "¿Cómo busco una mascota específica?",
                a: "Puedes usar la barra de búsqueda o los filtros por tipo de mascota, tamaño, edad y genero.",
              },
              {
                q: "¿Qué debo hacer antes de adoptar una mascota?",
                a: "Infórmate bien sobre la mascota, comunícate con el publicador, y asegúrate de tener los recursos para cuidarla.",
              },
              {
                q: "¿Cómo cambio mi contraseña?",
                a: "En la sección 'Seguridad' del menú de configuración puedes actualizar tu contraseña.",
              },
            ].map((item, i) => (
              /**
               * FAQ ITEM - Acordeón individual
               * Usa <details> para expandir y mostrar la respuesta.
               * group-open permite rotar el símbolo "+" cuando está abierto.
               */
              <details
                key={i}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <summary className="cursor-pointer p-5 flex justify-between items-center text-gray-900 dark:text-white font-medium select-none">
                  {item.q}
                  <span className="transition-transform duration-300 text-2xl text-gray-700 dark:text-gray-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-1 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
export default Ayuda;
