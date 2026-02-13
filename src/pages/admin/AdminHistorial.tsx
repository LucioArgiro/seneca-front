import { useState, useRef, useEffect } from 'react';
import { useClientesCRM, type ClienteCRM } from '../../hooks/useClientesCRM';
import { Search, User, ChevronRight, ArrowLeft, Filter, Trophy, DollarSign, Calendar, Clock, ChevronDown, Check, Phone } from 'lucide-react';
import dayjs from 'dayjs';

// --- COMPONENTE CUSTOM SELECT (Sin cambios) ---
const BarberoSelect = ({ filtros, barberos }: { filtros: any, barberos: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentLabel = () => {
    if (filtros.barbero === 'todos') return 'Todos los Barberos';
    const selected = barberos.find((b: any) => b.id === filtros.barbero);
    return selected
      ? (selected.fullname || `${selected.usuario.nombre} ${selected.usuario.apellido}`)
      : 'Seleccionar Barbero';
  };

  const handleSelect = (value: string) => {
    filtros.setBarbero(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full md:w-72 group shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-x-2 rounded-xl py-4.5 pl-12 pr-4 text-sm font-semibold text-white shadow-sm ring-1 ring-inset transition-all
            ${isOpen
            ? 'bg-[#131313] ring-[#C9A227] text-[#C9A227]'
            : 'bg-[#131313] ring-slate-800 text-slate-200 hover:bg-white/5'
          }
        `}
      >
        <Filter
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none 
            ${isOpen ? 'text-[#C9A227]' : 'text-[#C9A227]'}`}
          size={20}
        />
        <span className="truncate">{getCurrentLabel()}</span>
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-[#C9A227]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-full origin-top-right rounded-xl bg-[#131313] shadow-2xl ring-1 ring-white/10 focus:outline-none animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
          <div className="py-1 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => handleSelect('todos')}
              className={`group flex w-full items-center justify-between px-4 py-3 text-sm transition-colors text-left
                ${filtros.barbero === 'todos'
                  ? 'bg-[#C9A227]/10 text-[#C9A227]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span>Todos los Barberos</span>
              {filtros.barbero === 'todos' && <Check size={16} />}
            </button>
            {barberos.map((b: any) => {
              const nombreMostrar = b.fullname || (b.usuario ? `${b.usuario.nombre} ${b.usuario.apellido}` : 'Sin nombre');
              const isSelected = filtros.barbero === b.id;

              return (
                <button
                  key={b.id}
                  onClick={() => handleSelect(b.id)}
                  className={`group flex w-full items-center justify-between px-4 py-3 text-sm transition-colors text-left
                    ${isSelected
                      ? 'bg-[#C9A227]/10 text-[#C9A227]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <span className="truncate">{nombreMostrar}</span>
                  {isSelected && <Check size={16} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const AdminHistorial = () => {
  const { clientes, barberos, isLoading, filtros } = useClientesCRM();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteCRM | null>(null);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#131313]">
      <div className="text-[#C9A227] animate-pulse font-serif tracking-[0.2em] font-bold">CARGANDO CLIENTES...</div>
    </div>
  );

  // --- VISTA 1: DETALLE DEL CLIENTE (PERFIL) ---
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
          <span>VOLVER AL LISTADO</span>
        </button>

        {/* Tarjeta Perfil */}
        <div className="bg-granular-dark rounded-2xl shadow-2xl border border-[#C9A227] p-6 md:p-8 mb-8 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-[#C9A227] font-bold text-4xl shadow-2xl border-2 bg-[#131313] border-[#C9A227] shrink-0">
              {clienteSeleccionado.fullname.charAt(0).toUpperCase()}
            </div>

            <div className="text-center md:text-left w-full overflow-hidden">
              <h1 className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight truncate">{clienteSeleccionado.fullname}</h1>

              <div className="space-y-1 mb-3 flex flex-col items-center md:items-start">
                <p className="text-slate-400 font-medium flex items-center gap-2 text-sm truncate max-w-full">
                  {clienteSeleccionado.email}
                </p>
                <p className="text-slate-300 font-medium flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-[#C9A227]" /> {clienteSeleccionado.telefono}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-[#131313] p-4 rounded-xl flex items-center gap-4 group border border-white/5 hover:border-[#C9A227]/30 transition-colors">
              <div className="p-3 rounded-lg bg-[#131313] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] transition-colors"><DollarSign size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest">Inversión Total</p>
                <p className="text-xl md:text-2xl font-bold text-white">${clienteSeleccionado.totalGastado}</p>
              </div>
            </div>

            <div className="bg-[#131313] p-4 rounded-xl flex items-center gap-4 group border border-white/5 hover:border-[#C9A227]/30 transition-colors">
              <div className="p-3 rounded-lg bg-[#131313] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] transition-colors"><Calendar size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest">Visitas Totales</p>
                <p className="text-xl md:text-2xl font-bold text-white">{clienteSeleccionado.totalTurnos}</p>
              </div>
            </div>

            <div className="bg-[#131313] p-4 rounded-xl flex items-center gap-4 group border border-white/5 hover:border-[#C9A227]/30 transition-colors">
              <div className="p-3 rounded-lg bg-[#131313] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] transition-colors"><Clock size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest">Última Visita</p>
                <p className="text-md md:text-lg font-bold text-white mt-0.5">
                  {clienteSeleccionado.ultimaVisita ? dayjs(clienteSeleccionado.ultimaVisita).format('D MMM, YYYY') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Historial de Servicios */}
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <HistoryIcon size={20} className="text-[#C9A227]" /> Historial de Servicios
        </h3>
        
        <div className="bg-[#131313] rounded-2xl shadow-xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-granular-dark text-[#C9A227] uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-5">Fecha</th>
                  <th className="p-5">Servicio</th>
                  <th className="p-5">Barbero</th>
                  <th className="p-5 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {clienteSeleccionado.historial.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-5 font-medium text-white whitespace-nowrap">
                      {dayjs(t.fecha).format('DD/MM/YYYY')}
                      <span className="text-[#C9A227] text-xs ml-2">{dayjs(t.fecha).format('HH:mm')}</span>
                    </td>
                    <td className="p-5 text-white font-bold whitespace-nowrap">{t.servicio?.nombre}</td>
                    <td className="p-5 text-white font-bold whitespace-nowrap">
                      {t.barbero?.usuario?.nombre || 'Sin asignar'}
                    </td>
                    <td className="p-5 text-right font-mono font-bold text-[#C9A227] whitespace-nowrap">
                      {t.estado === 'COMPLETADO' ? `$${t.servicio?.precio}` : '-'}
                    </td>
                  </tr>
                ))}
                {clienteSeleccionado.historial.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500 italic">Sin historial disponible.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA 2: LISTADO GENERAL (CRM) ---
  return (
    <div className="p-4 md:p-8 w-full min-h-screen bg-[#131313] text-slate-200">

      {/* Header y Filtros */}
      <div className="flex flex-col gap-8 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Sistema de Clientes</h1>
          <p className="text-slate-300 max-w-2xl text-sm md:text-base">
            Gestiona tu base de clientes y analiza el rendimiento de tu negocio.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C9A227] transition-colors" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, email..."
              className="w-full pl-12 pr-4 py-4 bg-[#131313] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all"
              value={filtros.busqueda}
              onChange={e => filtros.setBusqueda(e.target.value)}
            />
          </div>
          <BarberoSelect filtros={filtros} barberos={barberos} />
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-[#131313] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-granular-dark hidden md:table-header-group">
            <tr className="text-[#C9A227] uppercase text-[11px] font-bold tracking-wider">
              <th className="p-5">Cliente</th>
              <th className="p-5 text-center">Estado</th>
              <th className="p-5 text-center">Visitas</th>
              <th className="p-5 text-right">LTV (Total)</th>
              <th className="p-5 text-right">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {clientes.length === 0 ? (
              <tr><td colSpan={5} className="p-16 text-center text-[#C9A227] italic">No se encontraron clientes con esos filtros.</td></tr>
            ) : (
              clientes.map(cliente => (
                <tr
                  key={cliente.id}
                  onClick={() => setClienteSeleccionado(cliente)}
                  // Agregamos 'relative' aquí para que el absolute funcione respecto a la fila (o celda)
                  className="relative hover:bg-slate-800/50 cursor-pointer flex flex-col md:table-row p-4 md:p-0 border-b border-slate-800 md:border-none group transition-colors"
                >
                  {/* Celda Cliente (Contiene la flecha móvil para evitar el error de <div> en <tr>) */}
                  <td className="p-4 md:p-5 block md:table-cell relative">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 shrink-0 ${cliente.estadoCliente === 'VIP' ? 'bg-[#131313] border-[#C9A227] text-[#C9A227]' : 'bg-[#131313] border-[#C9A227] text-[#C9A227]'}`}>
                        {cliente.estadoCliente === 'VIP' ? <Trophy size={18} /> : <User size={20} />}
                      </div>

                      {/* Datos del Cliente */}
                      <div className="min-w-0 pr-8 md:pr-0"> {/* Padding derecho para que el texto no toque la flecha en móvil */}
                        <p className="font-bold text-white text-base group-hover:text-[#C9A227] transition-colors truncate">{cliente.fullname}</p>
                        <p className="text-xs text-slate-500 font-medium truncate">{cliente.email}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Phone size={10} className="text-[#C9A227]" />
                          <p className="text-[10px] text-slate-400 font-medium truncate">{cliente.telefono}</p>
                        </div>
                      </div>
                    </div>

                    {/* ✅ SOLUCIÓN: La flecha está DENTRO del TD */}
                    <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                       <ChevronRight size={20} />
                    </div>
                  </td>

                  {/* Celda Estado */}
                  <td className="p-2 md:p-5 block md:table-cell text-left md:text-center pl-[4.5rem] md:pl-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${cliente.estadoCliente === 'INACTIVO' ? 'bg-red-900/20 text-red-400' : 'bg-[#131313] text-[#C9A227]'}`}>
                      {cliente.estadoCliente}
                    </span>
                  </td>

                  {/* Celda Visitas */}
                  <td className="p-2 md:p-5 block md:table-cell text-left md:text-center font-bold text-slate-300 pl-[4.5rem] md:pl-5">
                    <span className="md:hidden text-xs text-[#C9A227] mr-2 uppercase font-normal">Visitas:</span>
                    {cliente.totalTurnos}
                  </td>

                  {/* Celda LTV */}
                  <td className="p-2 md:p-5 block md:table-cell text-left md:text-right font-mono font-bold text-[#C9A227] pl-[4.5rem] md:pl-5">
                    <span className="md:hidden text-xs text-[#C9A227] mr-2 uppercase font-normal">Gastado:</span>
                    ${cliente.totalGastado}
                  </td>

                  {/* Celda Detalles (Flecha Escritorio) */}
                  <td className="p-4 md:p-5 block md:table-cell text-right hidden md:table-cell">
                    <div className="p-2 rounded-full bg-[#131313] text-slate-400 inline-flex group-hover:text-[#C9A227] group-hover:bg-[#C9A227]/10 transition-colors">
                      <ChevronRight size={18} />
                    </div>
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

// Icono Helper
const HistoryIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
);

export default AdminHistorial;