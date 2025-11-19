import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectorRoute";
import Login from "./page/Login";
import Home from "./page/Home";
import Footer from "./components/Footer";
import Register from "./page/Register";
import RecuperarPassword from "./page/RecuperarPassword";
import ResetPassword from "./page/ResetPassword";
function App() {

  const location = useLocation();

  // Rutas donde NO queremos navbar y footer
  const hideLayout = ["/login", "/register", "/recuperar-password"].includes(location.pathname) || location.pathname.startsWith("/restablecer-password/");
  return (
      <div className="min-h-screen w-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* ⛔️ Ocultar NAVBAR si estamos en login o register */}
      {!hideLayout && <Navbar />}
      <main className="grow flex-row items-center justify-center">
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/recuperar-password" element={<RecuperarPassword />} />
  <Route path="/restablecer-password/:token" element={<ResetPassword />} />
  
  {/* Rutas protegidas */}
  <Route 
    path="/ver-mascotas" 
    element={
      <ProtectedRoute>
        <Home /> // Aquí va el contenido de la ruta protegida ver mascotas
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/publicar-mascota" 
    element={
      <ProtectedRoute> // Aquí va el contenido de la ruta protegida publicar mascota
        <Home /> 
      </ProtectedRoute>
    } 
  />
</Routes>
      </main>
      {/* ⛔️ Ocultar FOOTER si estamos en login o register */}
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
