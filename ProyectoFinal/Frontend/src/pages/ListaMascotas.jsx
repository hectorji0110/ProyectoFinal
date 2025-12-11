import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import SelectCustom from "../components/ui/SelectCustom";
import Skeleton from "../components/Skeleton";

/**
 * Pagina de ListaMascotas
 *
 * Este componente representa la página lista de mascotas del sitio.
 * Es una vista encargada de mostrar un catálogo paginado de mascotas
 * disponibles para adopción. Incluye:
 *
 *  - Sistema de paginación.
 *  - Filtros avanzados por tipo, tamaño y género.
 *  - Integración con backend mediante Axios.
 *  - Loader global durante solicitudes.
 *  - Skeleton para mostrar un loader mientras se cargan las mascotas.
 *  - Muestra un máximo de 6 mascotas por pantalla.
 *  - Integracion de SelectCustom para filtrar por tipo, tamano y genero
 *  - Navegación a la página de detalles de cada mascota.
 */
const ListaMascotas = () => {
  // Estados principales
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    tipo: "",
    tamano: "",
    genero: "",
  });
  const navigate = useNavigate();
  /** Función para obtener mascotas del backend
   *
   * @param {Object} query - Objeto con los parámetros de filtrado.
   *  -Arma los parámetros de búsqueda (filtros + página).
   *  -Realiza la consulta al backend.
   *  -Asigna resultados a los estados correspondientes.
   * @returns {Promise} - Promesa que resuelve con los datos de las mascotas.
   * @throws {Error} - Si ocurre un error al obtener las mascotas.
   *
   */
  const fetchPets = async (query = {}) => {
    try {
      query.page = page; // 👈 agregar página
      const params = new URLSearchParams(query).toString();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/mascotas?${params}`
      );
      // Forzar un retardo mínimo para que se vea el loader
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPets(res.data.docs);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log("Error obteniendo mascotas:", error);
    } finally {
      setLoading(false); // Detiene el loader
    }
  };
  //Actualizar la lista de mascotas al cambiar de página
  useEffect(() => {
    setLoadingPage(true); // activa skeleton

    fetchPets(filters).finally(() => {
      setLoadingPage(false); // desactiva skeleton
    });
  }, [page]);
  // Manejar cambios de filtros
  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };
  // Aplicar filtros
  const handleSearch = () => {
    setLoading(true);
    fetchPets(filters);
  };
  // Limpiar filtros
  const handleClear = () => {
    setFilters({ tipo: "", tamano: "", genero: "" });
    setLoading(true);
    fetchPets();
  };
  return (
    <section className="pt-26 pb-12 bg-gradient-to-b from-orange-100 to-blue-100 dark:from-gray-600 dark:to-gray-800">
      {/* Loader overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
          Todas las Mascotas
        </h2>
        {/* FILTROS */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <SelectCustom
            value={filters.tipo}
            onChange={(val) => handleFilterChange("tipo", val)}
            options={[
              { value: "", label: "Tipo" },
              { value: "perro", label: "Perro" },
              { value: "gato", label: "Gato" },
              { value: "otro", label: "Otro" },
            ]}
          />
          <SelectCustom
            value={filters.genero}
            placeholder="Genero"
            onChange={(val) => handleFilterChange("genero", val)}
            options={[
              { value: "", label: "Genero" },
              { value: "macho", label: "Macho" },
              { value: "hembra", label: "Hembra" },
              { value: "desconocido", label: "Desconocido" },
            ]}
          />
          <SelectCustom
            value={filters.tamano}
            onChange={(val) => handleFilterChange("tamano", val)}
            options={[
              { value: "", label: "Tamaño" },
              { value: "pequeño", label: "Pequeño" },
              { value: "mediano", label: "Mediano" },
              { value: "grande", label: "Grande" },
            ]}
          />
          <Button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
          >
            Buscar
          </Button>
          <Button
            onClick={handleClear}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 cursor-pointer"
          >
            Limpiar
          </Button>
        </div>
        {/* LISTA DE MASCOTAS */}
        <div className="grid md:grid-cols-3 gap-10">
          {loadingPage ? (
            <>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} />
              ))}
            </>
          ) : (
            pets.map((pet) => (
              <div
                key={pet._id}
                className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800"
              >
                {/* TU CARD NORMAL */}
                <img
                  src={
                    pet.foto
                      ? encodeURI(`${import.meta.env.VITE_API_URL}${pet.foto}`)
                      : "/placeholder.png"
                  }
                  alt={pet.nombre}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {pet.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {pet.edad} años
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    {pet.tipo}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                    {pet.genero}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                    {pet.tamano}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                    {pet.ubicacion}
                  </p>
                  <Button
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                    onClick={() => navigate(`/mascota/${pet._id}`)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center items-center gap-4 mt-10">
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded disabled:opacity-40 cursor-pointer"
          >
            ⬅️ Anterior
          </Button>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {page} de {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-40 cursor-pointer"
          >
            Siguiente ➡️
          </Button>
        </div>
      </div>
    </section>
  );
};
export default ListaMascotas;
