import { Link } from 'react-router-dom';
import { User, Scissors, MapPin, AlertCircle } from 'lucide-react';
import { useBarberos } from '../hooks/useBarberos'; // <--- Importamos nuestro Hook

const Equipo = () => {
  // 1. Todo el estado y la petición se reducen a esta línea:
  const { data: barberos, isLoading, isError } = useBarberos();

  return (
    <section className="py-16 bg-white min-h-[80vh]" id="equipo">
      <div className="container mx-auto px-4">
        
        {/* TITULO */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Nuestro Staff</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Conoce a los Maestros</h2>
          <p className="text-slate-500 text-lg">Profesionales dedicados a definir tu mejor estilo.</p>
        </div>

        {/* CONTENIDO (Manejo de estados automático) */}
        
        {/* CASO 1: CARGANDO */}
        {isLoading && (
            <div className="text-center py-20 text-slate-400 animate-pulse">
                Cargando equipo...
            </div>
        )}

        {/* CASO 2: ERROR (Ahora sí lo mostramos visualmente) */}
        {isError && (
            <div className="flex flex-col items-center justify-center py-10 text-red-500 bg-red-50 rounded-2xl border border-red-100">
                <AlertCircle size={32} className="mb-2" />
                <p>No pudimos cargar la lista de barberos.</p>
            </div>
        )}

        {/* CASO 3: DATA LISTA */}
        {!isLoading && !isError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                
                {barberos?.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <User size={48} className="mx-auto mb-2 opacity-50"/>
                        <p>Aún no hay barberos registrados.</p>
                    </div>
                ) : (
                    barberos?.map((barbero) => (
                        <div key={barbero.id} className="group relative h-96 rounded-2xl overflow-hidden shadow-lg bg-slate-100 border border-slate-200">
                            
                            {/* FOTO */}
                            {barbero.fotoUrl ? (
                                <img src={barbero.fotoUrl} alt={barbero.fullname} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                                    <User size={64} /><span className="text-sm mt-2 font-medium">Sin foto</span>
                                </div>
                            )}
                            
                            {/* OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent flex flex-col justify-end p-6">
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    
                                    {(barbero.provincia || barbero.pais) && (
                                        <p className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <MapPin size={12} /> {barbero.provincia}{barbero.provincia && barbero.pais ? ', ' : ''}{barbero.pais}
                                        </p>
                                    )}

                                    <h3 className="text-2xl font-bold text-white mb-2">{barbero.fullname}</h3>
                                    
                                    <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-2 group-hover:line-clamp-none transition-all">
                                        {barbero.biografia || "Experto en cortes clásicos y modernos."}
                                    </p>
                                    
                                    <Link 
                                        to={`/barberos/${barbero.id}`} 
                                        className="w-full py-3 bg-white hover:bg-blue-50 text-slate-900 font-bold rounded-xl transition flex items-center justify-center gap-2 active:scale-95 shadow-lg"
                                    >
                                        <Scissors size={18} className="text-blue-600" /> Ver Perfil
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
      </div>
    </section>
  );
};

export default Equipo;