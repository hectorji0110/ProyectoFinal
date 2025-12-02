import React from "react";

const Ayuda = () => {
  return (
    <>
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

    {/* Título */}
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-left">
      Preguntas Frecuentes
    </h2>

    {/* LISTA FAQ */}
    <div className="space-y-4">
      {[
        {
          q: "¿Cómo puedo publicar una mascota en adopción?",
          a: "Para publicar una mascota, inicia sesión en tu cuenta, ve a la sección 'Publicar', completa el formulario con la información de la mascota y sube una foto. Incluye datos como tipo, raza, edad y ubicación."
        },
        {
          q: "¿Puedo editar la información de una mascota que ya publiqué?",
          a: "Sí. Ve a 'Mis Publicaciones', selecciona la mascota que deseas editar y actualiza la información."
        },
        {
          q: "¿Cómo contacto a alguien que publicó una mascota?",
          a: "En la página de detalles verás el número de contacto del publicador. Puedes copiarlo con un clic."
        },
        {
          q: "¿Es gratuito usar la plataforma?",
          a: "Sí, la plataforma es totalmente gratuita tanto para publicar mascotas como para adoptar."
        },
        {
          q: "¿Puedo eliminar mi publicación?",
          a: "Sí, desde 'Mis Publicaciones'. Una vez eliminada, no puede recuperarse."
        },
        {
          q: "¿Cómo busco una mascota específica?",
          a: "Puedes usar la barra de búsqueda o los filtros por tipo de mascota, ubicación o características."
        },
        {
          q: "¿Qué debo hacer antes de adoptar una mascota?",
          a: "Infórmate bien sobre la mascota, comunícate con el publicador, y asegúrate de tener los recursos para cuidarla."
        },
        {
          q: "¿Cómo cambio mi contraseña?",
          a: "En la sección 'Seguridad' del menú de configuración puedes actualizar tu contraseña."
        }
      ].map((item, i) => (
        <details
          key={i}
          className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all"
        >
          <summary
            className="cursor-pointer p-5 flex justify-between items-center text-gray-900 dark:text-white font-medium select-none"
          >
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

  <section className="max-w-4xl mx-auto px-4 py-12">

        {/* Encabezado */}
        <div className="text-center mb-10">
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
              <img
                src="../src/assets/material-symbols-light--security.svg"
                alt="Seguridad"
                className="w-14 h-14 object-contain"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mt-4">
              Centro de Ayuda
            </h1>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Encuentra respuestas a las preguntas más frecuentes
          </p>
        </div>

        {/* Buscador */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Buscar en preguntas frecuentes…"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700  bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 
            shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        {/* Título de sección */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Preguntas Frecuentes
        </h2>

        {/* LISTA DE FAQ */}
        <div className="space-y-4">

          {/* --- Plantilla para cada FAQ --- */}
          {[
            {
              q: "¿Cómo puedo publicar una mascota en adopción?",
              a: "Para publicar una mascota, inicia sesión en tu cuenta, ve a la sección 'Publicar', completa el formulario con la información de la mascota y sube una foto. Incluye datos como tipo, raza, edad y ubicación."
            },
            {
              q: "¿Puedo editar la información de una mascota que ya publiqué?",
              a: "Sí. Ve a 'Mis Publicaciones', selecciona la mascota que deseas editar y actualiza la información."
            },
            {
              q: "¿Cómo contacto a alguien que publicó una mascota?",
              a: "En la página de detalles verás el número de contacto del publicador. Puedes copiarlo con un clic."
            },
            {
              q: "¿Es gratuito usar la plataforma?",
              a: "Sí, la plataforma es totalmente gratuita tanto para publicar mascotas como para adoptar."
            },
            {
              q: "¿Puedo eliminar mi publicación?",
              a: "Sí, desde 'Mis Publicaciones'. Una vez eliminada, no puede recuperarse."
            },
            {
              q: "¿Cómo busco una mascota específica?",
              a: "Puedes usar la barra de búsqueda o los filtros por tipo de mascota, ubicación o características."
            },
            {
              q: "¿Qué debo hacer antes de adoptar una mascota?",
              a: "Infórmate bien sobre la mascota, comunícate con el publicador, y asegúrate de tener los recursos para cuidarla."
            },
            {
              q: "¿Cómo cambio mi contraseña?",
              a: "En la sección 'Seguridad' del menú de configuración puedes actualizar tu contraseña."
            }
          ].map((item, i) => (
            <details
              key={i}
              className="group bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <summary
                className="cursor-pointer p-5 flex justify-between items-center text-gray-900 dark:text-gray-200 font-medium select-none"
              >
                {item.q}
                <span className="transition-transform duration-300 text-2xl text-gray-600 dark:text-gray-300 group-open:rotate-45">
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