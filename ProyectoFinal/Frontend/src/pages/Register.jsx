import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
/**
 * Pagina Register
 * 
 * Permite registrar un nuevo usuario realizando validaciones antes de enviar los datos.
 *
 * Validaciones incluidas:
 *  - Nombre: solo letras, mínimo 2 caracteres
 *  - Apellido: solo letras, mínimo 2 caracteres
 *  - Email válido
 *  - Contraseña segura (8 caracteres, mayúscula, minúscula, número, símbolo)
 *  - Confirmación de contraseña igual
 *
 * En caso de éxito → registra usuario y redirige al login.
 */
const Register = () => {
  const navigate = useNavigate();
  // Estados del formulario
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // Validaciones
  //Validacio de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  /**
   * Valida que la contraseña sea fuerte:
   * - 8 caracteres
   * - Mayúscula, minúscula, número y símbolo
   */
  const validatePassword = (password) => {
    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passRegex.test(password);
  };
  /**
   * Valida que nombre y apellido sean solo letras y mínimo 2 caracteres.
   */
  const validateName = (text) => {
    const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{2,}$/;
    return nameRegex.test(text);
  };
  // Submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    // Validar nombre
    if (!validateName(name)) {
      setErrorMsg("El nombre debe contener solo letras y mínimo 2 caracteres.");
      toast.error("Nombre inválido");
      return;
    }
    // Validar apellido
    if (!validateName(lastName)) {
      setErrorMsg(
        "El apellido debe contener solo letras y mínimo 2 caracteres."
      );
      toast.error("Apellido inválido");
      return;
    }
    // Validar email
    if (!validateEmail(email)) {
      setErrorMsg("Ingresa un email válido.");
      toast.error("Email inválido");
      return;
    }
    // VALIDAR CONTRASEÑA SEGURA
    if (!validatePassword(password)) {
      setErrorMsg(
        "La contraseña debe tener mínimo 8 caracteres e incluir mayúscula, minúscula, número y símbolo."
      );
      toast.error("Contraseña insegura");
      return;
    }
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }
    // Realizar el registro del usuario
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
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
    <div className="pt-24 pb-12 min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        {/* Icono */}
        <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto flex items-center justify-center text-4xl">
          <img
            src="../src/assets/material-symbols-light--map-pin-heart-rounded.svg"
            alt="Buscar"
            className="w-16 h-16 object-contain"
          />
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
              Nombre
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Escribe tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Apellido
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Escribe tu apellido"
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
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-4 py-2 pr-12 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="*******"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
              aria-label="Mostrar u ocultar contraseña"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold cursor-pointer"
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
