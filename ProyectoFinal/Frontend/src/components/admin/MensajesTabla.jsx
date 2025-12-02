import React, { useEffect, useState } from "react";
import axios from "axios";


const MensajesTabla = () => {
  const [mensajes, setMensajes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);

  // Modales
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

   // Traer usuarios para el select
  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/users?page=1&limit=1000`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsuarios(res.data.docs || []);
    } catch (error) {
      console.log("Error cargando usuarios:", error);
    }
  };

  // Traer mensajes
  const fetchMensajes = async (page = 1) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/mensajes?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensajes(res.data.docs);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.page);
    } catch (error) {
      console.log("Error cargando mensajes:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchMensajes(1);
  }, []);

  // ELIMINAR mensaje
  const eliminarMensaje = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este mensaje?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/mensajes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMensajes(currentPage);
    } catch (error) {
      console.log("Error eliminando mensaje:", error);
    }
  };

  const restaurarMensaje = async (id) => {
    if (!confirm("¿Seguro que deseas restaurar este mensaje?")) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/mensajes/restore/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMensajes(currentPage);
    } catch (error) {
      console.log("Error restaurando mensaje:", error);
    }
  };

  // ABRIR MODAL EDITAR
  const openEditar = (m) => {
  setEditMensaje(m);
  setEditAsunto(m.asunto ?? "");
  setEditContenido(m.contenido ?? "");
  setEditTipo(m.tipo ?? "consulta");
  setEditEstado(m.estado ?? "abierto");
  setModalEditar(true);
};

  // GUARDAR EDICIÓN
  const guardarEdicion = async () => {
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
      setModalEditar(false);
      fetchMensajes(currentPage);
    } catch (error) {
      console.log("Error actualizando mensaje:", error);
    }
  };

  // CREAR mensaje
const crearMensaje = async () => {
  if (!newAsunto || !newContenido) {
    alert("Debe completar asunto y contenido");
    return;
  }

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
    setModalCrear(false);
    fetchMensajes(1);
    setNewUsuario("Seleccione un usuario");
    setNewAsunto("");
    setNewContenido("");
    setNewTipo("consulta");
    setNewEstado("abierto");
    
  } catch (error) {
    console.log("Error creando mensaje:", error);
  }
};

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Mensajes</h2>

      {/* BOTÓN CREAR */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModalCrear(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded shadow"
        >
          + Crear Mensaje
        </button>
      </div>

      {/* TABLA */}
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
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Editar
                    </button>
                    {m.borrado ? (
                      <button
                        onClick={() => restaurarMensaje(m._id)}
                        className="px-2 py-1 bg-green-600 text-white rounded"
                      >
                        Restaurar
                      </button>
                    ) : (
                      <button
                        onClick={() => eliminarMensaje(m._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
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

      {/* PAGINACIÓN */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => fetchMensajes(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-60"
        >
          Anterior
        </button>
        <span className="px-3 py-1">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => fetchMensajes(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* MODAL EDITAR */}
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
            
            <select
              className="border p-2 w-full mb-4 bg-white dark:bg-gray-800 "
              value={editTipo}
              onChange={(e) => setEditTipo(e.target.value)}
            >
              <option value="consulta">Consulta</option>
              <option value="soporte">Soporte</option>
              <option value="reporte">Reporte</option>
            </select>
            <select
              className="border p-2 w-full mb-4 bg-white dark:bg-gray-800 "
              value={editEstado}
              onChange={(e) => setEditEstado(e.target.value)}
            >
              <option value="abierto">Abierto</option>
              <option value="en_proceso">En proceso</option>
              <option value="cerrado">Cerrado</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalEditar(false)}
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-800  p-6 rounded shadow w-96 text-black dark:text-white">
            <h3 className="text-lg font-bold mb-4">Crear Mensaje</h3>

              <select
              className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 "
              value={newUsuario}
              onChange={(e) => setNewUsuario(e.target.value)}
            >
              <option value="">Seleccionar Usuario</option>
              {usuarios.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.nombre} {u.apellido} ({u.email})
                </option>
              ))}
            </select>
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
            <select
              className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 "
              placeholder="Tipo"
              onChange={(e) => setNewTipo(e.target.value)}
            >
              <option value="consulta">Consulta</option>
              <option value="soporte">Soporte</option>
              <option value="reporte">Reporte</option>
            </select>
            <select
              className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 "
              onChange={(e) => setNewEstado(e.target.value)}
            >
              <option value="abierto">Abierto</option>
              <option value="en_proceso">En proceso</option>
              <option value="cerrado">Cerrado</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalCrear(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancelar
              </button>
              <button
                onClick={crearMensaje}
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

export default MensajesTabla;