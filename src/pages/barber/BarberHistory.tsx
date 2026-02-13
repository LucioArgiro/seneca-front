import { useEffect, useState } from 'react';
import { useClientesCRM, type ClienteCRM } from '../../hooks/useClientesCRM';
import { useAuthStore } from '../../store/auth';
import { Search, User, ChevronRight, ArrowLeft, Trophy, DollarSign, Calendar, Clock, Phone } from 'lucide-react';
import dayjs from 'dayjs';

// Icono Helper
const HistoryIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
);

const BarberHistory = () => {
  const { usuario } = useAuthStore();
  const { clientes, isLoading, filtros } = useClientesCRM();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteCRM | null>(null);

  // Forzamos el filtro para asegurar consistencia (aunque el backend ya filtra)
  useEffect(() => {
    if (usuario?.id) {
      filtros.setBarbero(usuario.id);
    }
  }, [usuario]);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#131313]">
      <div className="text-[#C9A227] animate-pulse font-serif tracking-[0.2em] font-bold">CARGANDO TUS CLIENTES...</div>
    </div>
  );

  // --- VISTA DETALLE DEL CLIENTE ---
  if (clienteSeleccionado) {
    return (
      <div className="p-4 md:p-8 w-full min-h-screen bg-[#131313] text-slate-200">
        <button
          onClick={() => setClienteSeleccionado(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-[#C9A227] mb-8 font-bold transition-colors group"
        >
          <div className="p-2 rounded-full bg-[#131313] group-hover:bg-[#C9A227]/10 transition-colors">
            <ArrowLeft size={20} />
          </div>
          <span>VOLVER A MI LISTA</span>
        </button>

        {/* PERFIL HEADER */}
        <div className="bg-granular-dark rounded-2xl shadow-2xl border border-[#C9A227]  p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-[#C9A227] font-bold text-4xl shadow-2xl border-2 bg-[#131313] border-[#C9A227] shrink-0">
              {clienteSeleccionado.fullname.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left w-full overflow-hidden">
              <h1 className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight truncate">{clienteSeleccionado.fullname}</h1>
              <div className="space-y-1 mb-3 flex flex-col items-center md:items-start">
                <p className="text-slate-400 font-medium flex items-center gap-2 text-sm">{clienteSeleccionado.email}</p>
                <p className="text-slate-300 font-medium flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-[#C9A227]" /> {clienteSeleccionado.telefono || 'Sin teléfono'}
                </p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-[#131313] p-4 rounded-xl flex items-center gap-4 border border-transparent hover:border-[#C9A227]/30 transition">
              <div className="p-3 rounded-lg bg-[#131313] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313]"><DollarSign size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest">Generado</p>
                <p className="text-xl md:text-2xl font-bold text-white">${clienteSeleccionado.totalGastado}</p>
              </div>
            </div>
            <div className="bg-[#131313] p-4 rounded-xl flex items-center gap-4 border border-transparent hover:border-[#C9A227]/30 transition">
              <div className="p-3 rounded-lg bg-[#131313] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313]"><Calendar size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest">Visitas</p>
                <p className="text-xl md:text-2xl font-bold text-white">{clienteSeleccionado.totalTurnos}</p>
              </div>
            </div>
           <div className="bg-[#131313] p-4 rounded-xl flex items-center gap-4 border border-transparent hover:border-[#C9A227]/30 transition">
              <div className="p-3 rounded-lg bg-[#131313] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313]"><Clock size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest">Última Vez</p>
                <p className="text-md md:text-lg font-bold text-white mt-0.5">
                  {dayjs(clienteSeleccionado.ultimaVisita).format('D MMM, YYYY')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TABLA HISTORIAL INDIVIDUAL */}
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <HistoryIcon size={20} className="text-[#C9A227]" /> Historial de Servicios
        </h3>
        <div className="bg-[#131313] rounded-2xl shadow-xl overflow-hidden border border-white/5">
            <table className="w-full text-sm text-left">
              <thead className="bg-granular-dark text-[#C9A227] uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-5">Fecha</th>
                  <th className="p-5">Servicio</th>
                  <th className="p-5 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {clienteSeleccionado.historial.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-5 font-medium text-white whitespace-nowrap">
                      {dayjs(t.fecha).format('DD/MM/YYYY')}
                      <span className="text-[#C9A227] text-xs ml-2">{dayjs(t.fecha).format('HH:mm')}</span>
                    </td>
                    <td className="p-5 text-white font-bold">{t.servicio?.nombre}</td>
                    <td className="p-5 text-right font-mono font-bold text-[#C9A227]">
                       {t.estado === 'COMPLETADO' ? `$${t.servicio?.precio}` : <span className="text-xs opacity-50">{t.estado}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    );
  }

  // --- VISTA LISTADO GENERAL ---
  return (
    <div className="p-4 md:p-8 w-full min-h-screen bg-[#131313] text-slate-200">
      <div className="flex flex-col gap-8 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Mis Clientes</h1>
          <p className="text-slate-400 text-sm">Gestiona tu cartera y revisa el rendimiento.</p>
        </div>
        <div className="relative group w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/200 group-focus-within:text-[#C9A227] transition-colors" size={20} />
          <input type="text" placeholder="Buscar por nombre..." className="w-full pl-12 pr-4 py-4 bg-[#1A1A1A] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all" value={filtros.busqueda} onChange={e => filtros.setBusqueda(e.target.value)}/>
        </div>
      </div>

      <div className="bg-[#131313] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-granular-dark hidden md:table-header-group">
            <tr className="text-[#C9A227] uppercase text-[11px] font-bold tracking-wider">
              <th className="p-5">Cliente</th>
              <th className="p-5 text-center">Estado</th>
              <th className="p-5 text-center">Visitas</th>
              <th className="p-5 text-right">Total</th>
              <th className="p-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {clientes.length === 0 ? (
              <tr><td colSpan={5} className="p-16 text-center text-slate-500 italic">No se encontraron clientes.</td></tr>
            ) : (
              clientes.map(cliente => (
                <tr key={cliente.id} onClick={() => setClienteSeleccionado(cliente)} className="hover:bg-slate-800/30 cursor-pointer flex flex-col md:table-row p-4 md:p-0 border-b border-slate-800 md:border-none group transition-colors">
                  <td className="p-4 md:p-5 block md:table-cell">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border border-[#C9A227]/30 shrink-0 bg-[#131313] text-[#C9A227]`}>{cliente.estadoCliente === 'VIP' ? <Trophy size={16} /> : <User size={18} />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-base group-hover:text-[#C9A227] transition-colors truncate">{cliente.fullname}</p>
                        <p className="text-xs text-slate-500 font-medium truncate">{cliente.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 md:p-5 block md:table-cell text-left md:text-center md:pl-5 pl-[4.5rem]">
                    <span className={`px-2 py-1 rounded-md text-[0.625rem] font-bold uppercase tracking-wider bg-[#131313] text-[#C9A227]`}>
                      {cliente.estadoCliente}
                    </span>
                  </td>
                  <td className="p-2 md:p-5 block md:table-cell text-left md:text-center md:pl-5 pl-[4.5rem] font-bold text-slate-300">
                    <span className="md:hidden text-xs text-[#C9A227] mr-2 uppercase font-normal">Visitas:</span>
                    {cliente.totalTurnos}
                  </td>
                  <td className="p-2 md:p-5 block md:table-cell text-left md:text-right md:pl-5 pl-[4.5rem] font-mono font-bold text-[#C9A227]">
                    <span className="md:hidden text-xs text-[#C9A227] mr-2 uppercase font-normal">Total:</span>
                    ${cliente.totalGastado}
                  </td>
                  <td className="p-4 md:p-5 block md:table-cell text-right hidden md:table-cell">
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-[#C9A227] inline-block transition-colors" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarberHistory;