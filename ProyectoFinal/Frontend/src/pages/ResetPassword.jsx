import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/restablecer-password/${token}`,
        { nuevaContrasena: password }
      );

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
         <img src="../src/assets/material-symbols-light--map-pin-heart-rounded.svg" alt="Buscar" className="w-16 h-16 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mt-4">
          Restablecer Contraseña
        </h2>

        {msg && <p className="text-green-600 mt-2">{msg}</p>}
        {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <label className="text-gray-700 dark:text-gray-300 font-medium">
              Nueva Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700"
              placeholder="*******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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