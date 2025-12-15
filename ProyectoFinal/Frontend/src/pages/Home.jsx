import Hero from "../components/Hero";
import PetList from "../components/ListaMascota";
import HowItWorks from "../components/comoFunciona";
import PublishPetCTA from "../components/publicarMascota";
/**
 * Pagina de Home
 *
 * Este componente representa la página principal del sitio.
 * Su función es renderizar las secciones principales de la aplicación,
 * incluyendo:
 *
 *  - Hero: Sección principal con llamada visual inicial.
 *  - PetList: Lista de mascotas disponibles para adopción.
 *  - HowItWorks: Explicación del proceso de adopción en pasos.
 *  - PublishPetCTA: Llamado a la acción para publicar una mascota.
 *
 * El componente actúa como un "layout contenedor" que organiza las
 * secciones que componen la pantalla de inicio.
 *
 * No recibe props, ya que su contenido es estático y depende de otros componentes.
 */
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
