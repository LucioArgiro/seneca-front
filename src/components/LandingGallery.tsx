import { useNegocio } from '../hooks/useNegocio';
import { Instagram, ArrowRight, Camera } from 'lucide-react';

export const LandingGallery = () => {
  const { negocio } = useNegocio();
  const images: string[] = (negocio as any)?.galeria || [];
  if (images.length === 0) return null;

  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden" id="trabajos">

      {/* Fondo decorativo sutil */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* HEADER ANIMADO */}
        <div
          className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left"
          data-aos="fade-up" // Todo el header sube junto
          data-aos-duration="1000"
        >

          <div>
            {/* Badge */}
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="p-1.5 bg-[#C9A227]/10 rounded-full border border-[#C9A227]/20">
                <Camera size={14} className="text-[#C9A227]" />
              </div>
              <span className="text-[#C9A227] text-[10px] font-bold uppercase tracking-[0.3em]">Nuestro Arte</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Resultados <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A227] to-[#8a6d1b]">Reales</span>
            </h2>
            <p className="text-zinc-500 text-sm md:text-base mt-2 font-light">
              Cada corte cuenta una historia de dedicación.
            </p>
          </div>

          <a
            href={`${(negocio as any)?.instagram?.replace('@', '') || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-zinc-400 hover:text-[#C9A227] transition-colors text-xs font-bold uppercase tracking-widest border-b border-transparent hover:border-[#C9A227] pb-1"
            data-aos="fade-left" // El botón entra desde la derecha
            data-aos-delay="400"
          >
            <Instagram size={16} />
            Ver más en Instagram
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>

        </div>

        {/* GRID DE IMÁGENES ANIMADO */}
        {/* Aquí usaremos diferentes delays para el efecto "mosaico" */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">

          {/* FOTO 1 (GRANDE - Ocupa 2 filas y 2 columnas) */}
          {images[0] && (
            <div
              className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl border border-white/5 bg-[#131313] shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="0" // Aparece primero
              data-aos-duration="1200"
            >
              <img src={images[0]} alt="Trabajo destacado" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out" />

              {/* Overlay Gradiente Luxury */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

              {/* Texto Flotante */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end">
                <p className="text-[#C9A227] text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Corte Premium</p>
                <p className="text-white font-black text-2xl uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Estilo & Precisión</p>
              </div>
            </div>
          )}

          {/* FOTO 2 */}
          {images[1] && (
            <div
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#131313] shadow-xl"
              data-aos="zoom-in" // Efecto de zoom para variar
              data-aos-delay="200" // Retraso
              data-aos-duration="1000"
            >
              <img src={images[1]} alt="Trabajo 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          )}

          {/* FOTO 3 */}
          {images[2] && (
            <div
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#131313] shadow-xl"
              data-aos="zoom-in"
              data-aos-delay="300" // Un poco más tarde
              data-aos-duration="1000"
            >
              <img src={images[2]} alt="Trabajo 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          )}

          {/* FOTO 4 (ANCHO - Ocupa 2 columnas en desktop) */}
          {images[3] && (
            <div
              className="lg:col-span-2 group relative overflow-hidden rounded-3xl border border-white/5 bg-[#131313] shadow-xl"
              data-aos="fade-up"
              data-aos-delay="400" // Al final
              data-aos-duration="1200"
              data-aos-offset="50" // Se activa casi al final del scroll
            >
              <img src={images[3]} alt="Trabajo 4" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <p className="text-white font-bold text-xs uppercase tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[#C9A227]">#</span>ExperienciaSéneca
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};