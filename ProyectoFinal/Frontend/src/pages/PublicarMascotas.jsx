import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import SelectCustom from "../components/ui/SelectCustom";
/**
 * Pagina: PublicarMascota
 *
 * Este formulario permite que un usuario autenticado publique una mascota
 * para adopción. Incluye:
 * - Manejo de formulario con useState
 * - Subida de imagen mediante FormData
 * - Loader visual durante la publicación
 * - Validación básica del token
 * - Envío de datos vía multipart/form-data
 * - Muestra notificaciones de exito o error
 *  - Integracion de SelectCustom para campos tipo, tamano y genero
 */
const PublicarMascota = () => {
  const [loading, setLoading] = useState(false);
  // Estado principal del formulario
  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    tipo: "",
    raza: "",
    genero: "",
    tamano: "",
    ubicacion: "",
    telefono: "",
    descripcion: "",
  });
  // Estado para almacenar el archivo de imagen seleccionado
  const [foto, setFoto] = useState(null);
  /**
   * Maneja cambios en los inputs del formulario.
   * Actualiza el estado dinámicamente según el name del input.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  /**
   * Maneja el envío del formulario.
   * - Verifica el token del usuario
   * - Crea un FormData con todos los campos + foto
   * - Envía la solicitud POST al backend
   * - Muestra loader mientras se realiza la petición
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia el loader
    try {
      const token = localStorage.getItem("token"); // JWT del usuario logueado
      if (!token) throw new Error("Usuario no autenticado");
      // Construcción de FormData para enviar archivos + texto
      const formDataObj = new FormData();
      Object.keys(form).forEach((key) => formDataObj.append(key, form[key]));
      if (foto) formDataObj.append("foto", foto);
      // Envío de datos al backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/mascotas`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Forzar un retardo mínimo para que se vea el loader
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Mascota publicada:", res.data);
      toast.success("Mascota publicada con éxito");
      // Reinicia el formulario tras publicación exitosa
      setForm({
        nombre: "",
        edad: "",
        tipo: "",
        raza: "",
        genero: "",
        tamano: "",
        ubicacion: "",
        telefono: "",
        descripcion: "",
      });
      setFoto(null);
    } catch (error) {
      console.error("Error publicando mascota:", error);
      toast.error("Error publicando mascota");
    } finally {
      setLoading(false); // Detiene el loader
    }
  };
  return (
    <div className="pt-24 pb-12 relative min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-100 to-blue-100 dark:from-gray-600 dark:to-gray-800 px-4">
      {/* Loader al publicar la mascota */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-5 relative z-10 ">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Publicar Mascota
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre de la mascota"
              className="w-full px-4 py-2 rounded-lg border  bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Edad</label>
            <input
              type="number"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              placeholder="Edad"
              className="w-full px-4 py-2 rounded-lg border  bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <SelectCustom
              label="Tipo"
              options={[
                { label: "Perro", value: "perro" },
                { label: "Gato", value: "gato" },
                { label: "Otro", value: "otro" },
              ]}
              value={form.tipo}
              onChange={(value) => setForm({ ...form, tipo: value })}
            />
          </div>
          <div>
            <label className="block mb-1">Raza</label>
            <input
              type="text"
              name="raza"
              value={form.raza}
              onChange={handleChange}
              placeholder="Raza"
              className="w-full px-4 py-2 rounded-lg border  bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <SelectCustom
              label="Género"
              options={[
                { label: "Macho", value: "macho" },
                { label: "Hembra", value: "hembra" },
                { label: "Desconocido", value: "desconocido" },
              ]}
              value={form.genero}
              onChange={(value) => setForm({ ...form, genero: value })}
            />
          </div>
          <div>
            <SelectCustom
              label="Tamaño"
              options={[
                { label: "Pequeño", value: "pequeño" },
                { label: "Mediano", value: "mediano" },
                { label: "Grande", value: "grande" },
              ]}
              value={form.tamano}
              onChange={(value) => setForm({ ...form, tamano: value })}
            />
          </div>
          <div>
            <label className="block  mb-1">Foto</label>
            <input
              type="file"
              onChange={(e) => setFoto(e.target.files[0])}
              className="w-full cursor-pointer px-4 py-2 rounded-lg border  bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block  mb-1">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Ubicación"
              className="w-full px-4 py-2 rounded-lg border  bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block  mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="w-full px-4 py-2 rounded-lg border  bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
              className="w-full px-4 py-2 rounded-lg border  bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold cursor-pointer"
          >
            Publicar Mascota
          </button>
        </form>
      </div>
    </div>
  );
};
export default PublicarMascota;
