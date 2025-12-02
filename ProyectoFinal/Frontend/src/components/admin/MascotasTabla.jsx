import React, { useEffect, useState } from "react";
import axios from "axios";

const MascotasTabla = () => {
  const [mascotas, setMascotas] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [verBorradas, setVerBorradas] = useState(false);

  // Modales
  const [modalEditar, setModalEditar] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);

  // Datos edición
  const [editMascota, setEditMascota] = useState(null);
  const [editData, setEditData] = useState({
    nombre: "",
    edad: "",
    tipo: "",
    raza: "",
    genero: "",
    tamano: "",
    ubicacion: "",
    descripcion: "",
    estado: "true",
    foto: null,
  });

  // Datos creación
  const [newData, setNewData] = useState({
    nombre: "",
    edad: "",
    tipo: "",
    raza: "",
    genero: "",
    tamano: "",
    ubicacion: "",
    descripcion: "",
    estado: "true",
    foto: null,
  });

  // Fetch mascotas
  const fetchMascotas = async (page = 1, incluirBorradas = false) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/mascotas?page=${page}&limit=${limit}${
          incluirBorradas ? "&borradas=true" : ""
        }`
      );
      setMascotas(res.data.docs || []);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.page);
    } catch (error) {
      console.log("Error cargando mascotas:", error);
    }
  };

  useEffect(() => {
    fetchMascotas(1, verBorradas);
  }, [verBorradas]);

  // Reset formularios
  const resetEditForm = () =>
    setEditData({
      nombre: "",
      edad: "",
      tipo: "",
      raza: "",
      genero: "",
      tamano: "",
      ubicacion: "",
      descripcion: "",
      estado: "true",
      foto: null,
    });

  const resetNewForm = () =>
    setNewData({
      nombre: "",
      edad: "",
      tipo: "",
      raza: "",
      genero: "",
      tamano: "",
      ubicacion: "",
      descripcion: "",
      estado: "true",
      foto: null,
    });

  // Abrir modal editar
  const openEditar = (m) => {
    setEditMascota(m);
    setEditData({
      nombre: m.nombre || "",
      edad: m.edad || "",
      tipo: m.tipo || "",
      raza: m.raza || "",
      genero: m.genero || "",
      tamano: m.tamano || "",
      ubicacion: m.ubicacion || "",
      descripcion: m.descripcion || "",
      estado: m.estado ? "true" : "false",
      foto: null,
    });
    setModalEditar(true);
  };

  // Guardar edición
  const guardarEdicion = async () => {
    try {
      const token = localStorage.getItem("token");

      let payload;
      if (editData.foto) {
        const formData = new FormData();
        for (let key in editData) {
          if (key === "foto") formData.append("foto", editData.foto);
          else if (key === "edad") formData.append("edad", Number(editData.edad));
          else if (key === "estado") formData.append("estado", editData.estado === "true");
          else formData.append(key, editData[key]);
        }
        payload = formData;
      } else {
        payload = {
          ...editData,
          edad: Number(editData.edad),
          estado: editData.estado === "true",
        };
      }

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/mascotas/${editMascota._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(editData.foto && { "Content-Type": "multipart/form-data" }),
          },
        }
      );

      setModalEditar(false);
      resetEditForm();
      fetchMascotas(currentPage, verBorradas);
    } catch (error) {
      console.log("Error al actualizar mascota:", error);
    }
  };

  // Crear mascota
  const crearMascota = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!newData.foto) {
        console.log("❌ Debes seleccionar una imagen");
        return;
      }

      const formData = new FormData();
      for (let key in newData) {
        if (key === "foto") formData.append("foto", newData.foto);
        else if (key === "edad") formData.append("edad", Number(newData.edad));
        else if (key === "estado") formData.append("estado", newData.estado === "true");
        else formData.append(key, newData[key]);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/mascotas`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setModalCrear(false);
      resetNewForm();
      fetchMascotas(1, verBorradas);
    } catch (error) {
      console.log("Error creando mascota:", error);
    }
  };

  // Eliminar mascota (soft delete)
  const eliminarMascota = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta mascota?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/mascotas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMascotas(currentPage, verBorradas);
    } catch (error) {
      console.log("Error eliminando mascota:", error);
    }
  };

  // Restaurar mascota
  const restaurarMascota = async (id) => {
    if (!confirm("¿Seguro que deseas restaurar esta mascota?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/mascotas/restore/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMascotas(currentPage, verBorradas);
    } catch (error) {
      console.log("Error restaurando mascota:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Mascotas Publicadas</h2>

      <div className="flex justify-between items-center mb-4 gap-4">
        <button
          onClick={() => setModalCrear(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded shadow"
        >
          + Crear Mascota
        </button>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={verBorradas}
            onChange={(e) => setVerBorradas(e.target.checked)}
          />
          Ver mascotas borradas
        </label>
      </div>

      {/* Tabla */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-max border">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Edad</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Raza</th>
              <th className="p-2 border">Genero</th>
              <th className="p-2 border">Tamaño</th>
              <th className="p-2 border">Foto</th>
              <th className="p-2 border">Ubicacion</th>
              <th className="p-2 border">Descripcion</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Borrado</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {mascotas.map((m) => (
              <tr key={m._id}>
                <td className="p-2 border">{m.nombre}</td>
                <td className="p-2 border">{m.edad}</td>
                <td className="p-2 border capitalize">{m.tipo}</td>
                <td className="p-2 border capitalize">{m.raza}</td>
                <td className="p-2 border capitalize">{m.genero}</td>
                <td className="p-2 border capitalize">{m.tamano}</td>
                <td className="p-2 border">
                  {m.foto ? (
                    <img
                      src={encodeURI(`${import.meta.env.VITE_API_URL}${m.foto}`)}
                      alt={m.nombre}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    <img
                      src="/placeholder.png"
                      alt="placeholder"
                      className="w-16 h-16 object-cover"
                    />
                  )}
                </td>
                <td className="p-2 border">{m.ubicacion}</td>
                <td className="p-2 border">{m.descripcion}</td>
                <td className="p-2 border capitalize">{m.estado ? "Activo" : "Inactivo"}</td>
                <td className="p-2 border text-center">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      m.borrado ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {m.borrado ? "Borrado" : "Activo"}
                  </span>
                </td>
                <td className="p-2 border">
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                      onClick={() => openEditar(m)}
                    >
                      Editar
                    </button>

                    {m.borrado ? (
                      <button
                        className="px-2 py-1 bg-green-600 text-white rounded"
                        onClick={() => restaurarMascota(m._id)}
                      >
                        Restaurar
                      </button>
                    ) : (
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => eliminarMascota(m._id)}
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
          onClick={() => fetchMascotas(currentPage - 1, verBorradas)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-60"
        >
          Anterior
        </button>
        <span className="px-3 py-1">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => fetchMascotas(currentPage + 1, verBorradas)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-60"
        >
          Siguiente
        </button>
      </div>

   {/* MODAL EDITAR */}
{modalEditar && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 pt-48 pb-4 overflow-y-auto">
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow w-full max-w-md space-y-3">
      <h3 className="text-lg font-bold mb-2">Editar mascota</h3>

      <input
        className="border p-2 w-full"
        placeholder="Nombre"
        value={editData.nombre}
        onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
      />
      <input
        className="border p-2 w-full"
        placeholder="Edad"
        value={editData.edad}
        onChange={(e) => setEditData({ ...editData, edad: e.target.value })}
      />
      <select
        className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={editData.tipo}
        onChange={(e) => setEditData({ ...editData, tipo: e.target.value })}
      >
        <option value="">Seleccionar tipo</option>
        <option value="perro">Perro</option>
        <option value="gato">Gato</option>
        <option value="otro">Otro</option>
      </select>

      <input
        className="border p-2 w-full"
        placeholder="Raza"
        value={editData.raza}
        onChange={(e) => setEditData({ ...editData, raza: e.target.value })}
      />
      <select
        className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={editData.genero}
        onChange={(e) => setEditData({ ...editData, genero: e.target.value })}
      >
        <option value="">Seleccionar genero</option>
        <option value="macho">Macho</option>
        <option value="hembra">Hembra</option>
        <option value="desconocido">Desconocido</option>
      </select>

      <select
        className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={editData.tamano}
        onChange={(e) => setEditData({ ...editData, tamano: e.target.value })}
      >
        <option value="">Seleccionar tamaño</option>
        <option value="pequeño">Pequeño</option>
        <option value="mediano">Mediano</option>
        <option value="grande">Grande</option>
      </select>

      <input
        className="border p-2 w-full"
        placeholder="Ubicación"
        value={editData.ubicacion}
        onChange={(e) => setEditData({ ...editData, ubicacion: e.target.value })}
      />
      <textarea
        className="border p-2 w-full"
        placeholder="Descripción"
        value={editData.descripcion}
        onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
      />
      <select
        className="border p-2 w-full mb-2"
        value={editData.estado}
        onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
      >
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </select>

      <input
        type="file"
        className="border p-2 w-full"
        onChange={(e) => setEditData({ ...editData, foto: e.target.files[0] })}
      />

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => { setModalEditar(false); resetEditForm(); }}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Cancelar
        </button>
        <button
          onClick={guardarEdicion}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}

{/* MODAL CREAR */}
{modalCrear && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 pt-48 pb-4 overflow-y-auto">
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow w-full max-w-md space-y-3">
      <h3 className="text-lg font-bold mb-2">Crear mascota</h3>

      <input
        className="border p-2 w-full"
        placeholder="Nombre"
        value={newData.nombre}
        onChange={(e) => setNewData({ ...newData, nombre: e.target.value })}
      />
      <input
        className="border p-2 w-full"
        placeholder="Edad"
        value={newData.edad}
        onChange={(e) => setNewData({ ...newData, edad: e.target.value })}
      />
      <select
        className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 "
        value={newData.tipo}
        onChange={(e) => setNewData({ ...newData, tipo: e.target.value })}
      >
        <option value="">Seleccionar Tipo</option>
        <option value="perro">Perro</option>
        <option value="gato">Gato</option>
        <option value="otro">Otro</option>
      </select>

      <input
        className="border p-2 w-full"
        placeholder="Raza"
        value={newData.raza}
        onChange={(e) => setNewData({ ...newData, raza: e.target.value })}
      />
      <select
        className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 "
        value={newData.genero}
        onChange={(e) => setNewData({ ...newData, genero: e.target.value })}
      >
        <option value="">Seleccionar Genero</option>
        <option value="macho">Macho</option>
        <option value="hembra">Hembra</option>
        <option value="desconocido">Desconocido</option>
      </select>

      <select
        className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 "
        value={newData.tamano}
        onChange={(e) => setNewData({ ...newData, tamano: e.target.value })}
      >
        <option value="">Seleccionar Tamaño</option>
        <option value="pequeño">Pequeño</option>
        <option value="mediano">Mediano</option>
        <option value="grande">Grande</option>
      </select>

      <input
        className="border p-2 w-full"
        placeholder="Ubicación"
        value={newData.ubicacion}
        onChange={(e) => setNewData({ ...newData, ubicacion: e.target.value })}
      />
      <textarea
        className="border p-2 w-full"
        placeholder="Descripción"
        value={newData.descripcion}
        onChange={(e) => setNewData({ ...newData, descripcion: e.target.value })}
      />
      <select
        className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 "
        value={newData.estado}
        onChange={(e) => setNewData({ ...newData, estado: e.target.value })}
      >
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </select>

      <input
        type="file"
        className="border p-2 w-full"
        onChange={(e) => setNewData({ ...newData, foto: e.target.files[0] })}
      />

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => { setModalCrear(false); resetNewForm(); }}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Cancelar
        </button>
        <button
          onClick={crearMascota}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Crear
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default MascotasTabla;