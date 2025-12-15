import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SelectCustom from "../ui/SelectCustom";
import { Eye, EyeOff } from "lucide-react";
/**
 * Componente: UsuariosTabla
 * @description
 * Tabla administrativa para gestionar usuarios del sistema.
 * Incluye:
 *  - Paginación
 *  - Crear usuario
 *  - Editar usuario
 *  - Eliminar y restaurar usuarios (soft-delete)
 *  - Validaciones para creación y edición de usuarios
 *  - Integración de SelectCustom para campos rol.
 *  - Notificaciones mediante toast al crear, editar, eliminar, restaurar o validar usuario.
 *
 * Se conecta al backend usando axios y requiere un token en localStorage.
 *
 */
const UsuariosTabla = () => {
  //Estados Principales
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
  const [showPassword, setShowPassword] = useState(false);
  const [newRol, setNewRol] = useState("usuario");
  //Obtener usuarioas paginados desde el backend
  const fetchUsuarios = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/admin/users?page=${page}&limit=${limit}`,
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
  //Abrir modal editar
  const openEditar = (usuario) => {
    setEditUser(usuario);
    setEditNombre(usuario.nombre);
    setEditApellido(usuario.apellido);
    setEditRol(usuario.rol);
    setModalEditar(true);
  };
  //Validaciones para editar
  const validarEdicion = () => {
    if (!editNombre.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return false;
    }
    if (!editApellido.trim()) {
      toast.error("El apellido no puede estar vacío.");
      return false;
    }
    return true;
  };
  // Guardar edición
  const guardarEdicion = async () => {
    if (!validarEdicion()) return;
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
  // Eliminar usuario
  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsuarios(currentPage);
    } catch (error) {
      console.log("Error eliminando usuario:", error);
    }
  };
  //Restaurar usuario
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
  //Validaciones para crear
  const validarCreacion = () => {
    if (!newNombre.trim()) {
      toast.error("Debes ingresar un nombre.");
      return false;
    }
    if (!newApellido.trim()) {
      toast.error("Debes ingresar un apellido.");
      return false;
    }
    if (!newEmail.trim()) {
      toast.error("El email es obligatorio.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
      toast.error("El email ingresado no es válido.");
      return false;
    }
    if (!newPassword.trim()) {
      toast.error("La contraseña es obligatoria.");
      return false;
    }
    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener mínimo 6 caracteres.");
      return false;
    }
    return true;
  };
  // Crear usuario
  const crearUsuario = async () => {
    if (!validarCreacion()) return;
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
      toast.success("Usuario creado correctamente.");
      setModalCrear(false);
      fetchUsuarios(1);
    } catch (error) {
      console.log("Error creando usuario:", error);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Lista de Usuarios</h2>
      <div className="flex justify-end mb-4">
        {/* Boton para crear usuario */}
        <button
          onClick={() => setModalCrear(true)}
          className="mb-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded shadow cursor-pointer"
        >
          + Crear Usuario
        </button>
      </div>
      {/* Tabla */}
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
                    bg-blue-500 text-white rounded cursor-pointer"
                    >
                      Editar
                    </button>
                    {u.borrado ? (
                      <button
                        onClick={() => restaurarUsuario(u._id)}
                        className="px-2 py-1 
                      
                        bg-green-600 text-white rounded cursor-pointer"
                      >
                        Restaurar
                      </button>
                    ) : (
                      <button
                        onClick={() => eliminarUsuario(u._id)}
                        className="px-2 py-1 
                      
                      bg-red-500 text-white rounded cursor-pointer"
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
          onClick={() => fetchUsuarios(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-60 cursor-pointer"
        >
          Anterior
        </button>
        <span className="px-3 py-1">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => fetchUsuarios(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
        >
          Siguiente
        </button>
      </div>
      {/* Modal editar */}
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
            <SelectCustom
              label="Rol"
              value={editRol}
              onChange={setEditRol}
              options={[
                { value: "usuario", label: "Usuario" },
                { value: "admin", label: "Admin" },
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
      {/* Modal crear */}
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
            <div className="relative mb-2">
              <input
                className="border p-2 w-full pr-10"
                placeholder="Contraseña"
                onChange={(e) => setNewPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <SelectCustom
              label="Rol"
              value={newRol}
              onChange={setNewRol}
              options={[
                { value: "usuario", label: "Usuario" },
                { value: "admin", label: "Admin" },
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
                onClick={crearUsuario}
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
export default UsuariosTabla;
