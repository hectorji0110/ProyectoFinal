import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SelectCustom from "../components/ui/SelectCustom";
import Skeleton from "../components/Skeleton";
/**
 * Componente: MisPublicaciones
 * ----------------------------
 * Este componente muestra y gestiona todas las mascotas
 * publicadas por el usuario autenticado.
 *
 * FUNCIONALIDADES PRINCIPALES:
 *  - Obtener las mascotas creadas por el usuario (paginadas).
 *  - Eliminar una mascota.
 *  - Marcar una mascota como NO disponible.
 *  - Mostrar tarjetas con el detalle de cada mascota.
 *  - Navegar a la vista de edición de mascotas.
 *  - Actualizar la información de una mascota.
 *  - Mostrar skeleton mientras se cargan las mascotas y en paginación.
 *  - Integracion de slectCustom para seleccionar tipo, tamano y genero al momento de editar
 *  - Navegar a la vista de detalle de cada mascota.
 */
const MisPublicaciones = () => {
  // Estado donde se guardan las mascotas publicadas por el usuario
  const [misMascotas, setMisMascotas] = useState([]);
  // Estado para el control de paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  // Estado para mostrar Skeleton loader
  const [loadingPage, setLoadingPage] = useState(true);

  // Modal editar
  const [modalEditar, setModalEditar] = useState(false);

  // Mascota seleccionada para editar
  const [editMascota, setEditMascota] = useState(null);

  // Datos de edición
  const [editData, setEditData] = useState({
    nombre: "",
    edad: "",
    tipo: "",
    raza: "",
    genero: "",
    tamano: "",
    ubicacion: "",
    descripcion: "",
    foto: null,
    telefono: "",
  });
  /**
   * useEffect()
   * -------------------------
   * Se ejecuta cada vez que cambia el número de página.
   * Encargado de solicitar al backend las mascotas publicadas por el usuario autenticado.
   */
  useEffect(() => {
    const fetchMisMascotas = async () => {
      try {
        setLoadingPage(true); // activar skeleton
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/mascotas/mis-publicaciones?page=${page}&limit=6`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("MIS PUBLICACIONES:", res.data);
        // Retardo de 300ms para que se note el skeleton
        await new Promise((resolve) => setTimeout(resolve, 300));
        // Guardar mascotas y total de páginas
        setMisMascotas(res.data.mascotas || res.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.log("Error obteniendo mis mascotas:", error);
      } finally {
        setLoadingPage(false); // desactiva skeleton
      }
    };
    fetchMisMascotas();
  }, [page]);
  /**
   * Eliminar mascota
   * Elimina una mascota según su ID.
   * Primero solicita confirmación al usuario.
   * Luego envía una petición DELETE al backend.
   * Finalmente actualiza la UI.
   *
   * @param {string} id - ID de la mascota a eliminar.
   */
  const eliminarMascota = async (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar esta publicación?");
    if (!confirmar) {
      toast("Eliminación cancelada", { icon: "❌" });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/mascotas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Actualizar lista sin la mascota eliminada
      setMisMascotas((prev) => prev.filter((pet) => pet._id !== id));
      toast.success("Publicación eliminada correctamente 🐾");
    } catch (error) {
      console.log("Error eliminando mascota:", error);
      toast.error("Error al eliminar la publicación");
    }
  };
  /**
   *Mascota no disponible
   * Marca una mascota como NO disponible.
   * Realiza un PATCH al backend actualizando su estado.
   *
   * @param {string} id - ID de la mascota a actualizar.
   */
  const marcarNoDisponible = async (id) => {
    const confirmar = confirm("¿Marcar esta mascota como NO DISPONIBLE?");
    if (!confirmar) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/mascotas/${id}`,
        { estado: "false" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Actualizar UI localmente
      setMisMascotas((prev) => prev.filter((pet) => pet._id !== id));
      toast.success("Mascota marcada como NO disponible 🐾");
    } catch (error) {
      console.log("Error cambiando estado:", error);
      toast.error("Error al actualizar estado");
    }
  };
  /**
   * Abrir modal de edición
   * -------------------------
   * Carga los datos de la mascota seleccionada en el formulario de edición.
   *
   * @param {Object} pet - Mascota seleccionada.
   */
  const openEditar = (pet) => {
    setEditMascota(pet);
    setEditData({
      nombre: pet.nombre || "",
      edad: pet.edad || "",
      tipo: pet.tipo || "",
      raza: pet.raza || "",
      genero: pet.genero || "",
      tamano: pet.tamano || "",
      ubicacion: pet.ubicacion || "",
      descripcion: pet.descripcion || "",
      telefono: pet.telefono || "",
      foto: null, // Se puede reemplazar si quieres mostrar la foto actual
    });
    setModalEditar(true);
  };
  /**
   * Reset formulario de edición
   */
  const resetEditForm = () => {
    setEditMascota(null);
    setEditData({
      nombre: "",
      edad: "",
      tipo: "",
      raza: "",
      genero: "",
      tamano: "",
      ubicacion: "",
      descripcion: "",
      telefono: "",
      foto: null,
    });
  };
  /**
   * Guardar edición de mascota
   *
   * Valida los datos del formulario, envía PATCH al backend y
   * actualiza la lista local con la respuesta.
   */
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
      //Prepara el payload
      let payload;
      if (editData.foto) {
        const formData = new FormData();
        for (let key in editData) {
          if (key === "foto") formData.append("foto", editData.foto);
          else if (key === "edad")
            formData.append("edad", Number(editData.edad));
          else formData.append(key, editData[key]);
        }
        payload = formData;
      } else {
        payload = {
          ...editData,
          edad: Number(editData.edad),
        };
      }
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/mascotas/${editMascota._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(editData.foto && { "Content-Type": "multipart/form-data" }),
          },
        }
      );
      // Actualizar lista local con la respuesta del backend
      setMisMascotas((prev) =>
        prev.map((pet) => (pet._id === editMascota._id ? res.data : pet))
      );
      toast.success("Mascota actualizada correctamente 🐾");
      setModalEditar(false);
      resetEditForm();
    } catch (error) {
      console.log("Error editando mascota:", error);
      toast.error("Error al actualizar mascota");
    }
  };
  return (
    <>
      {/* Sección principal */}
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
            {/* Botón para publicar una nueva mascota */}
            <Button
              onClick={() => navigate("/publicar-mascota")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
            >
              + Nueva Publicación
            </Button>
          </div>
          {/* Grid de mascotas */}
          <div className="grid md:grid-cols-3 gap-10">
            {loadingPage ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </>
            ) : misMascotas.length > 0 ? (
              misMascotas.map((pet) => (
                <div
                  key={pet._id}
                  className="rounded-xl shadow-lg bg-white dark:bg-gray-800 p-3"
                >
                  <div className="relative">
                    <img
                      src={
                        pet.foto
                          ? encodeURI(
                              `${import.meta.env.VITE_API_URL}${pet.foto}`
                            )
                          : "/placeholder.png"
                      }
                      alt={pet.nombre}
                      className="w-full h-72 object-cover rounded-lg "
                    />
                    {pet.estado !== false && (
                      <button
                        onClick={() => marcarNoDisponible(pet._id)}
                        className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-lg text-lg hover:bg-black cursor-pointer"
                      >
                        ❌ No disponible
                      </button>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {pet.nombre}
                    </h3>
                    <p className="text-lg text-gray-500 dark:text-gray-300">
                      {pet.edad} Años
                    </p>
                    <span className="inline-block text-lg bg-blue-500 text-white px-3 py-1 rounded-full mt-1">
                      {pet.tipo}
                    </span>
                    <p className="text-lg text-gray-500 dark:text-gray-300 mt-2">
                      {pet.ubicacion}
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <Button
                        onClick={() => navigate(`/mascota/${pet._id}`)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                      >
                        Ver Detalle
                      </Button>
                      <button
                        onClick={() => eliminarMascota(pet._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-lg cursor-pointer"
                      >
                        🗑
                      </button>
                      <button
                        onClick={() => openEditar(pet)}
                        className="bg-blue-200 hover:bg-blue-400 text-white px-4 py-2 text-lg rounded-lg"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-center col-span-3">
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
      {/* Modal editar */}
      {modalEditar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 py-4 z-50 min-h-screen">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow w-full max-w-md space-y-3">
            <h3 className="text-lg font-bold mb-2">Editar mascota</h3>
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
    </>
  );
};
export default MisPublicaciones;
