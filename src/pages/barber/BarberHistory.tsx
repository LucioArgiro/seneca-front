import { useQuery } from '@tanstack/react-query';
import { turnosApi } from '../../api/turnos';

const BarberHistory = () => {
  const { data: historial, isLoading } = useQuery({
    queryKey: ['historialBarbero'],
    queryFn: turnosApi.getHistorial,
  });

  if (isLoading) return <div className="p-8">Cargando historial...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Historial de Clientes</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="p-4">Fecha</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Servicio</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {historial?.map((turno: any) => (
              <tr key={turno.id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-500">
                    {new Date(turno.fecha).toLocaleDateString()}
                </td>
                <td className="p-4 font-medium text-slate-900">
                    {turno.cliente?.usuario?.fullname}
                </td>
                <td className="p-4 text-slate-600">
                    {turno.servicio?.nombre}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold
                    ${turno.estado === 'COMPLETADO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                  `}>
                    {turno.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarberHistory;