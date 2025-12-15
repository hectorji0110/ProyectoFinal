import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Button } from "../components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
/**
 * Pagina de Login
 * 
 * Muestra el formulario de inicio de sesión y maneja:
 *  - Validación de email
 *  - Validación de contraseña segura
 *  - Loader durante autenticación
 *  - Manejo de errores visuales
 *  - Llamada al login del AuthContext
 */
const Login = () => {
  const navigate = useNavigate();
  // Extraemos la función login del AuthContext
  const { login } = useContext(AuthContext);
  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  /**
   * Maneja el envío del formulario:
   *  1. Valida email y contraseña
   *  2. Llama al login del AuthContext
   *  3. Maneja loader, redirecciones y mensajes de error
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    // Validación del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Ingresa un correo válido");
      toast.error("Correo inválido");
      setLoading(false);
      return;
    }
    /**
     * Valida que la contraseña cumpla con requisitos mínimos:
     *  - Mínimo 8 caracteres
     *  - Al menos una mayúscula
     *  - Al menos una minúscula
     *  - Al menos un número
     *  - Al menos un carácter especial
     */
    const validatePassword = (password) => {
      // Regex para validar contraseña segura
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    };
    if (!validatePassword(password)) {
      setErrorMsg(
        "La contraseña debe tener al menos 8 caracteres, incluyendo letras mayúsculas, minúsculas, números y caracteres especiales"
      );
      toast.error(
        "La contraseña debe tener al menos 8 caracteres, incluyendo letras mayúsculas, minúsculas, números y caracteres especiales"
      );
      setLoading(false);
      return;
    }
    // Llamar al método login() del AuthContext
    const ok = await login(email, password);
    // pequeño delay opcional para que se vea el loader
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (ok) {
      toast.success("¡Bienvenido!");
      setLoading(false);
      navigate("/");
      return;
    }
    // si no se inició sesión, error
    setErrorMsg("Credenciales incorrectas");
    toast.error("Email o contraseña incorrectos");
    setLoading(false);
  };
  return (
    <div className="pt-24 pb-12 relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 relative z-10">
        <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto flex items-center justify-center text-4xl">
          <img
            src="../src/assets/material-symbols-light--map-pin-heart-rounded.svg"
            alt="Buscar"
            className="w-16 h-16 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mt-4">
          Iniciar Sesión
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Ingresa tu email y contraseña para acceder
        </p>
        {errorMsg && (
          <p className="text-red-600 text-center font-medium">{errorMsg}</p>
        )}
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
          <a
            href="#"
            className="text-sm text-orange-600 dark:text-orange-400 hover:underline float-right mt-1"
            onClick={() => navigate("/recuperar-password")}
          >
            ¿Olvidaste tu contraseña?
          </a>
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
            type="submit"
          >
            Iniciar Sesión
          </Button>
        </form>
        <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-orange-600 dark:text-orange-400 font-medium hover:underline cursor-pointer"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};
export default Login;
