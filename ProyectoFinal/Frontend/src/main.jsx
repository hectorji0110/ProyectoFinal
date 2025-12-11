import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./components/AuthContext.jsx";
import App from "./App.jsx";
/**
 * @description
 * Punto de entrada principal de la aplicación React.
 * Renderiza el árbol raíz de la UI e inicializa:
 * - React.StrictMode para depuración
 * - BrowserRouter para gestión de rutas
 * - AuthProvider para la autenticación global
 * - Toaster para notificaciones
 * - Componente principal <App />
 *
 * Este archivo es esencial para el funcionamiento frontend.
 */
// Renderizado dentro del elemento #root en index.html
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
