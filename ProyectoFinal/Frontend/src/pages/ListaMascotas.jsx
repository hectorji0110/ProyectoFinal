import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import Loader  from "../components/Loader";


const ListaMascotas = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    tipo: "",
    tamano: "",
    genero: "",
  });

  const navigate = useNavigate();

 // Obtener mascotas
  const fetchPets = async (query = {}) => {
  try {
    query.page = page; // 👈 agregar página
    const params = new URLSearchParams(query).toString();
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/mascotas?${params}`);
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

  useEffect(() => {
  fetchPets(filters);
}, [page]);

  // Manejar cambios de filtros
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
          <Loader/>
        </div>
            )}

      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
          Todas las Mascotas
        </h2>
      
        {/* FILTROS */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <select
            name="tipo"
            value={filters.tipo}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Tipo</option>
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="otro">Otro</option>
          </select>

          <select
            name="tamano"
            value={filters.tamano}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Tamaño</option>
            <option value="pequeño">Pequeño</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
          </select>

          <select
            name="genero"
            value={filters.genero}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Género</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
            <option value="desconocido">Desconocido</option>
          </select>

          <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600 text-white">
            Buscar
          </Button>
          <Button onClick={handleClear} className="bg-gray-300 hover:bg-gray-400 text-gray-800">
            Limpiar
          </Button>
        </div>

        {/* LISTA DE MASCOTAS */}
        <div className="grid md:grid-cols-3 gap-10">
        
          {pets.map((pet) => (
            <div key={pet._id} className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800">
              <img
                src={pet.foto ? encodeURI(`${import.meta.env.VITE_API_URL}${pet.foto}`) : "/placeholder.png"}
                alt={pet.nombre}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{pet.nombre}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">{pet.edad} años</p>
                <p className="text-sm text-orange-600 dark:text-orange-400">{pet.tipo}</p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">{pet.ubicacion}</p>

                <Button
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                  onClick={() => navigate(`/mascota/${pet._id}`)}
                >
                  Ver Detalles
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center gap-4 mt-10">
  
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded disabled:opacity-40"
          >
            ⬅️ Anterior
          </Button>

          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {page} de {totalPages}
          </span>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-40"
          >
            Siguiente ➡️
          </Button>

        </div>
      </div>
    </section>
  );
};

export default ListaMascotas;