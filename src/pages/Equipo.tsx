import { useCallback, useEffect } from 'react'; // 👈 Agregamos useEffect
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, User, AlertCircle } from 'lucide-react';
import { useBarberos } from '../hooks/useBarberos';
import { BarberCard } from '../components/BarberCard';

const Equipo = () => {
  const { data: barberos, isLoading, isError } = useBarberos();
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true, align: 'start',}, [
    Autoplay({delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true})]);
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') emblaApi.scrollPrev();
      if (event.key === 'ArrowRight') emblaApi.scrollNext();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [emblaApi]);
  const listaBarberos = barberos && barberos.length > 0 && barberos.length < 6
    ? [...barberos, ...barberos, ...barberos]
    : barberos;

  return (
    <section className="py-16 bg-white min-h-[80vh]" id="equipo">
      <div className="container mx-auto px-4">

        {/* TITULO */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Nuestro Staff</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Conoce a los Maestros</h2>
          <p className="text-slate-500 text-lg">Profesionales dedicados a definir tu mejor estilo.</p>
        </div>

        {/* CARGANDO / ERROR */}
        {isLoading && <div className="text-center py-20 text-slate-400 animate-pulse">Cargando equipo...</div>}
        {isError && (
          <div className="flex justify-center text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
            <AlertCircle className="mr-2" /> Error al cargar barberos
          </div>
        )}

        {/* CONTENIDO */}
        {!isLoading && !isError && listaBarberos && (
          <>
            {barberos && barberos.length === 0 ? (
              <div className="text-center text-slate-400"><User size={48} className="mx-auto" /> No hay personal.</div>
            ) : (

              <div className="relative px-8 md:px-20 lg:px-32 group">
                
                {/* BOTÓN IZQUIERDO */}
                <button onClick={scrollPrev} className="absolute left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-[#c4a484] text-white shadow-md transition-all duration-300 ease-out hover:bg-[#a88b6e] hover:scale-110 hover:shadow-lg active:scale-95 hidden md:flex">
                    <ChevronLeft size={24} />
                </button>

                {/* VIEWPORT */}
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex -ml-4 py-4">
                    {listaBarberos.map((barbero, index) => (
                      <div
                        key={`${barbero.id}-${index}`}
                        className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4"
                      >
                        <BarberCard barbero={barbero} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTÓN DERECHO */}
                <button onClick={scrollNext} className="absolute right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-[#c4a484] text-white shadow-md transition-all duration-300 ease-out hover:bg-[#a88b6e] hover:scale-110 hover:shadow-lg active:scale-95 hidden md:flex">
                    <ChevronRight size={24} />
                </button>

              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Equipo;