import { useState } from 'react';
import { useClientesCRM, type ClienteCRM } from '../../hooks/useClientesCRM'; 
import { Search, User, ChevronRight, ArrowLeft, Filter, Trophy } from 'lucide-react';

const AdminHistorial = () => {
  const { clientes, barberos, isLoading, filtros } = useClientesCRM();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteCRM | null>(null);
  if (isLoading) return <div className="p-10 text-center text-slate-500">Cargando datos del CRM...</div>;
  if (clienteSeleccionado) {
    return (
      <div className="p-4 md:p-8 w-full min-h-screen bg-slate-50">
        <button 
          onClick={() => setClienteSeleccionado(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-bold"
        >
          <ArrowLeft size={20} /> Volver
        </button>

        {/* Tarjeta VIP */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-6 relative overflow-hidden">
             {clienteSeleccionado.estadoCliente === 'VIP' && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Trophy size={12} /> VIP
                </div>
            )}
            <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl
                    ${clienteSeleccionado.estadoCliente === 'VIP' ? 'bg-yellow-500' : 'bg-blue-600'}`}>
                    {clienteSeleccionado.fullname.charAt(0)}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{clienteSeleccionado.fullname}</h1>
                    <p className="text-slate-500">{clienteSeleccionado.email}</p>
                </div>
            </div>
            {/* Stats Rápidas */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Gastado</p>
                    <p className="text-xl font-bold text-green-600">${clienteSeleccionado.totalGastado}</p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Visitas</p>
                    <p className="text-xl font-bold text-slate-800">{clienteSeleccionado.totalTurnos}</p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Última Vez</p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                        {new Date(clienteSeleccionado.ultimaVisita).toLocaleDateString()}
                    </p>
                 </div>
            </div>
        </div>

        {/* Historial Detallado */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="p-4 text-slate-500">Fecha</th>
                        <th className="p-4 text-slate-500">Servicio</th>
                        <th className="p-4 text-slate-500">Barbero</th>
                        <th className="p-4 text-right text-slate-500">Monto</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {clienteSeleccionado.historial.map(t => (
                        <tr key={t.id}>
                            <td className="p-4 font-bold text-slate-700">{new Date(t.fecha).toLocaleDateString()}</td>
                            <td className="p-4 text-slate-600">{t.servicio?.nombre}</td>
                            <td className="p-4 text-blue-600 font-medium">
                                {t.barbero?.usuario?.nombre || 'Sin asignar'}
                            </td>
                            <td className="p-4 text-right font-mono font-bold text-slate-700">
                                {t.estado === 'COMPLETADO' ? `$${t.servicio?.precio}` : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    );
  }

  // --- VISTA 2: LISTADO GENERAL (CRM) ---
  return (
    <div className="p-4 md:p-8 w-full min-h-screen bg-slate-50">
      
      {/* Header y Filtros */}
      <div className="flex flex-col gap-6 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Inteligencia de Clientes</h1>
            <p className="text-slate-500">Analiza quiénes son tus mejores clientes y su fidelidad.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
             {/* Input Búsqueda (Conectado al Hook) */}
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input 
                    type="text" 
                    placeholder="Buscar cliente..." 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                    value={filtros.busqueda}
                    onChange={e => filtros.setBusqueda(e.target.value)}
                />
             </div>

             {/* Select Barbero (Conectado al Hook) */}
             <div className="relative w-full md:w-64">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <select 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
                    value={filtros.barbero}
                    onChange={e => filtros.setBarbero(e.target.value)}
                >
                    <option value="todos">Todos los Barberos</option>
                    {barberos.map((b: any) => (
                        <option key={b.id} value={b.id}>{b.fullname || b.usuario?.fullname}</option>
                    ))}
                </select>
             </div>
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 hidden md:table-header-group">
                <tr>
                    <th className="p-4 font-bold text-slate-500">Cliente</th>
                    <th className="p-4 font-bold text-slate-500 text-center">Estado</th>
                    <th className="p-4 font-bold text-slate-500 text-center">Visitas</th>
                    <th className="p-4 font-bold text-slate-500 text-right">LTV (Total)</th>
                    <th className="p-4 font-bold text-slate-500 text-right">Acción</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {clientes.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-slate-400">No se encontraron clientes.</td></tr>
                ) : (
                    clientes.map(cliente => (
                        <tr 
                            key={cliente.id} 
                            onClick={() => setClienteSeleccionado(cliente)}
                            className="hover:bg-slate-50 cursor-pointer flex flex-col md:table-row p-4 md:p-0 border-b md:border-none"
                        >
                            <td className="p-4 block md:table-cell">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                                        ${cliente.estadoCliente === 'VIP' ? 'bg-yellow-500' : 'bg-slate-300'}`}>
                                        {cliente.estadoCliente === 'VIP' ? <Trophy size={16}/> : <User size={18}/>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{cliente.fullname}</p>
                                        <p className="text-xs text-slate-400">{cliente.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 block md:table-cell text-left md:text-center">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                                    ${cliente.estadoCliente === 'VIP' ? 'bg-yellow-100 text-yellow-700' : 
                                      cliente.estadoCliente === 'INACTIVO' ? 'bg-red-100 text-red-600' : 
                                      'bg-blue-50 text-blue-600'}`}>
                                    {cliente.estadoCliente}
                                </span>
                            </td>
                            <td className="p-4 block md:table-cell text-left md:text-center font-bold text-slate-700">
                                <span className="md:hidden text-xs text-slate-400 mr-2 uppercase">Visitas:</span>
                                {cliente.totalTurnos}
                            </td>
                            <td className="p-4 block md:table-cell text-left md:text-right font-mono font-bold text-green-600">
                                <span className="md:hidden text-xs text-slate-400 mr-2 uppercase">Gastado:</span>
                                ${cliente.totalGastado}
                            </td>
                            <td className="p-4 block md:table-cell text-right">
                                <ChevronRight className="text-slate-300 ml-auto" />
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