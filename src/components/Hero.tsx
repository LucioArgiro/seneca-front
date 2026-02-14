import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="inicio" className="relative h-[50vh] min-h-[400px] md:h-[700px] flex items-end justify-center pb-12 md:pb-20 overflow-hidden">
      
      {/* 1. IMAGEN DE FONDO */}
      {/* Le agregamos una animación sutil de zoom-out para que la imagen "respire" al cargar */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{backgroundImage: "url('https://res.cloudinary.com/dn9k3xvji/image/upload/v1771033251/Sin_t%C3%ADtulo_uh5azg.png')"}}
        data-aos="zoom-out"
        data-aos-duration="2000"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
        <div className="flex flex-row gap-3 md:gap-8 items-center justify-center w-full max-w-lg md:max-w-none">
          
          {/* BOTÓN 1: RESERVAR (Principal) */}
          <button onClick={() => navigate('/login')} className="flex-1 md:flex-none md:w-auto bg-[#C9A227] text-[#131313] border border-[#C9A227] hover:bg-[#131313] hover:text-[#C9A227] px-2 py-3 md:px-8 md:py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 text-[11px] xs:text-xs md:text-base whitespace-nowrap" data-aos="fade-right" data-aos-delay="1000" data-aos-duration="1000">Reservar Ahora</button>

          {/* BOTÓN 2: CONTACTO (Secundario) */}
          <button onClick={() => navigate('/Contacto')} className="flex-1 md:flex-none md:w-auto bg-[#131313] text-[#C9A227] border border-[#C9A227] hover:text-[#131313] hover:bg-[#C9A227] px-2 py-3 md:px-8 md:py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 text-[11px] xs:text-xs md:text-base whitespace-nowrap" data-aos="fade-left" data-aos-delay="800" data-aos-duration="1000">Contactanos</button>

        </div>
      </div>
    </section>
  );
};