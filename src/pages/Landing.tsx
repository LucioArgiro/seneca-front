import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { LandingGallery } from "../components/LandingGallery";
import { Precios } from "../components/Precios";
import { Footer } from "../components/Footer";
import Equipo from "./Equipo";

const Landing = () => {
  return (
    <div className="font-sans text-gray-800 bg-[#0a0a0a] overflow-hidden">
      <Navbar />
      <Hero /> 
      <LandingGallery />
      <Equipo />
      <Precios />
      <Footer />
    </div>
  );
};

export default Landing;