import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../components/AuthContext";
/**
 * Pagina de Perfil
 * Funcionalidad:
 * - Obtiene datos del perfil del usuario autenticado.
 * - Permite actualizar nombre, apellido y foto de perfil.
 * - Previsualiza la imagen antes de enviarla.
 * - Realiza validaciones front-end para evitar errores.
 * - Envía datos mediante FormData() al backend vía PATCH.
 *
 */
const Perfil = () => {
  const { token } = useContext(AuthContext);
  const [perfil, setPerfil] = useState(null);
  const [foto, setFoto] = useState(null);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cambios, setCambios] = useState(false);
  // Obtener perfil del usuario
  useEffect(() => {
    if (!token) return;
    const fetchPerfil = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPerfil(res.data.usuario);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPerfil();
  }, [token]);
  // Actualizar inputs una vez cargado el perfil
  useEffect(() => {
    if (perfil) {
      setNombre(perfil.nombre);
      setApellido(perfil.apellido);
    }
  }, [perfil]);
  // Validaciones
  const validarCampos = () => {
    // Validación nombre
    if (!nombre || nombre.trim().length < 2) {
      toast.error("El nombre debe tener al menos 2 caracteres.");
      return false;
    }
    if (/[0-9]/.test(nombre)) {
      toast.error("El nombre no puede contener números.");
      return false;
    }
    // Validación apellido
    if (!apellido || apellido.trim().length < 2) {
      toast.error("El apellido debe tener al menos 2 caracteres.");
      return false;
    }
    if (/[0-9]/.test(apellido)) {
      toast.error("El apellido no puede contener números.");
      return false;
    }
    return true;
  };
  const handleActualizar = async () => {
    if (!cambios) return toast.error("No has realizado cambios.");
    if (!validarCampos()) return;
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("apellido", apellido);
      if (foto) {
        formData.append("fotoPerfil", foto); //  mismo nombre que multer.single(...)
      }
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/auth/perfil`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(res.data.usuario.foto_perfil); utilizado para probar si funciona la foto
      // actualizar el perfil en el estado con lo que responde el backend
      setPerfil(res.data.usuario);
      toast.success("Perfil actualizado correctamente");
      setCambios(false);
      setFoto(null);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el perfil");
    }
  };
  if (!perfil)
    return <div className="flex justify-center p-10">Cargando...</div>;
  return (
    <div className="min-h-screen pt-26 pb-12 flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-100 dark:from-gray-600 dark:to-gray-900 p-6">
      {/* Foto de Perfil */}
      <div className="w-28 h-28 rounded-full border shadow flex items-center justify-center mb-4 bg-white dark:bg-gray-700 overflow-hidden">
        <img
          src={
            foto
              ? URL.createObjectURL(foto) // preview local
              : perfil.foto_perfil && perfil.foto_perfil.length > 0
              ? `${import.meta.env.VITE_API_URL}${perfil.foto_perfil[0]}`
              : "https://cdn-icons-png.flaticon.com/512/456/456212.png"
          }
          alt="perfil"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Mi Perfil
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Gestiona tu información personal
      </p>
      {/* Formulario */}
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-4">
        {/* Subir foto */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Foto de perfil
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFoto(e.target.files[0]);
              setCambios(true);
            }}
            className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-200 cursor-pointer"
          />
        </div>
        {/* Email */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            type="text"
            value={perfil.email}
            disabled
            className="w-full mt-1 p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        {/* Nombre */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setCambios(true);
            }}
            className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        {/* Apellido */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Apellido
          </label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => {
              setApellido(e.target.value);
              setCambios(true);
            }}
            className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        {/* Botón actualizar */}
        {cambios && (
          <button
            onClick={handleActualizar}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg mt-4 transition"
          >
            Actualizar Información
          </button>
        )}
      </div>
    </div>
  );
};
export default Perfil;
