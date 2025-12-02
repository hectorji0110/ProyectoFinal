import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

const AdopcionesTabla = () => {
  const { token } = useContext(AuthContext);

  const [adopciones, setAdopciones] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  // Modales
  const [modalEditar, setModalEditar] = useState(false);
  const [adopcionActual, setAdopcionActual] = useState(null);


  // Traer adopciones
  const fetchAdopciones = async (page = 1) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/adopciones?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdopciones(res.data.docs || []);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.page);
    } catch (error) {
      console.log("Error cargando adopciones:", error);
    }
  };

  useEffect(() => {
    fetchAdopciones(1);
  }, []);

  // Eliminar adopción
  const eliminarAdopcion = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta adopción?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/adopciones/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAdopciones(currentPage);
    } catch (error) {
      console.log("Error eliminando adopción:", error);
    }
  };

  // Restaurar adopción
  const restaurarAdopcion = async (id) => {
    if (!confirm("¿Seguro que deseas restaurar esta adopción?")) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/adopciones/restore/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAdopciones(currentPage);
    } catch (error) {
      console.log("Error restaurando adopción:", error);
    }
  };

 
  // Abrir modal editar
  const abrirModalEditar = (adopcion) => {
    setAdopcionActual(adopcion);
    setModalEditar(true);
  };

  // Guardar cambios
  const guardarCambios = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/adopciones/${adopcionActual._id}`,
        {
          estado: adopcionActual.estado,
          mensaje: adopcionActual.mensaje,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalEditar(false);
      fetchAdopciones(currentPage);
    } catch (error) {
      console.log("Error actualizando adopción:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Solicitudes de Adopción</h2>

     

    <div className="w-full overflow-x-auto">
       {/* Tabla */}
      <table className="w-full border min-w-max">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-2 border">Usuario</th>
            <th className="p-2 border">Mascota</th>
            <th className="p-2 border">Mensaje</th>
            <th className="p-2 border">Borrado</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {adopciones.map((a) => (
            <tr key={a._id}>
              <td className="p-2 border">{a.id_usuario?.email}</td>
              <td className="p-2 border">{a.id_mascota?.nombre}</td>
              <td className="p-2 border">{a.mensaje || "Sin mensaje"}</td>

              <td className="p-2 border text-center">
                <span
                  className={`px-2 py-1 text-white rounded ${
                    a.borrado ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {a.borrado ? "Borrado" : "Activo"}
                </span>
              </td>

              <td className="p-2 border capitalize">{a.estado}</td>

              <td className="p-2 border">
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={() => abrirModalEditar(a)}
                  >
                    Editar
                  </button>
                  {a.borrado ? (
                    <button
                      onClick={() => restaurarAdopcion(a._id)}
                      className="px-2 py-1  bg-green-600 text-white rounded"
                    >
                      Restaurar
                    </button>
                  ) : (
                    <button
                      onClick={() => eliminarAdopcion(a._id)}
                      className="px-2 py-1  bg-red-500 text-white rounded"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>

     

      {/* Paginación */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => fetchAdopciones(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="px-3 py-1">
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={() => fetchAdopciones(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* MODAL EDITAR */}
      {modalEditar && adopcionActual && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96 text-black dark:text-white">
            <h3 className="text-lg font-bold mb-4">Editar Adopción</h3>

            <div className="mb-2">
              <label className="font-semibold">Usuario:</label>
              <p className="border p-2 rounded">
                {adopcionActual.id_usuario?.email}
              </p>
            </div>

            <div className="mb-2">
              <label className="font-semibold">Mascota:</label>
              <p className="border p-2 rounded">
                {adopcionActual.id_mascota?.nombre}
              </p>
            </div>

            <textarea
              className="border p-2 w-full mb-2 rounded"
              placeholder="Mensaje"
              value={adopcionActual.mensaje}
              onChange={(e) =>
                setAdopcionActual({
                  ...adopcionActual,
                  mensaje: e.target.value,
                })
              }
            />

            <select
              className="border p-2 w-full mb-4 rounded bg-white dark:bg-gray-800 "
              value={adopcionActual.estado}
              onChange={(e) =>
                setAdopcionActual({
                  ...adopcionActual,
                  estado: e.target.value,
                })
              }
            >
              <option value="pendiente">Pendiente</option>
              <option value="aceptada">Aceptada</option>
              <option value="rechazada">Rechazada</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalEditar(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancelar
              </button>

              <button
                onClick={guardarCambios}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdopcionesTabla;