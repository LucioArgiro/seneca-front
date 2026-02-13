import { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, User, AlertCircle, Scissors } from 'lucide-react';
import { useBarberos } from '../hooks/useBarberos';
import { BarberCard } from '../components/BarberCard';

const Equipo = () => {
  const { data: barberos, isLoading, isError } = useBarberos();
  const listaVisual = barberos || [];
  const activateCarousel = listaVisual.length >= 4;
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: activateCarousel,
      align: 'start', 
      active: activateCarousel,
      breakpoints: { '(min-width: 768px)': { align: 'start' } }
    }, 
    [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev(); }, [emblaApi]);
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext(); }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !activateCarousel) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') emblaApi.scrollPrev();
      if (event.key === 'ArrowRight') emblaApi.scrollNext();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [emblaApi, activateCarousel]);

  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden" id="equipo">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">

        {/* HEADER (Mantiene animación simple) */}
        <div 
            className="text-center mb-16 max-w-2xl mx-auto"
            data-aos="fade-up" 
            data-aos-duration="1000"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
             <div className="p-1.5 bg-[#C9A227]/10 rounded-full border border-[#C9A227]/20">
                <Scissors size={14} className="text-[#C9A227]" />
             </div>
             <span className="text-[#C9A227] font-bold tracking-[0.3em] uppercase text-[10px]">Nuestro Staff</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Conoce a los <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A227] to-[#8a6d1b]">Maestros</span>
          </h2>
          <p className="text-zinc-500 text-lg font-light">Profesionales dedicados a definir tu mejor estilo.</p>
        </div>

        {isLoading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]"></div>
            </div>
        )}
        
        {isError && (
          <div className="flex justify-center text-red-400 bg-red-900/10 p-4 rounded-xl border border-red-900/30 max-w-md mx-auto">
            <AlertCircle className="mr-2" /> Error al cargar el equipo
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {listaVisual.length === 0 ? (
              <div className="text-center text-zinc-500 py-10 border border-white/5 rounded-2xl bg-[#131313]" data-aos="fade-up">
                <User size={48} className="mx-auto mb-2 opacity-50" /> 
                No hay personal disponible.
              </div>
            ) : (
              <div className="relative px-4 md:px-12 group">
                
                {activateCarousel && (
                  <>
                    <button onClick={scrollPrev} className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] transition-all duration-300 hidden md:flex bg-[#0a0a0a]/80  hover:scale-110"><ChevronLeft size={24} /></button>
                    <button onClick={scrollNext} className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] transition-all duration-300 hidden md:flex bg-[#0a0a0a]/80 hover:scale-110"><ChevronRight size={24} /></button>
                  </>
                )}
                <div  className="overflow-hidden" ref={emblaRef} data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                  <div className={`flex -ml-4 py-4 ${!activateCarousel ? 'justify-center flex-wrap' : ''}`}>
                    {listaVisual.map((barbero) => (
                      <div key={barbero.id} className={`pl-4 min-w-0 transition-opacity duration-500 ${activateCarousel ? 'flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]' 
                                : 'w-full md:w-1/2 lg:w-1/3 max-w-[400px]'}`}>
                        <div className="h-full transform hover:-translate-y-2 transition-transform duration-500 ease-out">
                            <BarberCard barbero={barbero} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Equipo;