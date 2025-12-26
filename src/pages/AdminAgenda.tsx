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
    // CAMBIO 1: Padding dinámico (p-4 en móvil, p-8 en PC)
    <div className="p-4 md:p-8 w-full min-h-screen bg-slate-50">
      
      {/* HEADER */}
      <div className="mb-6 md:mb-8">
        {/* CAMBIO 2: Tamaño de texto dinámico */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Agenda Activa</h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base">
            {turnos.length === 0 
                ? 'No hay clientes esperando. Todo tranquilo.' 
                : `Tienes ${turnos.length} turno${turnos.length > 1 ? 's' : ''} programados.`
            }
        </p>
      </div>
      
      {/* CAMBIO 3: Grid responsiva
          - grid-cols-1: 1 columna en celular (por defecto)
          - md:grid-cols-2: 2 columnas en tablets
          - lg:grid-cols-3: 3 columnas en laptops pequeñas
          - xl:grid-cols-4: 4 columnas en monitores grandes
          - gap-4: menos espacio entre tarjetas en móvil
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        
        {turnos.length === 0 && !loading ? (
          <div className="col-span-full flex flex-col items-center justify-center p-8 md:p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
            <Calendar size={48} className="mb-4 text-slate-200" />
            <p className="text-center">No hay turnos pendientes por ahora.</p>
          </div>
        ) : (
          turnos.map((turno) => {
            const fechaObj = new Date(turno.fecha);
            const hora = fechaObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
            const dia = fechaObj.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric' });

            return (
              <div 
                key={turno.id} 
                className="group bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* HEADER TARJETA */}
                  <div className="flex justify-between items-start mb-3 md:mb-4 border-b border-slate-50 pb-3 md:pb-4">
                    <div className="flex flex-col">
                        <span className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tighter">
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
                        }`}>
                      {turno.estado}
                    </span>
                  </div>

                  {/* INFO SERVICIO */}
                  <div className="mb-4 md:mb-6">
                    <h3 className="font-bold text-base md:text-lg text-slate-800 leading-tight mb-1 line-clamp-1">
                        {turno.servicio?.nombre || 'Servicio General'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={14} className="text-blue-500"/> 
                        <span>{turno.servicio?.duracionMinutos || 30} min</span>
                    </div>
                  </div>

                  {/* INFO CLIENTE */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3 mb-4 md:mb-6">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold shadow-sm shrink-0">
                        <User size={16} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <div className="overflow-hidden min-w-0"> {/* min-w-0 ayuda al truncate en flex */}
                        <p className="text-sm font-bold text-slate-700 truncate">{turno.cliente?.fullname}</p>
                        <p className="text-xs text-slate-400 truncate">{turno.cliente?.email}</p>
                    </div>
                  </div>
                </div>

                {/* BOTONES (Touch targets más grandes para dedos) */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handleEstadoChange(turno.id, 'COMPLETADO')} 
                    // py-3 en móvil para facilitar el toque con el dedo
                    className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-3 md:py-2.5 rounded-xl text-xs font-bold transition active:scale-95"
                  >
                    <CheckCircle size={16} /> Completar
                  </button>
                  
                  <button 
                    onClick={() => handleEstadoChange(turno.id, 'CANCELADO')} 
                    className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 py-3 md:py-2.5 rounded-xl text-xs font-bold transition active:scale-95"
                  >
                    <XCircle size={16} /> Cancelar
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