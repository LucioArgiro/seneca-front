import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="inicio" className="relative h-[35vh] min-h-[300px] md:h-[700px] flex items-end justify-center pb-8 md:pb-20 overflow-hidden">
      
      {/* IMAGEN DE FONDO */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{backgroundImage: "url('https://res.cloudinary.com/dn9k3xvji/image/upload/v1771033251/Sin_t%C3%ADtulo_uh5azg.png')"}}
        data-aos="zoom-out"
        data-aos-duration="2000"
      ></div>

      {/* GRADIENTE */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

      {/* CONTENIDO */}
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
        <div className="flex flex-row gap-2 md:gap-8 items-center justify-center w-full max-w-xs md:max-w-none">
          
          <button 
            onClick={() => navigate('/reservar')} 
            className="flex-1 bg-[#C9A227] text-[#131313] border border-[#C9A227] hover:bg-[#131313] hover:text-[#C9A227] py-2 px-3 md:px-8 md:py-4 rounded-lg md:rounded-xl font-black uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 text-[10px] md:text-base whitespace-nowrap mb-2" data-aos="fade-right" data-aos-delay="1000" data-aos-duration="1000">Reservar</button>

          {/* BOTÓN 2: CONTACTO */}
          <button 
            onClick={() => navigate('/Contacto')} 
            className="flex-1 bg-[#131313] text-[#C9A227] border border-[#C9A227] hover:text-[#131313] hover:bg-[#C9A227] py-2 px-3 md:px-8 md:py-4 rounded-lg md:rounded-xl font-bold uppercase tracking-widest transition-all duration-300 text-[10px] md:text-base whitespace-nowrap mb-2" data-aos="fade-left" data-aos-delay="800" data-aos-duration="1000">Contactanos</button>
        </div>
      </div>
    </section>
  );
};