import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SelectCustom from "../ui/SelectCustom";
/**
 * MensajesTabla — Panel administrativo
 *
 * Componente que permite:
 * - Ver mensajes paginados (consultas, soporte, reportes)
 * - Editar mensajes
 * - Crear nuevos mensajes
 * - Eliminar y restaurar mensajes (Soft Delete)
 * - Filtrar por mensajes borrados
 * - Integración de SelectCustom para campos tipo y  estado de mensajes.
 * - Notificaciones mediante toast al crear, editar, eliminar, restaurar o validar mensaje.
 * - Integracion de openSelect para abrir y cerrar el select de usuarios al crear un nuevo mensaje
 *
 */
const MensajesTabla = () => {
  // Estados Principales
  const [mensajes, setMensajes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [verBorrados, setVerBorrados] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const [limit] = useState(6);
  // Estados Modales
  const [modalEditar, setModalEditar] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  // Estados del mensaje a editar
  const [editMensaje, setEditMensaje] = useState(null);
  const [editAsunto, setEditAsunto] = useState("");
  const [editContenido, setEditContenido] = useState("");
  const [editTipo, setEditTipo] = useState("");
  const [editEstado, setEditEstado] = useState("");
  // Estados para crear mensaje
  const [newUsuario, setNewUsuario] = useState("");
  const [newAsunto, setNewAsunto] = useState("");
  const [newContenido, setNewContenido] = useState("");
  const [newTipo, setNewTipo] = useState("consulta");
  const [newEstado, setNewEstado] = useState("abierto");
  const token = localStorage.getItem("token");
  // Obtiene todos los usuarios para usarlos en el select al crear mensajes.
  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/users/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsuarios(res.data);
    } catch (error) {
      toast.error("Error cargando usuarios");
      console.log("Error cargando usuarios:", error);
    }
  };
  // Obtener todos los mensajes paginados y filtrados
  /**
   * Obtiene mensajes paginados desde el backend.
   * @param {number} page - Página a cargar
   * @param {boolean} borrados - Si se deben incluir los eliminados
   */
  const fetchMensajes = async (page = 1, borrados = verBorrados) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/mensajes?page=${page}&limit=${limit}${
          borrados ? "&borradas=true" : ""
        }`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensajes(res.data.docs);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.page);
    } catch (error) {
      toast.error("Error cargando mensajes");
      console.log("Error cargando mensajes:", error);
    }
  };
  useEffect(() => {
    fetchUsuarios();
    fetchMensajes(1, verBorrados);
  }, [verBorrados]);
  // Eliminar mensaje
  /**
   * Marca un mensaje como borrado.
   * @param {string} id - ID del mensaje
   */
  const eliminarMensaje = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este mensaje?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/mensajes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Mensaje eliminado");
      fetchMensajes(currentPage, verBorrados);
    } catch (error) {
      toast.error("Error al eliminar el mensaje");
      console.log("Error eliminando mensaje:", error);
    }
  };
  // Restaurar mensaje
  const restaurarMensaje = async (id) => {
    if (!confirm("¿Seguro que deseas restaurar este mensaje?")) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/mensajes/restore/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Mensaje restaurado");
      fetchMensajes(currentPage, verBorrados);
    } catch (error) {
      toast.error("Error al restaurar el mensaje");
      console.log("Error restaurando mensaje:", error);
    }
  };
  // Abrir modal editar
  /**
   * Abre el modal y carga los datos en los inputs.
   * @param {object} m - Mensaje seleccionado
   */
  const openEditar = (m) => {
    setEditMensaje(m);
    setEditAsunto(m.asunto ?? "");
    setEditContenido(m.contenido ?? "");
    setEditTipo(m.tipo ?? "consulta");
    setEditEstado(m.estado ?? "abierto");
    setModalEditar(true);
  };
  // Guardar edición
  const guardarEdicion = async () => {
    if (!editAsunto.trim()) return toast.error("El asunto es obligatorio");
    if (!editContenido.trim())
      return toast.error("El contenido es obligatorio");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/mensajes/${editMensaje._id}`,
        {
          asunto: editAsunto,
          contenido: editContenido,
          tipo: editTipo,
          estado: editEstado,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Mensaje actualizado");
      setModalEditar(false);
      fetchMensajes(currentPage, verBorrados);
    } catch (error) {
      toast.error("Error actualizando mensaje");
      console.log("Error actualizando mensaje:", error);
    }
  };
  // Crear mensaje
  const crearMensaje = async () => {
    if (!newUsuario) return toast.error("Debe seleccionar un usuario");
    if (!newAsunto.trim()) return toast.error("El asunto es obligatorio");
    if (!newContenido.trim()) return toast.error("El contenido es obligatorio");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/mensajes`,
        {
          id_usuario: newUsuario,
          asunto: newAsunto,
          contenido: newContenido,
          tipo: newTipo,
          estado: newEstado,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Mensaje creado");
      setModalCrear(false);
      fetchMensajes(1);
      setNewUsuario("");
      setNewAsunto("");
      setNewContenido("");
      setNewTipo("consulta");
      setNewEstado("abierto");
    } catch (error) {
      toast.error("Error creando mensaje");
      console.log("Error creando mensaje:", error);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Mensajes</h2>
      {/* Boton crear mensaje */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <button
          onClick={() => setModalCrear(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded shadow cursor-pointer"
        >
          + Crear Mensaje
        </button>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={verBorrados}
            onChange={(e) => {
              setVerBorrados(e.target.checked);
            }}
          />
          Ver mensajes borrados
        </label>
      </div>
      {/* Tabla de mensajes */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-max border">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-2 border">Usuario</th>
              <th className="p-2 border">Asunto</th>
              <th className="p-2 border">Contenido</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Borrado</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mensajes.map((m) => (
              <tr key={m._id}>
                <td className="p-2 border">{m.id_usuario?.email}</td>
                <td className="p-2 border">{m.asunto}</td>
                <td className="p-2 border">{m.contenido}</td>
                <td className="p-2 border">{m.tipo}</td>
                <td className="p-2 border text-center">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      m.borrado ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {m.borrado ? "Borrado" : "Activo"}
                  </span>
                </td>
                <td className="p-2 border capitalize">{m.estado}</td>
                <td className="p-2 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditar(m)}
                      className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
                    >
                      Editar
                    </button>
                    {m.borrado ? (
                      <button
                        onClick={() => restaurarMensaje(m._id)}
                        className="px-2 py-1 bg-green-600 text-white rounded cursor-pointer"
                      >
                        Restaurar
                      </button>
                    ) : (
                      <button
                        onClick={() => eliminarMensaje(m._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
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
          onClick={() => fetchMensajes(currentPage - 1, verBorrados)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-60 cursor-pointer"
        >
          Anterior
        </button>
        <span className="px-3 py-1">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => fetchMensajes(currentPage + 1, verBorrados)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-60 cursor-pointer"
        >
          Siguiente
        </button>
      </div>
      {/* Modal Editar */}
      {modalEditar && editMensaje && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96 text-black dark:text-white">
            <h3 className="text-lg font-bold mb-4">Editar Mensaje</h3>
            <input
              className="border p-2 w-full mb-2"
              value={editAsunto}
              onChange={(e) => setEditAsunto(e.target.value)}
              placeholder="Asunto"
            />
            <textarea
              className="border p-2 w-full mb-2"
              value={editContenido ?? ""}
              onChange={(e) => setEditContenido(e.target.value)}
              placeholder="Contenido"
            />
            <SelectCustom
              label="Tipo"
              value={editTipo}
              onChange={setEditTipo}
              options={[
                { value: "consulta", label: "Consulta" },
                { value: "soporte", label: "Soporte" },
                { value: "reporte", label: "Reporte" },
              ]}
            />
            <SelectCustom
              label="Estado"
              value={editEstado}
              onChange={setEditEstado}
              options={[
                { value: "abierto", label: "Abierto" },
                { value: "en_proceso", label: "En proceso" },
                { value: "cerrado", label: "Cerrado" },
              ]}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalEditar(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicion}
                className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Crear */}
      {modalCrear && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-800  p-6 rounded shadow w-full max-w-md text-black dark:text-white">
            <h3 className="text-lg font-bold mb-4">Crear Mensaje</h3>
            {/* Select personalizado */}
            <div className="relative mb-2">
              <button
                onClick={() => setOpenSelect(!openSelect)}
                className="border p-2 w-full dark:bg-gray-800 text-left truncate cursor-pointer"
              >
                {newUsuario
                  ? usuarios.find((u) => u._id === newUsuario)?.nombre +
                    " (" +
                    usuarios.find((u) => u._id === newUsuario)?.email +
                    ")"
                  : "Seleccionar Usuario"}
              </button>
              {openSelect && (
                <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto bg-white dark:bg-gray-800 border rounded shadow">
                  {usuarios.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => {
                        setNewUsuario(u._id);
                        setOpenSelect(false);
                      }}
                      className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer truncate"
                    >
                      {u.nombre} ({u.email})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              className="border p-2 w-full mb-2"
              placeholder="Asunto"
              onChange={(e) => setNewAsunto(e.target.value)}
            />
            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Contenido del mensaje"
              value={newContenido}
              onChange={(e) => setNewContenido(e.target.value)}
              rows={4}
            />
            <SelectCustom
              label="Tipo"
              value={newTipo}
              onChange={setNewTipo}
              options={[
                { value: "consulta", label: "Consulta" },
                { value: "soporte", label: "Soporte" },
                { value: "reporte", label: "Reporte" },
              ]}
            />
            <SelectCustom
              label="Estado"
              value={newEstado}
              onChange={setNewEstado}
              options={[
                { value: "abierto", label: "Abierto" },
                { value: "en_proceso", label: "En proceso" },
                { value: "cerrado", label: "Cerrado" },
              ]}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalCrear(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={crearMensaje}
                className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
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
export default MensajesTabla;
