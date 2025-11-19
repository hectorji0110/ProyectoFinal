import Hero from "../components/Hero";
import PetList from "../components/listaMascota";
import HowItWorks from "../components/comoFunciona";
import PublishPetCTA from "../components/publicarMascota";

const Home = () => {
  return (
    <>
      <Hero />
      <PetList />
      <HowItWorks />
      <PublishPetCTA />
    </>
  );
};

export default Home;