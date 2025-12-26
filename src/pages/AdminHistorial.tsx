import { useEffect, useState } from 'react';
import { getTurnos, type TurnoResponse } from '../api/turnos';
import { Search, User, ChevronRight, ArrowLeft, Calendar } from 'lucide-react';

// Interfaz auxiliar para agrupar datos
interface ClienteGroup {
  id: string;
  fullname: string;
  email: string;
  totalTurnos: number;
  ultimaVisita: string;
  historial: TurnoResponse[];
}

const AdminHistorial = () => {
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<ClienteGroup[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteGroup | null>(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getTurnos();
        const pasados = data.filter(t => t.estado === 'COMPLETADO' || t.estado === 'CANCELADO');
        const grupos = pasados.reduce((acc, turno) => {
          const clienteId = turno.cliente?.id;
          if (!clienteId) return acc;

          if (!acc[clienteId]) {
            acc[clienteId] = {
              id: clienteId,
              fullname: turno.cliente!.fullname,
              email: turno.cliente!.email || 'Sin email',
              totalTurnos: 0,
              ultimaVisita: turno.fecha,
              historial: []
            };
          }
          acc[clienteId].historial.push(turno);
          acc[clienteId].totalTurnos += 1;
          if (new Date(turno.fecha) > new Date(acc[clienteId].ultimaVisita)) {
            acc[clienteId].ultimaVisita = turno.fecha;
          }
          return acc;
        }, {} as Record<string, ClienteGroup>);
        const listaClientes = Object.values(grupos).sort((a, b) => 
            new Date(b.ultimaVisita).getTime() - new Date(a.ultimaVisita).getTime()
        );
        setClientes(listaClientes);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const clientesFiltrados = clientes.filter(c => 
    c.fullname.toLowerCase().includes(busqueda.toLowerCase()) || 
    c.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- VISTA 1: DETALLE DEL CLIENTE (FICHA) ---
  if (clienteSeleccionado) {
    return (
      // Padding dinámico: p-4 en móvil, p-8 en escritorio
      <div className="p-4 md:p-8 w-full min-h-screen bg-slate-50">
        <button 
          onClick={() => setClienteSeleccionado(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition font-bold py-2"
        >
          <ArrowLeft size={20} /> Volver al directorio
        </button>

        {/* Tarjeta de Perfil Responsiva */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-2 text-center md:text-left">
                <div className="w-20 h-20 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl md:text-2xl shrink-0">
                    {clienteSeleccionado.fullname.charAt(0)}
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{clienteSeleccionado.fullname}</h1>
                    <p className="text-slate-500 break-all">{clienteSeleccionado.email}</p>
                </div>
            </div>
            
            {/* Estadísticas en Grid (1 col móvil, auto en PC) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:flex gap-4 md:gap-6 text-sm">
                <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-center md:text-left">
                    <span className="block text-slate-400 text-xs font-bold uppercase">Visitas Totales</span>
                    <span className="text-xl font-bold text-slate-800">{clienteSeleccionado.totalTurnos}</span>
                </div>
                <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-center md:text-left">
                    <span className="block text-slate-400 text-xs font-bold uppercase">Última Visita</span>
                    <span className="text-xl font-bold text-slate-800">
                        {new Date(clienteSeleccionado.ultimaVisita).toLocaleDateString('es-AR')}
                    </span>
                </div>
            </div>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 px-1">Historial de Citas</h3>
        
        {/* TABLA SCROLLABLE HORIZONTALMENTE PARA MÓVILES */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px] md:min-w-0">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase">Fecha</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase">Servicio</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase">Barbero</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase text-center">Estado</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase text-right">Precio</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clienteSeleccionado.historial.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-slate-700 font-bold whitespace-nowrap">
                                    {new Date(t.fecha).toLocaleDateString('es-AR')} <span className="text-slate-400 font-normal ml-1">{new Date(t.fecha).toLocaleTimeString('es-AR', {hour:'2-digit', minute:'2-digit'})}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{t.servicio?.nombre}</td>
                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{t.barbero?.fullname}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border
                                        ${t.estado === 'COMPLETADO' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                                    >
                                        {t.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-slate-600 whitespace-nowrap">
                                    {t.estado === 'COMPLETADO' ? `$${t.servicio?.precio}` : <span className="line-through opacity-50">${t.servicio?.precio}</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    );
  }

  // --- VISTA 2: LISTA DE CLIENTES (DIRECTORIO) ---
  return (
    <div className="p-4 md:p-8 w-full min-h-screen bg-slate-50">
      
      {/* Header apilado en móvil */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Cartera de Clientes</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Directorio de personas que han visitado tu barbería.</p>
        </div>
        <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" placeholder="Buscar cliente..." 
                className="w-full pl-10 pr-4 py-3 md:py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 shadow-sm transition"
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
            {/* Ocultamos el header de la tabla en móvil (hidden md:table-header-group) */}
            <thead className="bg-slate-50 border-b border-slate-100 hidden md:table-header-group">
                <tr>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase">Cliente</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase text-center">Visitas</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase">Última Vez</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase text-right">Acción</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 block md:table-row-group">
                {clientesFiltrados.length === 0 && !loading ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 block md:table-cell">No se encontraron clientes.</td></tr>
                ) : (
                    clientesFiltrados.map((cliente) => (
                        <tr 
                            key={cliente.id} 
                            // En móvil: flex column (tarjeta). En PC: table-row
                            className="hover:bg-slate-50 transition group cursor-pointer flex flex-col md:table-row p-4 md:p-0 border-b md:border-none last:border-0"
                            onClick={() => setClienteSeleccionado(cliente)}
                        >
                            {/* CELDA CLIENTE */}
                            <td className="md:px-6 md:py-4 block md:table-cell mb-3 md:mb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition shrink-0">
                                        <User size={18} />
                                    </div>
                                    <div className="min-w-0"> {/* min-w-0 para truncate */}
                                        <p className="font-bold text-slate-800 truncate">{cliente.fullname}</p>
                                        <p className="text-xs text-slate-400 truncate">{cliente.email}</p>
                                    </div>
                                </div>
                            </td>

                            {/* CELDA VISITAS (Móvil: flex row con label) */}
                            <td className="md:px-6 md:py-4 block md:table-cell mb-2 md:mb-0 text-center md:text-center">
                                <div className="flex justify-between items-center md:block">
                                    <span className="md:hidden text-xs font-bold text-slate-400 uppercase">Visitas:</span>
                                    <span className="inline-block bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full text-xs">
                                        {cliente.totalTurnos}
                                    </span>
                                </div>
                            </td>

                            {/* CELDA FECHA (Móvil: flex row con label) */}
                            <td className="md:px-6 md:py-4 text-slate-600 block md:table-cell mb-2 md:mb-0">
                                <div className="flex justify-between items-center md:block">
                                    <span className="md:hidden text-xs font-bold text-slate-400 uppercase">Última vez:</span>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400 hidden md:block"/>
                                        {new Date(cliente.ultimaVisita).toLocaleDateString('es-AR')}
                                    </div>
                                </div>
                            </td>

                            {/* CELDA ACCIÓN */}
                            <td className="md:px-6 md:py-4 text-right block md:table-cell mt-2 md:mt-0">
                                <button className="w-full md:w-auto text-blue-600 font-bold text-xs flex items-center justify-center md:justify-end gap-1 hover:underline py-2 md:py-0 bg-blue-50 md:bg-transparent rounded-lg md:rounded-none">
                                    Ver Historial <ChevronRight size={14} />
                                </button>
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

export default AdminHistorial;