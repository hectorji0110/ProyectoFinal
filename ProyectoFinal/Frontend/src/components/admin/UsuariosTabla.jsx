import React, { useEffect, useState } from "react";
import axios from "axios";

const UsuariosTabla = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  // Estados para modales
  const [modalEditar, setModalEditar] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);

  // Estados del usuario a editar
  const [editUser, setEditUser] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editApellido, setEditApellido] = useState("");
  const [editRol, setEditRol] = useState("");

  // Estados para crear usuario
  const [newNombre, setNewNombre] = useState("");
  const [newApellido, setNewApellido] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRol, setNewRol] = useState("usuario");

  const fetchUsuarios = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/users?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsuarios(res.data.docs);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.page);
    } catch (error) {
      console.log("Error cargando usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios(1);
  }, []);

  // ABRIR MODAL DE EDITAR
  const openEditar = (usuario) => {
    setEditUser(usuario);
    setEditNombre(usuario.nombre);
    setEditApellido(usuario.apellido);
    setEditRol(usuario.rol);
    setModalEditar(true);
  };

  // GUARDAR EDICIÓN
  const guardarEdicion = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/users/${editUser._id}`,
        {
          nombre: editNombre,
          apellido: editApellido,
          rol: editRol,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalEditar(false);
      fetchUsuarios(currentPage);
    } catch (error) {
      console.log("Error al actualizar usuario:", error);
    }
  };

  // ELIMINAR USUARIO
  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchUsuarios(currentPage);
    } catch (error) {
      console.log("Error eliminando usuario:", error);
    }
  };

  const restaurarUsuario = async (id) => {
  if (!confirm("¿Seguro que deseas restaurar este usuario?")) return;

  try {
    const token = localStorage.getItem("token");

    await axios.patch(
      `${import.meta.env.VITE_API_URL}/admin/users/restore/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchUsuarios(currentPage);
  } catch (error) {
    console.log("Error restaurando usuario:", error);
  }
};


  // CREAR USUARIO
  const crearUsuario = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/users`,
        {
          nombre: newNombre,
          apellido: newApellido,
          email: newEmail,
          contrasena: newPassword,
          rol: newRol,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalCrear(false);
      fetchUsuarios(1);
    } catch (error) {
      console.log("Error creando usuario:", error);
    }
  };

  return (
    <div >
      <h2 className="text-2xl font-semibold mb-4">Lista de Usuarios</h2>

      <div className="flex justify-end mb-4">
        {/* BOTÓN PARA CREAR */}
      <button
        onClick={() => setModalCrear(true)}
        className="mb-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded shadow"
      >
       + Crear Usuario
      </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-max border">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Borrado</th>
            <th className="p-2 border ">Rol</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u._id}>
              <td className="p-2 border">
                {u.nombre} {u.apellido}
              </td>

              <td className="p-2 border">{u.email}</td>

              <td className="p-2 border text-center">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    u.borrado ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {u.borrado ? "Borrado" : "Activo"}
                </span>
              </td>

              <td className="p-2 border">{u.rol}</td>

              <td className="p-2 border">
                <div className="flex gap-2 justify-start">
                  <button
                  onClick={() => openEditar(u)}
                  className="px-2 py-1 
                  
                   bg-blue-500 text-white rounded"
                >
                  Editar
                </button>

                {u.borrado ? (
                    <button
                      onClick={() => restaurarUsuario(u._id)}
                      className="px-2 py-1 
                      
                       bg-green-600 text-white rounded"
                    >
                      Restaurar
                    </button>
                  ) : (
                    <button
                      onClick={() => eliminarUsuario(u._id)}
                      className="px-2 py-1 
                      
                       bg-red-500 text-white rounded"
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
          onClick={() => fetchUsuarios(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-60"
        >
          Anterior
        </button>

        <span className="px-3 py-1">
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={() => fetchUsuarios(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* MODAL EDITAR */}
      {modalEditar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96 text-black dark:text-white">
            <h3 className="text-lg font-bold mb-4">Editar Usuario</h3>

            <input
              className="border p-2 w-full mb-2"
              value={editNombre}
              onChange={(e) => setEditNombre(e.target.value)}
              placeholder="Nombre"
            />

            <input
              className="border p-2 w-full mb-2"
              value={editApellido}
              onChange={(e) => setEditApellido(e.target.value)}
              placeholder="Apellido"
            />

            <select
              className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 "
              value={editRol}
              onChange={(e) => setEditRol(e.target.value)}
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 ">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96 text-black dark:text-white">
            <h3 className="text-lg font-bold mb-4">Crear Usuario</h3>

            <input
              className="border p-2 w-full mb-2 "
              placeholder="Nombre"
              onChange={(e) => setNewNombre(e.target.value)}
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Apellido"
              onChange={(e) => setNewApellido(e.target.value)}
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Email"
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Contraseña"
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
            />

            <select
              className="border p-2 w-full mb-2 bg-white dark:bg-gray-800 "
              onChange={(e) => setNewRol(e.target.value)}
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalCrear(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancelar
              </button>

              <button
                onClick={crearUsuario}
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

export default UsuariosTabla;