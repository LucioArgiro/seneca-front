import { useEffect, useState } from 'react';
import { getTurnos, updateEstadoTurno, type TurnoResponse } from '../api/turnos';
import { Clock, User, CheckCircle, XCircle, Calendar } from 'lucide-react';

const AdminAgenda = () => {
  const [turnos, setTurnos] = useState<TurnoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      const data = await getTurnos();
      const activos = data
        .filter(t => t.estado === 'PENDIENTE' || t.estado === 'CONFIRMADO')
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      
      setTurnos(activos);
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);
  const handleEstadoChange = async (id: string, nuevoEstado: any) => {
    const accion = nuevoEstado === 'COMPLETADO' ? 'completar' : 'cancelar';
    if (!confirm(`¿Estás seguro de ${accion} este turno?`)) return;
    try {
      await updateEstadoTurno(id, nuevoEstado);
      cargarDatos(); 
    } catch (error) { alert('Error al actualizar'); }
  };
  return (
    <div className="p-8 w-full min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Agenda Activa</h1>
        <p className="text-slate-500 mt-1">
            {turnos.length === 0 
                ? 'No hay clientes esperando. Todo tranquilo.' 
                : `Tienes ${turnos.length} turno${turnos.length > 1 ? 's' : ''} programados para atender.`
            }
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {turnos.length === 0 && !loading ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
            <Calendar size={48} className="mb-4 text-slate-200" />
            <p>No hay turnos pendientes por ahora.</p>
          </div>
        ) : (
          turnos.map((turno) => {
            const fechaObj = new Date(turno.fecha);
            // Formato de hora limpio (14:30)
            const hora = fechaObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
            // Formato de fecha (Lunes 12)
            const dia = fechaObj.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric' });

            return (
              <div 
                key={turno.id} 
                className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* HEADER TARJETA: HORA Y ESTADO */}
                  <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-4">
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-slate-800 tracking-tighter">
                            {hora} <span className="text-xs text-slate-400 font-normal">hs</span>
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase capitalize">
                            {dia}
                        </span>
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border
                        ${turno.estado === 'CONFIRMADO' 
                            ? 'bg-blue-50 text-blue-600 border-blue-100' 
                            : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                        }`}
                    >
                      {turno.estado}
                    </span>
                  </div>

                  {/* INFO SERVICIO */}
                  <div className="mb-6">
                    <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1">
                        {turno.servicio?.nombre || 'Servicio General'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={14} className="text-blue-500"/> 
                        <span>{turno.servicio?.duracionMinutos || 30} min estimados</span>
                    </div>
                  </div>

                  {/* INFO CLIENTE (Card dentro de Card) */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold shadow-sm">
                        <User size={18} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-700 truncate">{turno.cliente?.fullname}</p>
                        <p className="text-xs text-slate-400 truncate">{turno.cliente?.email}</p>
                    </div>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handleEstadoChange(turno.id, 'COMPLETADO')} 
                    className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-2.5 rounded-xl text-xs font-bold transition group-hover:border-green-300"
                  >
                    <CheckCircle size={14} /> Completar
                  </button>
                  
                  <button 
                    onClick={() => handleEstadoChange(turno.id, 'CANCELADO')} 
                    className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 py-2.5 rounded-xl text-xs font-bold transition"
                  >
                    <XCircle size={14} /> Cancelar
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminAgenda;