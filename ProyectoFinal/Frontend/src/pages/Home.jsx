import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import PetList from "../components/ListaMascota";
import HowItWorks from "../components/comoFunciona";
import PublishPetCTA from "../components/publicarMascota";

const Home = () => {

  return (
    <div className="relative">
      {/* Contenido real del Home */}
      <Hero />
      <PetList />
      <HowItWorks />
      <PublishPetCTA />
    </div>
  );
};

export default Home;