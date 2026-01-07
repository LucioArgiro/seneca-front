import  {Navbar}  from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Precios } from "../components/Precios";
import { Footer } from "../components/Footer";
import Equipo from "./Equipo";


const Landing = () => {
  return (
    <div className="font-sans text-gray-800">
      <Navbar />
      <Hero />
      <Equipo />
      <Precios />
      <Footer />
    </div>
  );
};

export default Landing;