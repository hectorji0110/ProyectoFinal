import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



const MisPublicaciones = () => {
  const [misMascotas, setMisMascotas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMisMascotas = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/mascotas/mis-publicaciones?page=${page}&limit=6`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log("MIS PUBLICACIONES:", res.data);
        setMisMascotas(res.data.mascotas || res.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.log("Error obteniendo mis mascotas:", error);
      }
    };

    fetchMisMascotas();
  }, [ page ]);

  const eliminarMascota = async (id) => {
  const confirmar = confirm("¿Seguro que deseas eliminar esta publicación?");

  if (!confirmar) {
    toast("Eliminación cancelada", { icon: "❌" });
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/mascotas/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Eliminar de la interfaz
    setMisMascotas((prev) => prev.filter((pet) => pet._id !== id));

    toast.success("Publicación eliminada correctamente 🐾");
  } catch (error) {
    console.log("Error eliminando mascota:", error);
    toast.error("Error al eliminar la publicación");
  }
};
  return (
    <section className="relative pt-26 pb-12 bg-gradient-to-b from-white to-blue-100 dark:from-gray-800 dark:to-gray-900 min-h-screen">

      <div className="container mx-auto px-4 relative z-10 ">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Mis Publicaciones
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Gestiona tus mascotas en adopción
            </p>
          </div>

          <Button
            onClick={() => navigate("/publicar-mascota")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
          >
            + Nueva Publicación
          </Button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-10">
            {misMascotas.length > 0 ? (
            misMascotas.map((pet) => (
              <div
                key={pet._id}
                className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-3"
              >
                <img
                  src={
                    pet.foto
                      ? encodeURI(`${import.meta.env.VITE_API_URL}${pet.foto}`)
                      : "/placeholder.png"
                  }
                  alt={pet.nombre}
                  className="w-full h-72 object-cover rounded-lg"
                />

                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {pet.nombre}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {pet.edad} Años
                  </p>

                  <span className="inline-block text-xs bg-blue-500 text-white px-3 py-1 rounded-full mt-1">
                    {pet.tipo}
                  </span>

                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                    {pet.ubicacion}
                  </p>

                  {/* Botones */}
                  <div className="flex items-center gap-3 mt-4">

                    <Button
                      onClick={() => navigate(`/mascota/${pet._id}`)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Ver Detalle
                    </Button>

                    <button onClick={() => eliminarMascota(pet._id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-lg">
                      🗑
                    </button>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              No tienes mascotas publicadas aún.
            </p>
          )}
        </div>
                  {/* PAGINACIÓN */}
          <div className="flex justify-center gap-4 mt-10">
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-40"
            >
              ⬅️ Atrás
            </Button>

            <span className="text-gray-800 dark:text-white font-bold">
            {page} de {totalPages}
            </span>

            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-40"
            >
              Siguiente ➡️
            </Button>
          </div>
      </div>
    </section>
  );
};

export default MisPublicaciones;