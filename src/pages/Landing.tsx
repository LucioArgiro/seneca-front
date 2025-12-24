import  {Navbar}  from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Barberos } from "../components/Barberos";
import { Precios } from "../components/Precios";
import { Footer } from "../components/Footer";


const Landing = () => {
  return (
    <div className="font-sans text-gray-800">
      <Navbar />
      <Hero />
      <Barberos />
      <Precios />
      <Footer />
    </div>
  );
};

export default Landing;