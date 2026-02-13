import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/auth';
import { useMisTurnos } from '../../hooks/useTurnos';
import { useNegocio } from '../../hooks/useNegocio';
import { Navbar } from '../../components/Navbar';
import { TurnoCard } from '../../components/dashboard/TurnoCard';
import { HorariosList } from '../../components/common/HorariosList';
import { MapaOscuro } from '../../components/common/MapaOscuro';
import { WhatsAppBtn } from '../../components/common/WhatsAppBtn';
import { Plus, Scissors, Clock, Loader2, AlertTriangle, Info } from 'lucide-react';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();

  const { proximos, isLoading: loadingTurnos, cancelarTurno } = useMisTurnos();
  const { negocio, isLoading: loadingNegocio } = useNegocio();

  const telefonoAdmin = negocio?.telefono || "549381000000";
  const direccion = negocio?.direccion || "9 de Julio 189, Manantial, Tucuman";
  const mapsUrl = negocio?.mapsUrl || null;

  // Lógica para cancelar con confirmación tipo Toast
  const handleCancelar = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2 bg-[#1A1A1A] border border-[#C9A227]/20 p-3 rounded-lg shadow-xl">
        <p className="font-bold text-white text-sm">¿Cancelar este turno?</p>
        <div className="flex gap-2 justify-end mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="text-zinc-400 text-xs px-3 hover:text-white transition-colors">Volver</button>
          <button onClick={() => {
            toast.dismiss(t.id);
            cancelarTurno(id);
            toast.success("Turno cancelado");
          }} className="bg-red-900/80 hover:bg-red-800 text-white px-3 py-1.5 rounded text-xs font-bold border border-red-700 transition-colors">Confirmar</button>
        </div>
      </div>
    ), { duration: 5000, style: { background: 'transparent', boxShadow: 'none' } });
  };

  if (loadingTurnos || loadingNegocio) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] gap-4">
      <Loader2 className="animate-spin text-[#C9A227]" size={40} />
      <p className="text-[#C9A227] font-serif tracking-widest animate-pulse text-sm">CARGANDO...</p>
    </div>
  );

  // Clases reutilizables para mantener consistencia
  const cardContainerClass = "bg-[#131313] border border-[#C9A227]/20 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col";
  const titleClass = "text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2";

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-slate-200 pb-20 selection:bg-[#C9A227] selection:text-[#131313]">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 py-10 pt-24">

        {/* === HEADER: SALUDO Y BOTÓN === */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#C9A227] tracking-tight mb-1 flex items-center gap-3">
              Hola, {usuario?.nombre?.split(' ')[0]} <span className="animate-wave">👋</span>
            </h1>
            <p className="text-zinc-400 font-medium">Gestiona tus reservas y tu estilo.</p>
          </div>

          <button
            onClick={() => navigate('/reservar')}
            className="text-[#131313] bg-[#C9A227] rounded-lg hover:bg-[#131313] hover:text-[#C9A227] border border-transparent hover:border-[#C9A227]/50 px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-wide text-xs"
          >
            <Plus size={18} strokeWidth={3} /> Nuevo Turno
          </button>
        </div>

        {/* === GRID PRINCIPAL DE 3 COLUMNAS === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* COLUMNA 1: INFO LOCAL (Sticky para que acompañe el scroll) */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className={cardContainerClass}>
              <h3 className={titleClass}>Información del Local</h3>

              {/* Mapa */}
              <div className="w-full h-40 mb-4 rounded-xl overflow-hidden shadow-lg border border-white/5 relative z-0">
                <MapaOscuro nombre={negocio?.nombre} direccion={direccion} />
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-sm text-zinc-300 font-medium leading-snug">{direccion}</p>
                  {mapsUrl && (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-[#C9A227] text-[10px] font-bold uppercase tracking-wider hover:underline mt-2 inline-flex items-center gap-1">
                      ABRIR EN MAPS
                    </a>
                  )}
                </div>

                {/* Horarios */}
                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Horarios de Atención</h4>
                  <HorariosList jsonHorarios={negocio?.horarios} />
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: LISTA DE TURNOS (Con Scroll Interno) */}
          <div className="lg:col-span-6">
            <div className={`${cardContainerClass} h-[445px]`}>
              <h3 className={titleClass}>Próximos Turnos</h3>

              {/* Contenedor scrollable */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {proximos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center h-full animate-in fade-in duration-500">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-[#C9A227]/20 blur-3xl rounded-full"></div>
                      <div className="relative bg-gradient-to-b from-[#1A1A1A] to-[#0a0a0a] border border-[#C9A227]/30 p-6 rounded-full shadow-2xl">
                        <Scissors size={48} className="text-[#C9A227]" strokeWidth={1.5} />
                      </div>
                      <Clock size={20} className="absolute -bottom-1 -left-2 text-zinc-600 -rotate-12" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Sin turnos programados</h3>
                    <p className="text-zinc-500 max-w-xs mx-auto mb-6 text-xs">
                      Es un buen momento para renovar tu estilo.
                    </p>
                    <button
                      onClick={() => navigate('/reservar')}
                      className="bg-[#1A1A1A] border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
                    >
                      Agendar Cita
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pb-4">
                    {proximos.map((turno: any) => (
                      <TurnoCard key={turno.id} turno={turno} onCancel={handleCancelar} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA 3: AYUDA (Sticky) */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col">
              <h3 className={titleClass}>Acciones y Ayuda</h3>

              <div className="bg-[#131313] border border-red-900/30 rounded-xl p-4 mb-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <AlertTriangle size={60} className="text-red-500" />
                </div>
                <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle size={14} /> Política
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-3"> Para reprogramar o cancelar, avísanos con <span className="text-zinc-200 font-bold">12 horas de anticipación</span>.</p>
                <div className="flex items-center gap-2 p-2 bg-red-900/10 rounded border border-red-900/20"><Info size={14} className="text-red-400 shrink-0" /><p className="text-[10px] text-red-300 font-medium leading-tight">Evita sanciones futuras.</p>
                </div>
              </div>

              <WhatsAppBtn tipo="BUTTON" label="Soporte WhatsApp" telefono={telefonoAdmin} className="w-full bg-gradient-to-r from-[#1A1A1A] to-[#252525] hover:from-[#C9A227] hover:to-[#b88d15] text-[#C9A227] hover:text-[#131313] border border-[#C9A227]/30 hover:border-transparent font-bold py-3 rounded-xl transition-all shadow-lg text-xs uppercase tracking-widest flex items-center justify-center gap-2"/> </div>
          </div>

        </div>
      </div>

      {/* Estilos para el scrollbar (Fino y Oscuro) */}
      <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 2px; /* Barra muy fina */
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #131313;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #131313;
                }
            `}</style>
    </div>
  );
};

export default ClientDashboard;