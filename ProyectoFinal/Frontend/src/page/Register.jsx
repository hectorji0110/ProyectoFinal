import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/auth/register", {
        nombre: name,
        apellido: lastName,
        email,
        contrasena: password, // debe coincidir con tu backend
      });
toast.success(" ¡Se ha registrado con exito!");

      console.log("Registro OK:", data);
      

      // Redirigir al login después de registrarse
      navigate("/login");
    } catch (error) {
      console.error("Error register:", error);

      setErrorMsg(
        error.response?.data?.msg || "Error al registrarse. Intente nuevamente"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        
        {/* Icono */}
        <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto flex items-center justify-center text-4xl">
          <img src="../src/assets/material-symbols-light--map-pin-heart-rounded.svg" alt="Buscar" className="w-16 h-16 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mt-4">
          Crear Cuenta
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Regístrate para comenzar a adoptar mascotas
        </p>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
        )}


        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombres del usuario
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="tuNombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Apellido del usuario
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="tuApellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

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

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="*******"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>


          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
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





export default Register;