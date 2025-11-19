import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Button } from "../components/ui/Button"; // Ajusta ruta según tu proyecto

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false); // estado para loader

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // activamos loader

    try {
      const { data } = await axios.post("http://localhost:3000/auth/login", {
        email,
        contrasena: password,
      });

      console.log("LOGIN OK:", data);

      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);

      toast.success("¡Bienvenido! Has iniciado sesión correctamente");
      setLoading(false);
      navigate("/"); // redirige al home
    } catch (error) {
      console.error("Error login:", error);
      setErrorMsg(
        error.response?.data?.msg || "Error al iniciar sesión. Intente nuevamente"
      );
      toast.error(error.response?.data?.msg);
      setLoading(false); // ocultamos loader
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">

      {/* Loader overlay */}
    {loading && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <Loader size="text-6xl" color="text-orange-500" bounce={true} duration="duration-2000" />
  </div>
      )}

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 relative z-10">
        
        {/* Icono */}
        <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto flex items-center justify-center text-4xl">
          <img src="../src/assets/material-symbols-light--map-pin-heart-rounded.svg" alt="Buscar" className="w-16 h-16 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mt-4">
          Iniciar Sesión
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Ingresa tu email y contraseña para acceder
        </p>

        {errorMsg && <p className="text-red-600 text-center font-medium mt-2">{errorMsg}</p>}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
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

          {/* Contraseña */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="*******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <a
            href="#"
            className="text-sm text-orange-600 dark:text-orange-400 hover:underline float-right mt-1"
            onClick={() => navigate("/recuperar-password")}
          >
            ¿Olvidaste tu contraseña?
          </a>

          {/* Botón */}
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" type="submit">
            Iniciar Sesión
          </Button>
        </form>

        {/* Registro */}
        <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-orange-600 dark:text-orange-400 font-medium hover:underline"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;