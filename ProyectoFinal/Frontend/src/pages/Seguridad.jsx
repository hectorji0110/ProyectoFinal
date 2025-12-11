import React, { useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/Button";
import toast from "react-hot-toast";
/**
 * Pagina de Seguridad
 * 
 * Permite al usuario cambiar su contraseña.
 * Incluye:
 *  - Validaciones en frontend
 *  - Envío al backend mediante PATCH
 *  - Manejo de errores y estados de carga
 *  - Regex avanzado para validar contraseña segura
 */
const Seguridad = () => {
  const [form, setForm] = useState({
    nuevaPassword: "",
    confirmarPassword: "",
  });
  const [loading, setLoading] = useState(false);
  // Maneja los cambios del formulario
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  // Regex para validar contraseña segura:
  // Min 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
  const passwordSegura =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación: campos vacíos
    if (!form.nuevaPassword || !form.confirmarPassword) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
    // Validación: contraseña segura
    if (!passwordSegura.test(form.nuevaPassword)) {
      toast.error(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
      );
      return;
    }
    // Validación: coincidencia
    if (form.nuevaPassword !== form.confirmarPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/auth/cambiar-password`,
        {
          nuevaPassword: form.nuevaPassword,
          confirmarPassword: form.confirmarPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Contraseña actualizada correctamente 🛡️");
      setForm({ nuevaPassword: "", confirmarPassword: "" });
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      const msg = error.response?.data?.msg || "Error al cambiar la contraseña";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 dark:from-gray-600 dark:to-gray-900 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center">
            <img
              src="../src/assets/material-symbols-light--security.svg"
              alt="Buscar"
              className="w-16 h-16 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl pb-4 font-bold text-gray-900 dark:text-white">
              Seguridad
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Gestiona la seguridad de tu cuenta
            </p>
          </div>
        </div>
        {/* Card Cambiar contraseña */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-orange-500 text-xl">🔒</span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cambiar Contraseña
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nueva contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                name="nuevaPassword"
                value={form.nuevaPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Ingresa tu nueva contraseña"
              />
            </div>
            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmarPassword"
                value={form.confirmarPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Vuelve a escribir la contraseña"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Guardando..." : "Cambiar Contraseña"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
export default Seguridad;
