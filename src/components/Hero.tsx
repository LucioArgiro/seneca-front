import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    // 1. CAMBIO AQUÍ: Usamos h-[40dvh] (más estable) y un min-h-[330px] para que no se aplaste.
    // 2. CAMBIO AQUÍ: Subimos pb-8 a pb-12 para que los botones no tapen el texto de la imagen.
    <section id="inicio" className="relative h-[40dvh] min-h-[330px] w-full md:h-[700px] md:min-h-0 flex items-end justify-center pb-12 md:pb-20 overflow-hidden">
      
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{backgroundImage: "url('https://res.cloudinary.com/dn9k3xvji/image/upload/v1771033251/Sin_t%C3%ADtulo_uh5azg.png')"}} 
        data-aos="zoom-out" 
        data-aos-duration="2000"
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

      {/* CONTENIDO */}
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
        <div className="flex flex-row gap-2 md:gap-8 items-center justify-center w-full max-w-none">
          
          {/* BOTÓN 1: RESERVAR */}
          <button 
            onClick={() => navigate('/reservar')} 
            className="w-28 md:w-72 bg-[#C9A227] text-[#131313] border border-[#C9A227] hover:bg-[#131313] hover:text-[#C9A227] py-2 md:px-8 md:py-4 rounded-lg md:rounded-xl font-black uppercase tracking-widest transition-all duration-400 transform hover:-translate-y-2 text-[9px] md:text-base whitespace-nowrap cursor-pointer md:mb-2 shadow-lg" 
            data-aos="fade-right" 
            data-aos-delay="1000" 
            data-aos-duration="1000"
          >
            Reservar
          </button>

          {/* BOTÓN 2: CONTACTO */}
          <button 
            onClick={() => navigate('/Contacto')} 
            className="w-28 md:w-72 bg-[#131313] text-[#C9A227] border border-[#C9A227] hover:text-[#131313] hover:bg-[#C9A227] py-2 md:px-8 md:py-4 rounded-lg md:rounded-xl font-bold uppercase tracking-widest transition-all duration-400 text-[9px] md:text-base whitespace-nowrap cursor-pointer md:mb-2 shadow-lg" 
            data-aos="fade-left" 
            data-aos-delay="800" 
            data-aos-duration="1000"
          >
            Contactanos
          </button>

        </div>
      </div>
    </section>
  );
};