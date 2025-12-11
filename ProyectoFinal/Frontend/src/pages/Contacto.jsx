import React, { useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import SelectCustom from "../components/ui/SelectCustom";
/**
 * Pagina: Contacto
 * Descripción:
 *   Página de contacto que permite a los usuarios autenticados enviar mensajes
 *   al backend (consultas, soporte o reportes).
 *   Incluye formulario con validaciones, manejo de contexto de usuario,
 *   peticiones HTTP usando Axios y notificaciones con react-hot-toast.
 *
 * Funcionalidades principales:
 *   - Valida que el usuario esté autenticado antes de enviar un mensaje.
 *   - Validación de campos: asunto, tipo y contenido (mínimo 10 caracteres).
 *   - Envía datos al backend con token de autorización.
 *   - Limpia el formulario después del envío exitoso.
 *   - Muestra notificaciones de exito o error.
 *   - Integracion de SelectCustom para campos tipo de mensajes.
 *   - Muestra mensajes de error usando toast.
 *
 */
const Contacto = () => {
  const { token, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    asunto: "",
    contenido: "",
    tipo: "",
  });
  const [respuesta, setRespuesta] = useState("");
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Validaciones del formulario
  const validarFormulario = () => {
    if (formData.asunto.trim().length < 3) {
      toast.error("El asunto debe tener al menos 3 caracteres.");
      return false;
    }
    if (formData.contenido.trim().length < 10) {
      toast.error("El mensaje debe tener al menos 10 caracteres.");
      return false;
    }
    if (!["consulta", "soporte", "reporte"].includes(formData.tipo)) {
      toast.error("El tipo de mensaje no es válido.");
      return false;
    }
    return true;
  };
  // Enviar formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setRespuesta("❌ Debes iniciar sesión para enviar un mensaje.");
      return;
    }
    if (!validarFormulario()) return;
    try {
      const dataEnviar = {
        asunto: formData.asunto,
        contenido: formData.contenido,
        tipo: formData.tipo,
        id_usuario: user?.id, // aseguramos ambos casos
      };
      console.log("📤 Enviando al backend:", dataEnviar);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/mensajes`,
        dataEnviar,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 201) {
        toast.success("Mensaje enviado correctamente");
        setFormData({ asunto: "", contenido: "", tipo: "" });
      }
    } catch (error) {
      console.log("🔥 ERROR BACKEND:", error.response?.data);
      toast.error(error.response?.data?.msg || "Error al enviar el mensaje");
    }
  };
  return (
    <section className="min-h-screen px-6 md:px-16 py-28 bg-gradient-to-b from-white to-blue-100 dark:from-gray-800 dark:to-gray-900">
      {/* Título superior */}
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Contacto
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          ¿Tienes alguna pregunta? Estamos aquí para ayudarte
        </p>
      </div>
      {/* Contenedor principal 2 columnas de la página */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* FORMULARIO */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 space-y-6 border border-gray-200 dark:border-gray-500">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Envíanos un mensaje
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="asunto"
              placeholder="Asunto"
              value={formData.asunto}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <SelectCustom
              label="Tipo de Mensaje"
              options={[
                { label: "Consulta", value: "consulta" },
                { label: "Soporte", value: "soporte" },
                { label: "Reporte", value: "reporte" },
              ]}
              value={formData.tipo}
              onChange={(value) => setFormData({ ...formData, tipo: value })}
            />
            <textarea
              name="contenido"
              rows="6"
              placeholder="Escribe tu mensaje..."
              value={formData.contenido}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-black dark:text-white"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-3 transition"
            >
              Enviar Mensaje
            </button>
          </form>
          {/* Mensaje si no está logueado */}
          {respuesta && (
            <p className="text-green-600 dark:text-green-400 font-semibold">
              {respuesta}
            </p>
          )}
        </div>
        {/* Información de contacto */}
        <div className="space-y-6">
          {/* Email */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-7 border border-gray-200 dark:border-gray-500">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Información de Contacto
            </h3>
            <div className="flex items-start gap-4 mt-4">
              <img
                src="../src/assets/material-symbols-light--business-messages-outline.svg"
                className="w-7 h-7 dark:invert invert-0"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  Email
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  contacto@adoptamascota.com
                </p>
              </div>
            </div>
            {/* Teléfono */}
            <div className="flex items-start gap-4 mt-6">
              <img
                src="../src/assets/material-symbols-light--phone-in-talk-outline-rounded.svg"
                className="w-7 h-7 dark:invert invert-0"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  Teléfono
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  +58 (414) 123-4567
                </p>
              </div>
            </div>
            {/* Dirección */}
            <div className="flex items-start gap-4 mt-6">
              <img
                src="../src/assets/material-symbols-light--file-map-outline-sharp.svg"
                className="w-7 h-7 dark:invert invert-0"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  Dirección
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Calle Principal 123 <br /> Maracaibo, Zulia
                </p>
              </div>
            </div>
          </div>
          {/* HORARIO */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-7 border border-gray-200 dark:border-gray-500">
            <p className="font-semibold text-gray-900 dark:text-white text-lg">
              Horario de Atención
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
              Lunes - Viernes: 09:00 AM - 6:00 PM <br />
              Sábados: 10:00 AM - 2:00 PM <br />
              Domingos: Cerrado
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Contacto;
