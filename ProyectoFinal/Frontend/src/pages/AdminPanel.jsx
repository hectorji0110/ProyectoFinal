import React, { useState } from "react";
import UsuariosTabla from "../components/admin/UsuariosTabla";
import MascotasTabla from "../components/admin/MascotasTabla";
import AdopcionesTabla from "../components/admin/AdopcionesTabla";
import MensajesTabla from "../components/admin/MensajesTabla";

const AdminPanel = () => {
  const [vista, setVista] = useState("usuarios");

  const renderVista = () => {
    switch (vista) {
      case "usuarios":
        return <UsuariosTabla />;
      case "mascotas":
        return <MascotasTabla />;
      case "adopciones":
        return <AdopcionesTabla />;
      case "mensajes":
        return <MensajesTabla />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 md:px-16 lg:px-24 py-8  pt-24 pb-12 bg-gradient-to-b from-orange-100 to-blue-100 dark:from-gray-600 dark:to-gray-800 transition-colors">
      
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <span>🟠</span> Panel Administrativo
      </h1>

      {/* Botones principales */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
        {["usuarios", "mascotas", "adopciones", "mensajes"].map((item) => (
          <button
            key={item}
            onClick={() => setVista(item)}
            className={`px-4 py-2 sm:px-6 sm:py-2 rounded-md text-white transition 
              ${
                vista === item
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {/* Contenedor de tablas */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-100  shadow-md p-4 sm:p-6 rounded-md transition-colors ">
        {renderVista()}
      </div>
    </div>
  );
};

export default AdminPanel;