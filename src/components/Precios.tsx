import { useEffect, useState } from 'react';
import { Check, Loader2, Star, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getServicios, type Servicio } from '../api/servicios';

export const Precios = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await getServicios();
        const activos = data.filter(s => s.activo);
        setServicios(activos);
      } catch (error) {
        console.error("Error cargando servicios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  // LÓGICA DE ORDENAMIENTO
  const popular = servicios.find(s => s.popular);
  const normales = servicios.filter(s => !s.popular);
  const serviciosOrdenados = popular
    ? [normales[0], popular, ...normales.slice(1)].filter(Boolean)
    : servicios;


  if (loading) {
    return (
      <div className="py-32 flex justify-center items-center bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-[#C9A227]" size={40} />
      </div>
    );
  }

  return (
    <section id="servicios" className="py-24 bg-[#0a0a0a] relative overflow-hidden">

      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* HEADER ANIMADO */}
        <div
          className="text-center mb-20"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <span className="text-[#C9A227] font-bold tracking-[0.3em] text-[10px] uppercase mb-3 block">Nuestros Planes</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Elige tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Estilo</span>
          </h2>
          <p className="text-zinc-500 mt-2 max-w-xl mx-auto text-lg font-light">
            Calidad premium, ambiente exclusivo y precios transparentes.
          </p>
        </div>

        {serviciosOrdenados.length === 0 ? (
          <div className="text-center p-10 bg-[#1E1E1E] rounded-2xl border border-[#333]" data-aos="fade-in">
            <p className="text-slate-500">No hay servicios disponibles por el momento.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8 items-center">

            {serviciosOrdenados.map((servicio, index) => {
              if (!servicio) return null;

              const isPopular = servicio.popular;
              // Si las features vienen como string, las separamos. Si no, array vacío.
              // Asegúrate de que tu backend mande un string separado por comas si usas split.
              const featuresList = (servicio as any).features ? (servicio as any).features.split(',') : [];

              return (
                <div
                  key={servicio.id}
                  // ANIMACIÓN INDIVIDUAL POR TARJETA
                  data-aos={isPopular ? "zoom-in-up" : "fade-up"} // El popular hace un zoom para destacar
                  data-aos-delay={index * 150} // Efecto escalera
                  data-aos-duration="1000"

                  className={`
                    relative flex flex-col p-8 rounded-3xl transition-all duration-300 group w-full md:max-w-[360px]
                    ${isPopular
                      // Popular: Dorado
                      ? 'bg-[#1E1E1E] border-2 border-[#C9A227] md:scale-105 z-10 h-auto md:h-[540px] shadow-[0_0_30px_rgba(201,162,39,0.15)]'
                      // Normal: Gris
                      : 'bg-[#131313] border border-white/5 hover:border-[#C9A227]/30 hover:bg-[#1A1A1A] h-auto md:h-[480px]'
                    }
                  `}
                >
                  {/* BADGE POPULAR */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C9A227] text-[#131313] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ring-4 ring-[#0a0a0a] shadow-lg">
                      <Star size={12} fill="#131313" strokeWidth={0} /> Más Elegido
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className={`text-xl font-black mb-2 uppercase tracking-wide ${isPopular ? 'text-white' : 'text-zinc-200'}`}>
                      {servicio.nombre}
                    </h3>
                    {servicio.descripcion && (
                      <p className="text-xs font-medium text-zinc-500 line-clamp-2 min-h-[32px] leading-relaxed">
                        {servicio.descripcion}
                      </p>
                    )}
                  </div>

                  {/* PRECIO */}
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-lg text-zinc-500 font-serif">$</span>
                    <span className={`text-5xl font-black tracking-tight ${isPopular ? 'text-white' : 'text-zinc-300'}`}>
                      {servicio.precio}
                    </span>
                  </div>

                  {/* DURACIÓN */}
                  <div className={`
                    flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-8 w-fit px-3 py-1.5 rounded-lg border
                    ${isPopular
                      ? 'bg-[#252525] text-[#C9A227] border-[#C9A227]/20'
                      : 'bg-[#1A1A1A] text-zinc-500 border-white/5'
                    }
                  `}>
                    <Clock size={12} /> {servicio.duracionMinutos} min de sesión
                  </div>

                  {/* SEPARADOR */}
                  <div className={`w-full h-px mb-8 ${isPopular ? 'bg-gradient-to-r from-transparent via-[#C9A227]/50 to-transparent' : 'bg-white/5'}`}></div>

                  {/* LISTA DE FEATURES */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {featuresList.length > 0 ? (
                      featuresList.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                          <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${isPopular ? 'bg-[#C9A227] text-[#131313]' : 'bg-[#333] text-zinc-500'}`}>
                            <Check size={10} strokeWidth={4} />
                          </div>
                          <span className="leading-tight font-medium">{feature.trim()}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-zinc-600 italic text-sm flex gap-2 items-center">
                        <Zap size={14} /> Servicio esencial
                      </li>
                    )}
                  </ul>

                  {/* BOTÓN DE ACCIÓN */}
                  <button
                    onClick={() => navigate('/login')}
                    className={`w-full py-4 rounded-xl font-black transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em] 
                    ${isPopular
                        ? 'bg-[#C9A227] text-[#131313] hover:bg-[#b88d15] shadow-[0_0_20px_rgba(201,162,39,0.2)] hover:scale-[1.02]'
                        : 'bg-[#1A1A1A] text-zinc-400 border border-white/5 hover:border-white/20 hover:text-white hover:bg-[#202020]'
                      }`}
                  >
                    Reservar Ahora
                  </button>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};