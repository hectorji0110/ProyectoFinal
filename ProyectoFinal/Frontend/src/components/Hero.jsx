import React from "react";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";
import puppy from "../assets/golden.png"; // Ajusta el nombre de tu imagen

const Hero = () => {
const navigate = useNavigate();

  return (
    <section className="pt-26 pb-12 w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-100 to-blue-100 dark:from-gray-600 dark:to-gray-800">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        
        {/* Texto principal */}
        <div className="text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Encuentra a tu
            <span className="block text-orange-500 dark:text-orange-500">
              nuevo mejor amigo
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-md">
            Miles de mascotas esperan un hogar lleno de amor. Adopta, no compres, 
            y cambia una vida para siempre.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => navigate("/lista-mascotas")}>
              Ver Mascotas
            </Button>

            <Button variant="outline" className="border-gray-300 dark:border-gray-600" onClick={() => navigate("/publicar-mascota")}>
              Publicar Mascota
            </Button>
          </div>
        </div>

        {/* Imagen del perrito */}
        <div className="flex justify-center md:justify-end">
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900">
            <img
              src={puppy}
              alt="Perrito feliz"
              className="w-[400px] h-[300px] object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;