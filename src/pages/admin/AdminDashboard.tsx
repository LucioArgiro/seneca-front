import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import {DollarSign, Users, Calendar, TrendingUp, Scissors, ArrowUpRight, ArrowDownRight, Activity, Loader2} from 'lucide-react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

// --- COMPONENTE DE TARJETA KPI (Reutilizable) ---
const KpiCard = ({ title, value, subtext, icon: Icon, trend, color = "#C9A227" }: any) => (
    <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#C9A227]/30 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl md:text-3xl font-black text-white">{value}</h3>
            </div>
            <div className={`p-3 bg-[#131313] rounded-xl text-[${color}] group-hover:scale-110 transition-transform`} style={{ color: color }}>
                <Icon size={24} />
            </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
            {trend !== undefined && (
                <span className={`flex items-center font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(trend)}%
                </span>
            )}
            <span className="text-zinc-600">{subtext}</span>
        </div>
    </div>
);

export const AdminDashboard = () => {
    // 1. Hook para traer los datos del backend
    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/admin');
            return data;
        },
        // Refrescar datos cada 5 minutos automáticamente
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <Loader2 className="animate-spin text-[#C9A227]" size={40} />
        </div>
    );

    if (isError) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-red-500">
            Error al cargar el dashboard. Verifica tu conexión o permisos.
        </div>
    );

    // Formatear valores de moneda
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 pb-20">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white">Dashboard General</h1>
                    <p className="text-zinc-400">Resumen de actividad de <span className="text-[#C9A227]">Barbería Séneca</span>.</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold bg-[#C9A227]/10 text-[#C9A227] px-3 py-1 rounded-full border border-[#C9A227]/20">
                        {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* 1. GRID DE KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Ingresos Estimados"
                    value={formatCurrency(stats?.kpis?.ingresosTotales || 0)}
                    subtext="Total facturado este mes"
                    icon={DollarSign}
                    trend={12.5} // Puedes calcular esto si traes datos del mes anterior
                />
                <KpiCard
                    title="Turnos Completados"
                    value={stats?.kpis?.turnosCompletados || 0}
                    subtext={`De ${stats?.kpis?.turnosTotales || 0} totales`}
                    icon={Scissors}
                    color="#3b82f6"
                />
                <KpiCard
                    title="Nuevos Clientes"
                    value={stats?.kpis?.clientesNuevos || 0}
                    subtext="Registrados este mes"
                    icon={Users}
                    color="#10b981"
                />
                <KpiCard
                    title="Tasa Cancelación"
                    value={`${stats?.kpis?.tasaCancelacion || 0}%`}
                    subtext="Objetivo: < 5%"
                    icon={Activity}
                    color="#ef4444"
                    trend={-2.1} // Negativo aquí es bueno
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 2. GRÁFICO PRINCIPAL (Ocupa 2 columnas) */}
                <div className="lg:col-span-2 bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <TrendingUp size={18} className="text-[#C9A227]" /> Flujo de Ingresos (Mes Actual)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.grafico || []}>
                                <defs>
                                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C9A227" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="fecha"
                                    stroke="#666"
                                    tick={{ fill: '#666', fontSize: 10 }}
                                    tickFormatter={(val) => val ? val.split('-')[2] : ''} // Solo muestra el día
                                />
                                <YAxis
                                    stroke="#666"
                                    tick={{ fill: '#666', fontSize: 10 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#131313', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                                    itemStyle={{ color: '#C9A227', fontWeight: 'bold' }}
                                    formatter={(value: any) => [formatCurrency(Number(value)), 'Ingresos']}
                                    labelFormatter={(label) => `Fecha: ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#C9A227"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorIngresos)"
                                    activeDot={{ r: 6, fill: '#fff', stroke: '#C9A227' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. RANKING BARBEROS (Ocupa 1 columna) */}
                <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Users size={18} className="text-[#C9A227]" /> Top Profesionales
                    </h3>
                    <div className="space-y-4">
                        {stats?.ranking?.length > 0 ? (
                            stats.ranking.map((barbero: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-[#131313] hover:bg-[#222] transition-colors border border-white/5 hover:border-[#C9A227]/20 group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-inner
                        ${index === 0 ? 'bg-[#C9A227] text-black shadow-[#C9A227]/20' : 'bg-zinc-800 text-zinc-400'}`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-[#C9A227] transition-colors">{barbero.nombre} {barbero.apellido}</p>
                                            <p className="text-[10px] text-zinc-500">{barbero.cantidad} turnos finalizados</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-2 py-1 rounded border border-[#C9A227]/20">
                                        {formatCurrency(Number(barbero.ingresos))}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-sm text-center py-10">No hay datos de ranking aún.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* 4. PRÓXIMOS TURNOS */}
            <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#181818]">
                    <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Calendar size={18} className="text-[#C9A227]" /> Próximos Turnos (Confirmados)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-[#131313]">
                            <tr>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Servicio</th>
                                <th className="px-6 py-4">Profesional</th>
                                <th className="px-6 py-4">Horario</th>
                                <th className="px-6 py-4 text-right">Precio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats?.proximosTurnos?.length > 0 ? (
                                stats.proximosTurnos.map((turno: any) => (
                                    <tr key={turno.id} className="hover:bg-[#1f1f1f] transition-colors group">
                                        <td className="px-6 py-4 font-medium text-white group-hover:text-[#C9A227] transition-colors">
                                            {turno.cliente?.usuario?.nombre} {turno.cliente?.usuario?.apellido}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">{turno.servicio?.nombre}</td>
                                        <td className="px-6 py-4 text-zinc-400">{turno.barbero?.usuario?.nombre}</td>
                                        <td className="px-6 py-4 text-white">
                                            {new Date(turno.fecha).toLocaleDateString()} - {new Date(turno.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-[#C9A227] font-bold text-right">{formatCurrency(Number(turno.servicio?.precio))}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No hay turnos confirmados próximos.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;