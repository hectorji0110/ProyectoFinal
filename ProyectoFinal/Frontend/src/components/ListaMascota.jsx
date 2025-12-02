import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";

const PetList = () => {
  const [pets, setPets] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/mascotas`);
        console.log("BACKEND:", res.data);
        setPets(res.data.docs);
      } catch (error) {
        console.log("Error obteniendo mascotas:", error);
      }
    };

    fetchPets();
  }, []);

  



  return (
    <section className="py-16 bg-gradient-to-b from-orange-100 to-blue-100 dark:from-gray-600 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Mascotas Disponibles
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 mb-12 text-center">
          Conoce a estos adorables amigos que buscan un hogar
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {pets.slice(0, 6).map((pet) => (
            <div
              key={pet._id}
              className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800"
            >
              <img
                  src={pet.foto ? encodeURI(`${import.meta.env.VITE_API_URL}${pet.foto}`) : "/placeholder.png"}
                  alt={pet.nombre}
                  className="w-full h-56 object-cover"
                />

              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {pet.nombre}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {pet.edad} años
                </p>

                <p className="text-sm text-orange-600 dark:text-orange-400">
                  {pet.tipo}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                  {pet.ubicacion}
                </p>

                <Button
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                  onClick={() => {
                    if (token) {
                      navigate(`/mascota/${pet._id}`); // ir a detalle de la mascota
                    } else {
                      navigate("/login"); // si no está logueado, al login
                    }
                  }}
                >
                  Ver Detalles
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetList;