import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
/**
 * Pagina de Detalles de Mascota
 *
 * Este componente muestra la información completa de una mascota,
 * incluyendo su imagen, datos generales, descripción y contacto.
 * Obtiene la información desde el backend usando el ID proporcionado
 * por los parámetros de la URL.
 *
 */
const PetDetails = () => {
  /**
   * useParams obtiene el ID de la mascota.
   */
  const { id } = useParams();
  const navigate = useNavigate();
  /**
   * Estados del componente:
   * - pet: almacena los datos de la mascota obtenidos del backend.
   * - loading: controla la visualización del loader mientras se cargan los datos.
   */
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
    //Encargado de hacer la petición al backend para obtener la mascota por ID.
  useEffect(() => {
    const cargarMascota = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/mascotas/${id}`
        );
        setPet(res.data); // Guardar datos de la mascota en el estado
      } catch (error) {
        console.error("Error al cargar mascota:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarMascota();
  }, [id]);
   //Si aún está cargando, mostrar pantalla de carga.
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <Loader />
      </div>
    );
  }
   //Si no se encontró la mascota, mostrar mensaje al usuario.
  if (!pet) {
    return (
      <div className="pt-28 text-center text-white">
        <p>No se encontró esta mascota.</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen pt-28 pb-12 bg-gradient-to-b from-orange-100 to-blue-100 dark:from-gray-600 dark:to-gray-800 flex flex-col items-center px-4">
      {/* Título centrado */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Detalles de la mascota
      </h2>
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-5">
        {/* Imagen */}
        <div className="w-full overflow-hidden rounded-xl shadow-lg mb-5">
          <img
            src={
              pet.foto
                ? encodeURI(`${import.meta.env.VITE_API_URL}${pet.foto}`)
                : "/placeholder.png"
            }
            alt={pet.nombre}
            className="w-full h-96 object-cover"
          />
        </div>
        {/* Nombre y datos */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {pet.nombre}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">{pet.raza}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          Edad: {pet.edad} años
        </p>
        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="px-3 py-1 text-sm rounded-full bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100">
            {pet.tipo}
          </span>
          <span className="px-3 py-1 text-sm rounded-full bg-pink-200 dark:bg-pink-800 text-pink-900 dark:text-pink-100">
            {pet.genero}
          </span>
          <span className="px-3 py-1 text-sm rounded-full bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100">
            {pet.tamano}
          </span>
        </div>
        {/* Descripción */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
          Descripción
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-5">
          {pet.descripcion}
        </p>
        {/* Contacto */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
          Información de Contacto
        </h3>
        <div className="bg-gray-300 dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-gray-200 flex justify-between items-center">
          <span>{pet.telefono}</span>
          {/* Botón copiar */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(pet.telefono);
              toast.success("Número copiado 📋");
            }}
            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 rounded-lg text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
          >
            📋 Copiar
          </button>
        </div>
      </div>
    </div>
  );
};
export default PetDetails;
