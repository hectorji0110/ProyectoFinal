/**
 * Pagina: PrivacyPolicy
 * Descripción:
 *   Este componente muestra la página Política de Privacidad de la plataforma de adopción de mascotas.
 *   Contiene información legal relacionada con el uso, protección y manejo de datos personales.
 *
 * Funcionalidad:
 *   - Muestra contenido estático organizado en secciones numeradas.
 *   - Incluye estilos en modo claro y oscuro usando clases "dark".
 *   - Presenta un encabezado con icono, título y fecha de última actualización.
 *   - Cada sección explica un aspecto específico de la política de privacidad.
 *
 */
const PrivacyPolicy = () => {
  return (
    <div className="pt-28 pb-12 bg-gradient-to-b from-white to-blue-100 dark:from-gray-600 dark:to-gray-900 min-h-screen flex flex-col items-center">
      {/* Título y fecha */}
      <div className="text-center mb-8 px-4 ">
        <div className="flex items-center justify-between">
          <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center">
            <img
              src="../src/assets/material-symbols-light--security.svg"
              alt="Buscar"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Política de Privacidad
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Última actualización: [18/11/2025]
        </p>
      </div>
      {/* Contenedor principal de la página */}
      <div className="max-w-4xl w-full mx-auto bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-700 rounded-xl p-8 sm:p-12 space-y-6">
        {/* Sección 1 (Información que Recopilamos) */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            1. Información que Recopilamos
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Recopilamos información que nos proporcionas directamente, como tu
            nombre, correo electrónico, número de teléfono y fotos de mascotas
            cuando creas una cuenta o publicas una mascota en adopción.
          </p>
        </section>
        {/* Sección 2 (Uso de la Información) */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            2. Uso de la Información
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">
            <li>Facilitar el proceso de adopción de mascotas</li>
            <li>Mejorar nuestros servicios</li>
            <li>Comunicarnos contigo sobre actualizaciones</li>
            <li>Proteger la seguridad de nuestra plataforma</li>
          </ul>
        </section>
        {/* Sección 3 (Compartir Información) */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            3. Compartir Información
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            No vendemos tu información personal. Solo compartimos información
            necesaria con otros usuarios para facilitar el proceso de adopción,
            como tu número de teléfono cuando publicas una mascota.
          </p>
        </section>
        {/* Sección 4 (Seguridad de los Datos) */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            4. Seguridad de los Datos
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Implementamos medidas de seguridad para proteger tu información
            personal contra acceso no autorizado, alteración o destrucción.
          </p>
        </section>
        {/* Sección 5 (Tus Derechos) */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            5. Tus Derechos
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">
            <li>Acceder a tu información personal</li>
            <li>Corregir información inexacta</li>
            <li>Solicitar la eliminación de tu cuenta</li>
            <li>Oponerte al procesamiento de tus datos</li>
          </ul>
        </section>
        {/* Sección 6 (Cookies) */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            6. Cookies
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Utilizamos cookies para mejorar tu experiencia en la plataforma.
            Puedes configurar tu navegador para rechazar cookies, aunque esto
            puede afectar algunas funcionalidades.
          </p>
        </section>
        {/* Sección 7 (Contacto) */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            7. Contacto
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Si tienes preguntas sobre esta política de privacidad, contáctanos a
            través de nuestra página de contacto o enviando un correo a
            <span className="text-orange-500 dark:text-orange-400 font-medium">
              {" "}
              contacto@adoptamascota.com
            </span>
            .
          </p>
        </section>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
