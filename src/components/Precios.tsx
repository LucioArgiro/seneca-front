import { useEffect, useState } from 'react';
import { Check, Loader2, Star, Clock } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="py-32 flex justify-center items-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <section id="servicios" className="py-10 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900">Nuestros Servicios</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Elige el tratamiento perfecto para ti. Precios transparentes y sin sorpresas.
          </p>
        </div>

        {servicios.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-gray-500">No hay servicios disponibles por el momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start justify-center">
            {servicios.map((servicio) => {

              // 2. LÓGICA DE DATOS
              const isPopular = servicio.popular;
              // Convertimos el string "A, B, C" en array ["A", "B", "C"]
              const featuresList = servicio.features ? servicio.features.split(',') : [];

              return (
                <div
                  key={servicio.id}
                  className={`relative bg-white p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 flex flex-col ${isPopular? 'border-blue-500 shadow-2xl scale-105 z-12 h-[500px]': 'border-slate-200 shadow-lg hover:shadow-xl h-[500px]'}`}>
                  {/* BADGE POPULAR */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-blue-500/30">
                      <Star size={12} fill="white" /> Más Elegido
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{servicio.nombre}</h3>
                    {servicio.descripcion && (
                      <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px]">
                        {servicio.descripcion}
                      </p>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-slate-900">${servicio.precio}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-6 bg-blue-50 w-fit px-3 py-1 rounded-full">
                    <Clock size={16} /> {servicio.duracionMinutos} min
                  </div>

                  <div className="w-full h-px bg-slate-100 mb-6"></div>

                  {/* LISTA DE FEATURES REALES */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {featuresList.length > 0 ? (
                      featuresList.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                          <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature.trim()}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic text-sm flex gap-2">
                        <Check size={18} className="text-slate-300" /> Servicio general
                      </li>
                    )}
                  </ul>

                  <button
                    onClick={() => navigate('/login')}
                    className={`w-full py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2
                      ${isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }
                    `}
                  >
                    Reservar Turno
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