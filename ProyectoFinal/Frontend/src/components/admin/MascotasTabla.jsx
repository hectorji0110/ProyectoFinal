import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SelectCustom from "../ui/SelectCustom";
/**
 * @component MascotasTabla
 * @description
 * Componente que muestra una tabla de mascotas, permite crear, editar, eliminar, restaurar y cambiar el estado de disponibilidad.
 * Integra paginación, filtros de mascotas borradas o inactivas y soporte de imágenes.
 *
 * Funcionalidad:
 * - Integración con modales de creación y edición de mascotas.
 * - Validaciones antes de crear o actualizar una mascota.
 * - Manejo de imágenes mediante input tipo file y FormData.
 * - Filtros de visualización: mostrar mascotas borradas y/o inactivas.
 * - Paginación de resultados obtenidos desde el backend.
 * - Integración de SelectCustom para campos tipo, genero, tamaño y estado.
 * - Notificaciones mediante toast al crear, editar, eliminar, restaurar o cambiar estado de mascota.
 *
 */
const MascotasTabla = () => {
  const [mascotas, setMascotas] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [verBorradas, setVerBorradas] = useState(false);
  const [verInactivas, setVerInactivas] = useState(false);
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
    email: "",
    telefono: "",
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
    email: "",
    telefono: "",
  });
  /**
   * Obtiene las mascotas desde el backend.
   * Soporta paginación y filtros de borradas e inactivas.
   * @param {number} page - Página a obtener
   * @param {boolean} incluirBorradas - Incluir mascotas borradas
   * @param {boolean} incluirInactivas - Incluir mascotas inactivas
   */
  const fetchMascotas = async (
    page = 1,
    incluirBorradas = false,
    incluirInactivas = false
  ) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/mascotas?page=${page}&limit=${limit}${
          incluirBorradas ? "&borradas=true" : ""
        }${incluirInactivas ? "&inactivas=true" : ""}`
      );
      setMascotas(res.data.docs || []);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.page);
    } catch (error) {
      console.log("Error cargando mascotas:", error);
    }
  };
  // Cargar mascotas al montar el componente o cambiar filtros
  useEffect(() => {
    fetchMascotas(1, verBorradas, verInactivas);
  }, [verBorradas, verInactivas]);
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
      telefono: "",
    });
  // Reset formularios de creación
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
      email: "",
      telefono: "",
    });
  /**
   * Abre el modal de edición y carga los datos de la mascota seleccionada
   * @param {Object} mascota - Objeto de la mascota a editar
   */
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
      telefono: m.telefono || "",
      estado: m.estado ? "true" : "false",
      foto: null,
      email: m.id_usuario?.email || "",
    });
    setModalEditar(true);
  };
  // Valida y guardar la edición de la mascota
  const guardarEdicion = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!editData.nombre) {
        toast.error("🐾 El nombre de la mascota no puede estar vacío");
        return;
      }
      if (!editData.edad) {
        toast.error("🐾 Ingresa la edad de la mascota");
        return;
      }
      if (!editData.raza) {
        toast.error("🐕 Selecciona la raza de la mascota");
        return;
      }
      if (!editData.genero) {
        toast.error("🐕 Selecciona el sexo de la mascota");
        return;
      }
      if (!editData.tamano) {
        toast.error("🐕 Selecciona el tamaño de la mascota");
        return;
      }
      if (!editData.tipo) {
        toast.error("🐕 Selecciona el tipo de mascota");
        return;
      }
      if (!editData.ubicacion) {
        toast.error("🐕 Ingresa la ubicación de la mascota");
        return;
      }
      if (!editData.descripcion) {
        toast.error("🐕 Ingresa la descripción de la mascota");
        return;
      }
      if (!editData.telefono) {
        toast.error("🐕 Ingresa el telefono de la mascota");
        return;
      }
      let payload;
      if (editData.foto) {
        const formData = new FormData();
        for (let key in editData) {
          if (key === "foto") formData.append("foto", editData.foto);
          else if (key === "edad")
            formData.append("edad", Number(editData.edad));
          else if (key === "estado")
            formData.append("estado", editData.estado === "true");
          else if (key === "email") formData.append("email", editData.email);
          else formData.append(key, editData[key]);
        }
        payload = formData;
      } else {
        payload = {
          ...editData,
          edad: Number(editData.edad),
          estado: editData.estado === "true",
        };
        delete payload.email;
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
      toast.success("Mascota actualizada correctamente");
      setModalEditar(false);
      resetEditForm();
      fetchMascotas(currentPage, verBorradas, verInactivas);
    } catch (error) {
      console.log("Error al actualizar mascota:", error);
    }
  };
  // Crear mascota
  const crearMascota = async () => {
    try {
      const token = localStorage.getItem("token");
      // Validaciones
      if (!newData.email || !/\S+@\S+\.\S+/.test(newData.email)) {
        toast.error("📧 Ingresa un correo válido");
        return;
      }
      if (!newData.nombre) {
        toast.error("🐾 Ingresa el nombre de la mascota");
        return;
      }
      if (!newData.edad) {
        toast.error("🐾 Ingresa la edad de la mascota");
        return;
      }
      if (!newData.tipo) {
        toast.error("🐕 Selecciona el tipo de mascota");
        return;
      }
      if (!newData.raza) {
        toast.error("🐕 Selecciona la raza de la mascota");
        return;
      }
      if (!newData.genero) {
        toast.error("🐕 Selecciona el sexo de la mascota");
        return;
      }
      if (!newData.tamano) {
        toast.error("🐕 Selecciona el tamaño de la mascota");
        return;
      }
      if (!newData.ubicacion) {
        toast.error("🐕 Ingresa la ubicación de la mascota");
        return;
      }
      if (!newData.descripcion) {
        toast.error("🐕 Ingresa la descripcion de la mascota");
        return;
      }
      if (!newData.foto) {
        toast.error("🖼️ Debes seleccionar una imagen");
        return;
      }
      if (!newData.telefono) {
        toast.error("📞 Ingresa un telefono valido");
        return;
      }
      const formData = new FormData();
      for (let key in newData) {
        if (key === "foto") formData.append("foto", newData.foto);
        else if (key === "edad") formData.append("edad", Number(newData.edad));
        else if (key === "estado")
          formData.append("estado", newData.estado === "true");
        else formData.append(key, newData[key]);
      }
      await axios.post(`${import.meta.env.VITE_API_URL}/mascotas`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Mascota creada correctamente.");
      setModalCrear(false);
      resetNewForm();
      fetchMascotas(1, verBorradas, verInactivas);
    } catch (error) {
      console.log("Error creando mascota:", error);
    }
  };
  // Eliminar mascota (soft delete)
  const eliminarMascota = async (id) => {
    if (!confirm("¿Seguro que deseas borrar esta mascota?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/mascotas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Mascota eliminada correctamente");
      fetchMascotas(currentPage, verBorradas, verInactivas);
    } catch (error) {
      console.log("Error eliminando mascota:", error);
      toast.error("Error al eliminar la mascota");
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
      toast.success("♻️ Mascota restaurada correctamente");
      fetchMascotas(currentPage, verBorradas, verInactivas);
    } catch (error) {
      console.log("Error restaurando mascota:", error);
      toast.error("Error al restaurar la mascota");
    }
  };
  const cambiarEstadoMascota = async (id, nuevoEstado) => {
    const mensaje = nuevoEstado ? "activar" : "inactivar";
    if (!confirm(`¿Seguro que deseas ${mensaje} esta mascota?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/mascotas/${id}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        `✅ Mascota ${nuevoEstado ? "activada" : "inactivada"} correctamente`
      );
      fetchMascotas(currentPage, verBorradas, verInactivas);
    } catch (error) {
      console.log("Error cambiando estado:", error);
      toast.error("Error al cambiar el estado de la mascota");
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Mascotas Publicadas</h2>
      <div className="flex justify-between items-center mb-4 gap-4">
        <button
          onClick={() => setModalCrear(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded shadow cursor-pointer"
        >
          + Crear Mascota
        </button>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={verBorradas}
            onChange={(e) => setVerBorradas(e.target.checked)}
          />
          Ver mascotas borradas
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={verInactivas}
            onChange={(e) => setVerInactivas(e.target.checked)}
          />
          Ver mascotas No Disponibles
        </label>
      </div>
      {/* Tabla */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto border">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-2 border">Usuario</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Edad</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Raza</th>
              <th className="p-2 border">Genero</th>
              <th className="p-2 border">Tamaño</th>
              <th className="p-2 border">Foto</th>
              <th className="p-2 border">Ubicacion</th>
              <th className="p-2 border">Descripcion</th>
              <th className="p-2 border">Telefono</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Borrado</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mascotas.map((m) => (
              <tr key={m._id}>
                <td className="p-2 border">{m.id_usuario?.email}</td>
                <td className="p-2 border">{m.nombre}</td>
                <td className="p-2 border">{m.edad}</td>
                <td className="p-2 border capitalize">{m.tipo}</td>
                <td className="p-2 border capitalize">{m.raza}</td>
                <td className="p-2 border capitalize">{m.genero}</td>
                <td className="p-2 border capitalize">{m.tamano}</td>
                <td className="p-2 border">
                  {m.foto ? (
                    <img
                      src={encodeURI(
                        `${import.meta.env.VITE_API_URL}${m.foto}`
                      )}
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
                <td className="p-2 border break-words max-w-xs whitespace-normal">{m.descripcion}</td>
                <td className="p-2 border">{m.telefono || "No disponible"}</td>
                <td className="p-2 border capitalize">
                  {m.estado ? "Disponible" : "No disponible"}
                </td>
                <td className="p-2 border text-center">
                  <span
                    className={`${
                      m.borrado
                        ? "text-red-600 font-bold "
                        : "text-green-700 font-bold "
                    }`}
                  >
                    {m.borrado ? "Borrado" : "Activo"}
                  </span>
                </td>
                <td className="p-2 border">
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
                      onClick={() => openEditar(m)}
                    >
                      Editar
                    </button>
                    {m.borrado ? (
                      <button
                        className="px-2 py-1 bg-green-600 text-white rounded cursor-pointer"
                        onClick={() => restaurarMascota(m._id)}
                      >
                        Restaurar
                      </button>
                    ) : (
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
                        onClick={() => eliminarMascota(m._id)}
                      >
                        Borrar
                      </button>
                    )}
                    {m.estado === false ? (
                      <button
                        className="px-2 py-1 bg-green-600 text-white rounded cursor-pointer"
                        onClick={() => cambiarEstadoMascota(m._id, true)}
                      >
                        Disponible
                      </button>
                    ) : (
                      <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer"
                        onClick={() => cambiarEstadoMascota(m._id, false)}
                      >
                        No 
                        <br />
                        Disponible
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
          onClick={() =>
            fetchMascotas(currentPage - 1, verBorradas, verInactivas)
          }
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-60 cursor-pointer"
        >
          Anterior
        </button>
        <span className="px-3 py-1">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() =>
            fetchMascotas(currentPage + 1, verBorradas, verInactivas)
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-60 cursor-pointer"
        >
          Siguiente
        </button>
      </div>
      {/* Modal editar */}
      {modalEditar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 pt-56 pb-2 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow w-full max-w-md space-y-3">
            <h3 className="text-lg font-bold mb-2">Editar mascota</h3>
            <input
              className="border p-2 w-full"
              placeholder="Email"
              value={editData.email || editData.id_usuario?.email}
              readOnly
            />
            <input
              className="border p-2 w-full"
              placeholder="Nombre"
              value={editData.nombre}
              onChange={(e) =>
                setEditData({ ...editData, nombre: e.target.value })
              }
            />
            <input
              className="border p-2 w-full"
              placeholder="Edad"
              value={editData.edad}
              onChange={(e) =>
                setEditData({ ...editData, edad: e.target.value })
              }
            />
            <SelectCustom
              value={editData.tipo}
              onChange={(newValue) =>
                setEditData({ ...editData, tipo: newValue })
              }
              options={[
                { value: "perro", label: "Perro" },
                { value: "gato", label: "Gato" },
                { value: "otro", label: "Otro" },
              ]}
            />
            <input
              className="border p-2 w-full"
              placeholder="Raza"
              value={editData.raza}
              onChange={(e) =>
                setEditData({ ...editData, raza: e.target.value })
              }
            />
            <SelectCustom
              value={editData.genero}
              onChange={(newValue) =>
                setEditData({ ...editData, genero: newValue })
              }
              options={[
                { value: "macho", label: "Macho" },
                { value: "hembra", label: "Hembra" },
                { value: "desconocido", label: "Desconocido" },
              ]}
            />
            <SelectCustom
              value={editData.tamano}
              onChange={(newValue) =>
                setEditData({ ...editData, tamano: newValue })
              }
              options={[
                { value: "pequeño", label: "Pequeño" },
                { value: "mediano", label: "Mediano" },
                { value: "grande", label: "Grande" },
              ]}
            />
            <input
              className="border p-2 w-full"
              placeholder="Ubicación"
              value={editData.ubicacion}
              onChange={(e) =>
                setEditData({ ...editData, ubicacion: e.target.value })
              }
            />
            <textarea
              className="border p-2 w-full"
              placeholder="Descripción"
              value={editData.descripcion}
              onChange={(e) =>
                setEditData({ ...editData, descripcion: e.target.value })
              }
            />
            <input
              className="border p-2 w-full"
              placeholder="Teléfono de contacto"
              value={editData.telefono}
              onChange={(e) =>
                setEditData({ ...editData, telefono: e.target.value })
              }
            />
            <SelectCustom
              value={editData.estado}
              onChange={(newValue) =>
                setEditData({ ...editData, estado: newValue })
              }
              options={[
                { value: "true", label: "Disponible" },
                { value: "false", label: "No disponible" },
              ]}
            />
            <input
              type="file"
              className="border p-2 w-full"
              onChange={(e) =>
                setEditData({ ...editData, foto: e.target.files[0] })
              }
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => {
                  setModalEditar(false);
                  resetEditForm();
                }}
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
      {/* Modal crear */}
      {modalCrear && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 pt-56 pb-2 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow w-full max-w-md space-y-3">
            <h3 className="text-lg font-bold mb-2">Crear mascota</h3>
            <input
              className="border p-2 w-full"
              placeholder="Correo del usuario"
              value={newData.email}
              onChange={(e) =>
                setNewData({ ...newData, email: e.target.value })
              }
            />
            <input
              className="border p-2 w-full"
              placeholder="Nombre"
              value={newData.nombre}
              onChange={(e) =>
                setNewData({ ...newData, nombre: e.target.value })
              }
            />
            <input
              className="border p-2 w-full"
              placeholder="Edad"
              value={newData.edad}
              onChange={(e) => setNewData({ ...newData, edad: e.target.value })}
            />
            <SelectCustom
              value={newData.tipo}
              onChange={(newValue) =>
                setNewData({ ...newData, tipo: newValue })
              }
              options={[
                { value: "", label: "Seleccionar tipo..." },
                { value: "perro", label: "Perro" },
                { value: "gato", label: "Gato" },
                { value: "otro", label: "Otro" },
              ]}
            />
            <input
              className="border p-2 w-full"
              placeholder="Raza"
              value={newData.raza}
              onChange={(e) => setNewData({ ...newData, raza: e.target.value })}
            />
            <SelectCustom
              value={newData.genero}
              onChange={(newValue) =>
                setNewData({ ...newData, genero: newValue })
              }
              options={[
                { value: "", label: "Seleccionar genero..." },
                { value: "macho", label: "Macho" },
                { value: "hembra", label: "Hembra" },
                { value: "desconocido", label: "Desconocido" },
              ]}
            />
            <SelectCustom
              value={newData.tamano}
              onChange={(newValue) =>
                setNewData({ ...newData, tamano: newValue })
              }
              options={[
                { value: "", label: "Seleccionar tamano..." },
                { value: "pequeño", label: "Pequeño" },
                { value: "mediano", label: "Mediano" },
                { value: "grande", label: "Grande" },
              ]}
            />
            <input
              className="border p-2 w-full"
              placeholder="Ubicación"
              value={newData.ubicacion}
              onChange={(e) =>
                setNewData({ ...newData, ubicacion: e.target.value })
              }
            />
            <textarea
              className="border p-2 w-full"
              placeholder="Descripción"
              value={newData.descripcion}
              onChange={(e) =>
                setNewData({ ...newData, descripcion: e.target.value })
              }
            />
            <input
              className="border p-2 w-full"
              placeholder="Teléfono de contacto"
              value={newData.telefono}
              onChange={(e) =>
                setNewData({ ...newData, telefono: e.target.value })
              }
            />
            <SelectCustom
              value={newData.estado}
              onChange={(newValue) =>
                setNewData({ ...newData, estado: newValue })
              }
              options={[
                { value: "true", label: "Disponible" },
                { value: "false", label: "No disponible" },
              ]}
            />
            <input
              type="file"
              className="border p-2 w-full"
              onChange={(e) =>
                setNewData({ ...newData, foto: e.target.files[0] })
              }
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => {
                  setModalCrear(false);
                  resetNewForm();
                }}
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
