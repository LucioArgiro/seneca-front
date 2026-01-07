import { useQuery } from '@tanstack/react-query';
import { turnosApi } from '../../api/turnos';
import { Clock, User } from 'lucide-react';

const BarberAgenda = () => {
  const { data: turnos, isLoading, isError } = useQuery({
    queryKey: ['agendaBarbero'],
    queryFn: turnosApi.getAgenda,
  });

  if (isLoading) return <div className="p-8 text-center">Cargando tu agenda...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error al cargar turnos</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Agenda de Turnos (Pendientes)</h1>
      
      {turnos?.length === 0 ? (
        <p className="text-slate-500">No tienes turnos próximos.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {turnos?.map((turno: any) => (
            <div key={turno.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                  {new Date(turno.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  {new Date(turno.fecha).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <User size={16} className="text-slate-400"/>
                <p className="font-bold text-slate-800">{turno.cliente?.usuario?.fullname || 'Cliente'}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={16} />
                <p>{turno.servicio?.nombre || 'Servicio'}</p>
              </div>

              {/* Aquí podrías agregar botones para completar/cancelar */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BarberAgenda;