// src/pages/client/ClientDashboard.tsx
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/auth';
import { useMisTurnos } from '../../hooks/useTurnos'; // Asegúrate de importar desde tu archivo hook
import { useNegocio } from '../../hooks/useNegocio';
import { Navbar } from '../../components/Navbar';
import { TurnoCard } from '../../components/dashboard/TurnoCard';
import { HorariosList } from '../../components/common/HorariosList';
import { MapaOscuro } from '../../components/common/MapaOscuro';
import { WhatsAppBtn } from '../../components/common/WhatsAppBtn';
import { Plus, Scissors, Loader2, AlertTriangle, Info, History, CheckCircle2, XCircle } from 'lucide-react';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();

  // 👇 USAMOS DIRECTAMENTE LAS LISTAS FILTRADAS DEL HOOK
  const { proximos: proximosTurnos, historial: historialTurnos, isLoading: loadingTurnos, cancelarTurno } = useMisTurnos();

  const { negocio, isLoading: loadingNegocio } = useNegocio();

  const telefonoAdmin = negocio?.telefono || "549381000000";
  const direccion = negocio?.direccion || "9 de Julio 189, Manantial, Tucuman";
  const mapsUrl = negocio?.mapsUrl || null;

  // Manejador de cancelación (Visual)
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

  const cardContainerClass = "bg-[#131313] border border-[#C9A227]/20 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col";
  const titleClass = "text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2";

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-slate-200 pb-20 selection:bg-[#C9A227] selection:text-[#131313]">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 py-10 pt-24">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#C9A227] tracking-tight mb-1 flex items-center gap-3">
              Hola, {usuario?.nombre?.split(' ')[0]} <span className="animate-wave">👋</span>
            </h1>
            <p className="text-zinc-400 font-medium">Gestiona tus reservas y tu estilo.</p>
          </div>
          <button onClick={() => navigate('/reservar')} className="text-[#131313] bg-[#C9A227] rounded-lg hover:bg-[#131313] hover:text-[#C9A227] border border-transparent hover:border-[#C9A227]/50 px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-wide text-xs">
            <Plus size={18} strokeWidth={3} /> Nuevo Turno
          </button>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* COLUMNA 1: INFO LOCAL */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className={cardContainerClass}>
              <h3 className={titleClass}>Información del Local</h3>
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
                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Horarios de Atención</h4>
                  <HorariosList jsonHorarios={negocio?.horarios} />
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: TU AGENDA (SOLO PRÓXIMOS) */}
          <div className="lg:col-span-6">
            <div className={`${cardContainerClass} h-[600px]`}>
              <h3 className={titleClass}>Tu Agenda Próxima</h3>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {proximosTurnos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16 animate-in fade-in duration-500">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-[#C9A227]/20 rounded-full"></div>
                      <div className="relative bg-gradient-to-b from-[#1A1A1A] to-[#0a0a0a] border border-[#C9A227]/30 p-6 rounded-full shadow-2xl">
                        <Scissors size={40} className="text-[#C9A227]" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Todo listo por ahora</h3>
                    <p className="text-zinc-500 max-w-xs mx-auto mb-6 text-xs">
                      No tienes turnos pendientes. ¿Es hora de un cambio de look?
                    </p>
                    <button onClick={() => navigate('/reservar')} className="bg-[#1A1A1A] border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all">
                      Agendar Cita
                    </button>
                  </div>
                ) : (
                  proximosTurnos.map((turno: any) => (
                    <TurnoCard key={turno.id} turno={turno} onCancel={handleCancelar} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA 3: AYUDA + HISTORIAL */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24">

            {/* 1. Política y Ayuda */}
            <div className="rounded-2xl p-5 shadow-lg relative overflow-hidden group">
              <h3 className={titleClass}>Ayuda</h3>
              <div className="bg-[#131313] border border-red-900/30 rounded-xl p-4 mb-4 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle size={14} /> Política
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-3"> Avísanos con <span className="text-zinc-200 font-bold">12hs de anticipación</span> para cambios.</p>
                <div className="flex items-center gap-2 p-2 bg-red-900/10 rounded border border-red-900/20"><Info size={14} className="text-red-400 shrink-0" /><p className="text-[10px] text-red-300 font-medium leading-tight">Evita sanciones.</p></div>
              </div>
              <WhatsAppBtn tipo="BUTTON" label="Soporte WhatsApp" telefono={telefonoAdmin} className="w-full bg-gradient-to-r from-[#1A1A1A] to-[#252525] hover:from-[#C9A227] hover:to-[#b88d15] text-[#C9A227] hover:text-[#131313] border border-[#C9A227]/30 hover:border-transparent font-bold py-3 rounded-xl transition-all shadow-lg text-xs uppercase tracking-widest flex items-center justify-center gap-2" />
            </div>

            {/* 2. HISTORIAL COMPACTO (Estilo Finanzas) */}
            {historialTurnos.length > 0 && (
              <div className="bg-[#1A1A1A] border border-[#C9A227]/10 rounded-2xl p-5 shadow-lg flex flex-col h-[250px]">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <History size={14} /> Historial
                  </h3>
                  <span className="text-[10px] text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded border border-white/5">{historialTurnos.length} total</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
                  {historialTurnos.map((turno: any) => {
                    const isCompleted = turno.estado === 'COMPLETADO';
                    return (
                      <div key={turno.id} className="group flex justify-between items-center p-3 rounded-xl bg-[#131313] border border-white/5 hover:border-[#C9A227]/30 transition-all hover:bg-[#181818]">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border 
                            ${isCompleted
                              ? 'bg-green-900/10 border-green-900/30 text-green-500'
                              : 'bg-red-900/10 border-red-900/30 text-red-500'}`}>
                            {isCompleted ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-zinc-200 truncate group-hover:text-[#C9A227] transition-colors">
                              {turno.servicio?.nombre}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate">
                              {new Date(turno.fecha).toLocaleDateString()} - {turno.barbero?.usuario?.nombre?.split(' ')[0]}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {isCompleted ? (
                            <span className="text-xs font-bold text-[#C9A227] block">${turno.servicio?.precio}</span>
                          ) : (
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">Cancelado</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #C9A227; }
      `}</style>
    </div>
  );
};

export default ClientDashboard;