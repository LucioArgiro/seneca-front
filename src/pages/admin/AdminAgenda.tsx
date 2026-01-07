import { useEffect, useState } from 'react';
import { getTurnos, updateEstadoTurno, type TurnoResponse } from '../../api/turnos';
// Asumiendo que tienes una forma de traer la lista de barberos (nombres e IDs)
// Si no la tienes, avísame y creamos ese endpoint rápido.
import { barberosApi } from '../../api/barberos'; 
import { Clock, User, CheckCircle, XCircle, Calendar, Filter, Scissors } from 'lucide-react';

const AdminAgenda = () => {
  const [turnos, setTurnos] = useState<TurnoResponse[]>([]);
  const [barberos, setBarberos] = useState<any[]>([]); // Lista para el select
  const [loading, setLoading] = useState(true);
  
  // 🟢 ESTADO PARA EL FILTRO (Por defecto 'todos')
  const [filtroBarbero, setFiltroBarbero] = useState<string>('todos');

  const cargarDatos = async () => {
    try {
      setLoading(true);
      // 1. Traemos TODOS los turnos
      const data = await getTurnos();
      
      // 2. Traemos la lista de barberos para el dropdown
      // (Si aún no tienes este método en la API, comenta esta línea y el setBarberos)
      try {
         const listaBarberos = await barberosApi.getAll(); // <--- NECESITAS ESTO
         setBarberos(listaBarberos);
      } catch (e) {
         console.log("No se pudo cargar lista de barberos o no existe el endpoint aun");
      }

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

  // 🔍 LÓGICA DE FILTRADO
  const turnosFiltrados = filtroBarbero === 'todos' 
    ? turnos 
    : turnos.filter(t => t.barbero?.id === filtroBarbero);

  return (
    <div className="p-4 md:p-8 w-full min-h-screen bg-slate-50">
      
      {/* HEADER + FILTRO */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Agenda Global</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
                Gestión de turnos de todo el equipo.
            </p>
        </div>

        {/* 🟢 SELECTOR DE BARBERO */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <Filter size={18} className="text-slate-400 ml-2" />
            <select 
                className="bg-transparent outline-none text-slate-700 font-medium text-sm py-1 pr-2 cursor-pointer"
                value={filtroBarbero}
                onChange={(e) => setFiltroBarbero(e.target.value)}
            >
                <option value="todos">Ver Todos los Barberos</option>
                {barberos.map((b: any) => (
                    // Asegúrate de que tu objeto barbero tenga .id y .fullname o .usuario.fullname
                    <option key={b.id} value={b.id}>
                        {b.fullname || b.usuario?.fullname || 'Barbero'}
                    </option>
                ))}
            </select>
        </div>
      </div>
      
      {/* GRID RESPONSIVA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        
        {turnosFiltrados.length === 0 && !loading ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
            <Calendar size={48} className="mb-4 text-slate-200" />
            <p className="text-center">
                {filtroBarbero === 'todos' 
                    ? "No hay turnos pendientes en la barbería." 
                    : "Este barbero no tiene turnos pendientes."}
            </p>
          </div>
        ) : (
          turnosFiltrados.map((turno) => {
            const fechaObj = new Date(turno.fecha);
            const hora = fechaObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
            const dia = fechaObj.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric' });

            return (
              <div 
                key={turno.id} 
                className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* HEADER TARJETA */}
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
                        ${turno.estado === 'CONFIRMADO' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                      {turno.estado}
                    </span>
                  </div>

                  {/* INFO SERVICIO */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1 line-clamp-1">
                        {turno.servicio?.nombre || 'Servicio General'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={14} className="text-blue-500"/> 
                        <span>{turno.servicio?.duracionMinutos || 30} min</span>
                    </div>
                  </div>

                  {/* 🟢 INFO BARBERO (Nuevo: Para saber quién atiende) */}
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
                     <Scissors size={12} />
                     Atiende: <span className="text-slate-600">{turno.barbero?.usuario?.fullname || 'Sin asignar'}</span>
                  </div>

                  {/* INFO CLIENTE */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold shadow-sm shrink-0">
                        <User size={18} />
                    </div>
                    <div className="overflow-hidden min-w-0">
                        <p className="text-sm font-bold text-slate-700 truncate">{turno.cliente?.usuario?.fullname || 'Cliente'}</p>
                        <p className="text-xs text-slate-400 truncate">{turno.cliente?.usuario?.email || 'Sin email'}</p>
                    </div>
                  </div>
                </div>

                {/* BOTONES */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handleEstadoChange(turno.id, 'COMPLETADO')} 
                    className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-2.5 rounded-xl text-xs font-bold transition active:scale-95"
                  >
                    <CheckCircle size={16} /> Completar
                  </button>
                  
                  <button 
                    onClick={() => handleEstadoChange(turno.id, 'CANCELADO')} 
                    className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 py-2.5 rounded-xl text-xs font-bold transition active:scale-95"
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