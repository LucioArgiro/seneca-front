import { useState, useEffect, useRef } from 'react';
import { useCaja } from '../hooks/useCaja';
import { StatCard } from '../components/caja/StatCard';
import { ModalNuevoMovimiento } from '../components/caja/ModalNuevoMovimiento';
import { useAuthStore } from '../store/auth';
import { cajaApi } from '../api/caja'; // Asegúrate de importar la API aquí
import { toast } from 'react-hot-toast';
import {Wallet, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight, Loader2, Calendar, Users, ChevronDown, FileText, Check, User, FileSpreadsheet, CreditCard} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import dayjs from 'dayjs';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

interface Props {
  role: 'ADMIN' | 'BARBER';
}

// --- SELECTOR MEJORADO ---
const CajaSelect = ({ selectedId, onChange, listaCajas }: { selectedId: string, onChange: (val: string) => void, listaCajas: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const barberosDisponibles = listaCajas.filter(c => c.usuario && c.usuario.role !== 'ADMIN');

  const getLabel = () => {
    if (selectedId === 'CENTRAL' || !selectedId) return 'Caja Central (Negocio)';
    const found = barberosDisponibles.find(c => c.usuario?.id === selectedId);
    return found ? `Caja de ${found.usuario.nombre} ${found.usuario.apellido}` : 'Caja Central (Negocio)';
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full lg:w-fit" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 bg-[#1A1A1A] p-2 pr-4 rounded-xl border transition-all w-full lg:min-w-[280px]
            ${isOpen ? 'border-[#C9A227] ring-1 ring-[#C9A227]' : 'border-white/10 hover:border-white/20'}`}
      >
        <div className="bg-[#252525] p-2 rounded-lg text-[#C9A227] shrink-0">
          <Users size={16} />
        </div>
        <span className="text-sm font-bold text-white truncate flex-1 text-left">{getLabel()}</span>
        <ChevronDown size={16} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180 text-[#C9A227]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden custom-scrollbar max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          <div
            onClick={() => handleSelect('CENTRAL')}
            className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors border-b border-white/5
                ${(selectedId === 'CENTRAL' || !selectedId) ? 'bg-[#C9A227]/10 text-[#C9A227]' : 'text-zinc-300 hover:bg-[#C9A227] hover:text-[#131313]'}`}
          >
            <span className="font-bold">Caja Central (Negocio)</span>
            {(selectedId === 'CENTRAL' || !selectedId) && <Check size={16} />}
          </div>

          {barberosDisponibles.length > 0 && (
            <p className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-black/20">
              Ver cuentas de Barberos
            </p>
          )}

          {barberosDisponibles.map((cajaItem: any) => (
            <div
              key={cajaItem.id}
              onClick={() => handleSelect(cajaItem.usuario.id)}
              className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors
                    ${selectedId === cajaItem.usuario.id ? 'bg-[#C9A227]/10 text-[#C9A227]' : 'text-zinc-300 hover:bg-[#C9A227] hover:text-[#131313]'}`}
            >
              <span>{cajaItem.usuario.nombre} {cajaItem.usuario.apellido}</span>
              {selectedId === cajaItem.usuario.id && <Check size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- DASHBOARD PRINCIPAL ---
export const CajaDashboard = ({ role }: Props) => {
  const { usuario: authUser } = useAuthStore();

  const {
    caja,
    movimientos,
    isLoading,
    registrarMovimiento,
    isRegistering,
    listaCajas,
    selectedCajaId,
    setSelectedCajaId
  } = useCaja(role, role === 'ADMIN' ? 'CENTRAL' : '');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // KPIs
  const movimientosMes = movimientos.filter(m => dayjs(m.fecha).isSame(dayjs(), 'month'));
  const ingresosMes = movimientosMes.filter(m => m.tipo === 'INGRESO').reduce((acc, m) => acc + Number(m.monto), 0);
  const egresosMes = movimientosMes.filter(m => m.tipo === 'EGRESO').reduce((acc, m) => acc + Number(m.monto), 0);

  // Datos Gráfico
  const dataPie = movimientos.reduce((acc: any[], curr) => {
    const concepto = curr.concepto || curr.tipo;
    const found = acc.find(i => i.name === concepto);
    if (found) found.value += Number(curr.monto);
    else acc.push({ name: concepto, value: Number(curr.monto) });
    return acc;
  }, []);

  const handleNuevoMovimiento = (data: any) => {
    let targetUserId = selectedCajaId;

    if (role === 'BARBER') {
      targetUserId = authUser?.id || '';
    } else {
      if (targetUserId === 'CENTRAL' || !targetUserId) targetUserId = '';
    }

    registrarMovimiento({
      ...data,
      usuarioId: targetUserId || undefined
    }, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  // 👇👇 NUEVA FUNCIÓN: EXPORTAR EXCEL 👇👇
  const handleExportar = async () => {
    try {
        const fechaActual = dayjs();
        const mes = fechaActual.month() + 1; 
        const anio = fechaActual.year();
        
        // Usamos el ID de la caja que estamos viendo actualmente
        const idParaReporte = caja?.id; 

        if (!idParaReporte) return toast.error("Cargando datos...");

        toast.loading("Generando Excel...", { id: 'export-toast' });
        await cajaApi.downloadExcel(idParaReporte, mes, anio);
        toast.dismiss('export-toast');
        toast.success("¡Reporte descargado!");
    } catch (error) {
        toast.dismiss('export-toast');
        toast.error("Error al exportar");
        console.error(error);
    }
  };
  // 👆👆 FIN DE LA FUNCIÓN 👆👆

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#131313]"><Loader2 className="animate-spin text-[#C9A227]" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#131313] p-4 md:p-8 font-sans pb-24 text-slate-200">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 md:mb-8">
        <div className="w-full lg:w-auto">
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            {role === 'ADMIN' ? 'Panel Financiero' : 'Mi Caja'}
          </h1>

          {role === 'ADMIN' && (
            <div className="mt-4">
              <CajaSelect
                selectedId={selectedCajaId}
                onChange={setSelectedCajaId}
                listaCajas={listaCajas}
              />
            </div>
          )}

          {role !== 'ADMIN' && <p className="text-zinc-500 text-sm mt-1">Tu balance personal.</p>}
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            
            {/* BOTÓN EXPORTAR EXCEL (Nuevo) */}
            <button 
                onClick={handleExportar} 
                className="w-full lg:w-auto text-emerald-400 hover:bg-emerald-400 hover:text-[#131313] px-5 py-3 lg:py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 transform hover:-translate-y-0.5 border border-emerald-400/50"
            >
                <div className="bg-black/20 p-1 rounded-full border border-emerald-400/30">
                    <FileSpreadsheet size={18} />
                </div> 
                Exportar Mes
            </button>

            {/* BOTÓN NUEVO MOVIMIENTO */}
            <button onClick={() => setIsModalOpen(true)} className="w-full lg:w-auto text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] px-5 py-3 lg:py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 transform hover:-translate-y-0.5 border border-[#C9A227]/50">
                <div className="bg-black/20 p-1 rounded-full border border-[#C9A227]/30">
                    <Plus size={18} />
                </div> 
                Nuevo Movimiento
            </button>
        </div>
      </div>

     {/* TARJETAS KPI */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${caja?.seniasMes !== undefined ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 md:gap-6 mb-6 md:mb-8`}>
        
        <StatCard
          title={(!selectedCajaId || selectedCajaId === 'CENTRAL') ? "Saldo Real en Caja" : "Saldo Virtual (Cuenta)"}
          value={Number(caja?.saldo || 0)}
          icon={Wallet} color="blue"
          subtext={role === 'ADMIN' && (!selectedCajaId || selectedCajaId === 'CENTRAL') ? "Dinero físico total" : "Balance acumulado"}
        />
        
        {/* Aclaramos que son Ingresos Físicos para que no se confundan con la seña */}
        <StatCard title="Ingresos Físicos (Mes)" value={ingresosMes} icon={TrendingUp} color="green" subtext="Entradas en mano" />
        
        <StatCard title="Egresos (Mes)" value={egresosMes} icon={TrendingDown} color="orange" subtext="Salidas" />

        {/* 👇 NUEVA TARJETA: Solo aparece en las vistas de Barberos 👇 */}
        {caja?.seniasMes !== undefined && (
          <StatCard 
            title="Señas en Admin (Mes)" 
            value={Number(caja.seniasMes)} 
            icon={CreditCard} 
            color="purple" // Un color distinto para separarlo del efectivo
            subtext="Dinero seguro en el sistema" 
          />
        )}
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">

        {/* GRÁFICO */}
        <div className="xl:col-span-2 bg-[#1A1A1A] p-5 md:p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col h-[400px] lg:h-[500px]">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2 shrink-0 text-sm md:text-base">
            <TrendingUp size={18} className="text-[#C9A227]" /> Distribución
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataPie} cx="50%" cy="50%" innerRadius={isMobile ? 60 : 80} outerRadius={isMobile ? 80 : 120} paddingAngle={5} dataKey="value" stroke="none">
                  {dataPie.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value}`, 'Monto']} contentStyle={{ backgroundColor: '#131313', borderRadius: '12px', border: '1px solid #C9A227', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LISTA HISTORIAL */}
        <div className="bg-[#1A1A1A] p-5 md:p-6 rounded-2xl border border-white/5 shadow-lg overflow-hidden flex flex-col h-[500px]">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2 shrink-0 text-sm md:text-base">
            <Calendar size={18} className="text-[#C9A227]" /> Historial Reciente
          </h3>
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {movimientos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                <FileText size={40} className="mb-2 opacity-20" />
                <p className="text-sm">Sin movimientos</p>
              </div>
            ) : (
              movimientos.map((mov) => {
                const isExpanded = expandedId === mov.id;
                const esIngreso = mov.tipo === 'INGRESO';
                return (
                  <div key={mov.id} className={`rounded-xl border transition-all duration-200 overflow-hidden 
                    ${isExpanded ? 'bg-[#252525] border-[#C9A227]/30' : 'bg-[#131313] border-white/5 hover:bg-[#1E1E1E]'}`}>
                    <div onClick={() => toggleExpand(mov.id)} className="p-3 flex items-center justify-between cursor-pointer group select-none">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${esIngreso ? 'bg-emerald-900/20 text-emerald-400' : 'bg-red-900/20 text-red-400'}`}>
                          {esIngreso ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white text-xs md:text-sm truncate">{mov.concepto}</p>
                            
                            {/* AQUÍ ESTÁ EL CAMBIO VISUAL DEL USUARIO QUE ACORDAMOS ANTES */}
                            <span className="text-[9px] bg-white/10 text-zinc-400 px-1.5 rounded-sm flex items-center gap-1">
                                <User size={9} /> {mov.usuario?.nombre || 'Web / Sistema'}
                            </span>

                          </div>
                          <p className="text-[10px] md:text-xs text-zinc-500 truncate mt-0.5">{mov.descripcion || '...'}</p>
                        </div>
                      </div>
                      <div className="text-right pl-2">
                        <span className={`block font-bold text-xs md:text-sm whitespace-nowrap ${esIngreso ? 'text-emerald-400' : 'text-zinc-300'}`}>
                          {esIngreso ? '+' : '-'} ${mov.monto}
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-0 text-xs text-zinc-400 bg-[#111] p-2 mx-0 mb-0 border-t border-white/5">
                        <p className="italic">"{mov.descripcion}"</p>
                        <div className="flex gap-2 mt-2">
                          <span className="bg-white/10 px-1 rounded text-[10px]">{dayjs(mov.fecha).format('DD/MM HH:mm')}</span>
                          {mov.metodoPago && <span className="bg-white/10 px-1 rounded text-[10px]">{mov.metodoPago}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <ModalNuevoMovimiento isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleNuevoMovimiento} isProcessing={isRegistering} />
    </div>
  );
};