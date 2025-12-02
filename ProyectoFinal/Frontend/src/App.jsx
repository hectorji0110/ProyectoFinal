import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import ProtectedRoute from "./components/ProtectorRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Footer from "./components/ui/Footer";
import Register from "./pages/Register";
import RecuperarPassword from "./pages/RecuperarPassword";
import ResetPassword from "./pages/ResetPassword";
import PublicarMascotas from "./pages/PublicarMascotas";
import ListaMascotas from "./pages/ListaMascotas";
import MisPublicaciones from "./pages/MisPublicaciones";
import DetallesMascota from "./pages/DetallesMascota";
import Loader from "./components/Loader";
import Seguridad from "./pages/Seguridad";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import Perfil from "./pages/Perfil";
import Contacto from "./pages/Contacto";
import AdminPanel from "./pages/AdminPanel";
import Ayuda from "./pages/Ayuda";

function App() {
  const location = useLocation();

  // Loader Global
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setPageLoading(true);

    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 700); // duración del loader global

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Rutas donde ocultar navbar y footer
  const hideLayout =
    ["/login", "/register", "/recuperar-password"].includes(location.pathname) ||
    location.pathname.startsWith("/restablecer-password/");

  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      
      {/* 🔶 LOADER GLOBAL EN TODA LA PANTALLA */}
      {pageLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
          <Loader size="text-7xl" color="text-orange-500" bounce={true} />
        </div>
      )}

       <Navbar />

      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/restablecer-password/:token" element={<ResetPassword />} />
          
          {/* Rutas protegidas */}
          <Route
            path="/lista-mascotas"
            element={
              <ProtectedRoute>
                <ListaMascotas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publicar-mascota"
            element={
              <ProtectedRoute>
                <PublicarMascotas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-publicaciones"
            element={
              <ProtectedRoute>
                <MisPublicaciones />
              </ProtectedRoute>
            }
          />
          <Route path="/mascota/:id" element={<DetallesMascota />} />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          <Route
              path="/seguridad"
              element={
                <ProtectedRoute>
                  <Seguridad />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacto"
              element={
                <ProtectedRoute>
                  <Contacto />
                </ProtectedRoute>
              }
            />
            <Route
              path="/politica-privacidad"
              element={
                <ProtectedRoute>
                  <PoliticaPrivacidad />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ayuda"
              element={
                <ProtectedRoute>
                  <Ayuda />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
