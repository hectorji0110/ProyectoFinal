import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecoverPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/recuperar-password`,
        { email }
      );

      setMsg(data.msg || "Se ha enviado un correo con instrucciones");
      setErrorMsg("");

      // Opcional: redirigir al login después de unos segundos
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      console.error("Error recover:", error);

      setErrorMsg(
        error.response?.data?.msg ||
          "No se pudo enviar el correo, intenta nuevamente."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">

        {/* Ícono */}
        <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto flex items-center justify-center text-4xl">
         <img src="../src/assets/material-symbols-light--map-pin-heart-rounded.svg" alt="Buscar" className="w-16 h-16 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mt-4">
          Recuperar Contraseña
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {/* Mensajes */}
        {msg && <p className="text-green-600 text-center mb-3">{msg}</p>}
        {errorMsg && <p className="text-red-500 text-center mb-3">{errorMsg}</p>}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
          >
            Enviar instrucciones
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-orange-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default RecoverPassword;