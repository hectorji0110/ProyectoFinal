import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
/**
 * Página de Restablecimiento de Contraseña
 *
 * Funcionalidad:
 * - Permite al usuario ingresar una nueva contraseña tras recibir un token.
 * - Valida el formato de la nueva contraseña antes de enviarla.
 * - Muestra mensajes de éxito o error dependiendo del resultado.
 * - Envía la nueva contraseña al backend mediante POST.
 *
 */
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // Regex para validar contraseña segura:
  // Min 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
  const passwordSegura =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;
  /**
   * Valida la contraseña ingresada usando el regex de seguridad
   * @returns {boolean} true si cumple la validación, false si no
   */
  const validarPassword = () => {
    if (!passwordSegura.test(password)) {
      setErrorMsg(
        "La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, un número y un símbolo."
      );
      return false;
    }
    setErrorMsg("");
    return true;
  };
  /**
   * Maneja el envío del formulario si la contraseña es válida
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarPassword()) return;
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/restablecer-password/${token}`,
        { nuevaContrasena: password }
      );
      // Redirigir al login luego de éxito
      setMsg(data.msg);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.msg || "No se pudo restablecer la contraseña"
      );
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        {/* Ícono */}
        <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto flex items-center justify-center text-4xl">
          <img
            src="../src/assets/material-symbols-light--map-pin-heart-rounded.svg"
            alt="Buscar"
            className="w-16 h-16 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mt-4">
          Restablecer Contraseña
        </h2>
        {msg && <p className="text-green-600 mt-2">{msg}</p>}
        {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 pr-12 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="*******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                aria-label="Mostrar u ocultar contraseña"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
          >
            Guardar Nueva Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
