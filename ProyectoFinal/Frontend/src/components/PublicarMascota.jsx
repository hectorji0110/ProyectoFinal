import React from "react";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";

const PublishPetCTA = () => {
const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-r from-orange-300 to-blue-300 dark:from-orange-700 dark:to-blue-700 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        ¿Tienes una mascota para dar en adopción?
      </h2>

      <p className="text-gray-700 dark:text-gray-200 mt-2 mb-6">
        Ayuda a encontrar un hogar amoroso para tu mascota. Publica su perfil de forma 
        <br />gratuita y conecta con adoptantes responsables.
      </p>

      <Button variant="outline" className="border-gray-300 dark:border-gray-600" onClick={() => navigate("/publicar-mascota")}>
      Publicar Mascota
      </Button>
    </section>
  );
};

export default PublishPetCTA;