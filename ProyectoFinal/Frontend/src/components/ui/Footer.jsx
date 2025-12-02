import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t">
      
      {/* --- Sección principal --- */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* --- Logo + descripción --- */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl text-orange-500">❤️</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              AdoptaMascota
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Conectando mascotas con <br />
            hogares amorosos desde 2024.
          </p>
        </div>

        {/* --- Adoptar --- */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Adoptar
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
            <li><a href="/publicar-mascota" className="hover:text-orange-500">Como publicar</a></li>
            <li><a href="/lista-mascotas" className="hover:text-orange-500">Proceso de Adopción</a></li>
          </ul>
        </div>

        {/* --- Ayuda --- */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Ayuda
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
            <li><a href="/ayuda" className="hover:text-orange-500">Preguntas Frecuentes</a></li>
            <li><a href="/contacto" className="hover:text-orange-500">Contacto</a></li>
          </ul>
        </div>

        {/* --- Legal --- */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Legal
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
            <li><a href="/politica-privacidad" className="hover:text-orange-500">Privacidad</a></li>
            <li><a href="/seguridad" className="hover:text-orange-500">Seguridad</a></li>
          </ul>
        </div>

      </div>

      {/* --- Línea y copyright --- */}
      <div className="border-t py-6 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          © 2024 AdoptaMascota. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;