
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { barberosApi } from '../../api/barberos';
import { Plus, Trash2, RefreshCcw, Mail, Phone, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { StarDisplay } from '../../components/StarDisplay';


export const AdminEquipo = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: barberos, isLoading } = useQuery({
    queryKey: ['barberos-admin'], // Clave única para esta lista
    queryFn: barberosApi.getAllAdmin,
  });

  // 2. MUTATION: Dar de Baja
  const deleteMutation = useMutation({
    mutationFn: barberosApi.delete,
    onSuccess: () => {
      toast.success('Barbero dado de baja');
      queryClient.invalidateQueries({ queryKey: ['barberos-admin'] }); // Recarga la lista sola
    },
    onError: () => toast.error('Error al dar de baja')
  });

  // 3. MUTATION: Reactivar
  const reactivateMutation = useMutation({
    mutationFn: barberosApi.reactivate,
    onSuccess: () => {
      toast.success('Profesional reactivado');
      queryClient.invalidateQueries({ queryKey: ['barberos-admin'] });
    },
    onError: () => toast.error('Error al reactivar')
  });

  const handleBaja = (id: string) => {
    if (confirm('¿Dar de baja a este profesional?')) deleteMutation.mutate(id);
  };

  const handleReactivate = (id: string) => {
    if (confirm('¿Reactivar a este profesional?')) reactivateMutation.mutate(id);
  };

  return (
    <div className="p-6">
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestión de Equipo</h1>
          <p className="text-slate-500">Administra a tus profesionales, altas, bajas y métricas.</p>
        </div>
        <button
          onClick={() => navigate('/admin/equipo/nuevo')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={20} /> Nuevo Barbero
        </button>
      </div>

      {/* TABLA DE BARBEROS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Profesional</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Calificación</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Cargando equipo...</td></tr>
              ) : barberos?.map((barbero) => (
                <tr key={barbero.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${barbero.activo ? 'bg-blue-600' : 'bg-slate-400'}`}>
                        {barbero.fotoUrl ? (
                          <img src={barbero.fotoUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          barbero.usuario.nombre.charAt(0),
                           barbero.usuario.apellido.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className={`font-bold ${barbero.activo ? 'text-slate-800' : 'text-slate-500'}`}>{barbero.usuario.nombre} {barbero.usuario.apellido}</p>
                        <p className="text-xs text-slate-400">{barbero.especialidad}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1"><Mail size={12} /> {barbero.usuario.email}</span>
                      <span className="flex items-center gap-1 text-slate-400"><Phone size={12} /> {barbero.telefono || '--'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${barbero.activo
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                      {barbero.activo ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </td>
                  <td className="p-4">
                    <StarDisplay rating={barbero.promedio || 0} count={barbero.cantidadResenas || 0} size={14} showCount={true} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">

                      {/* 👇 BOTÓN EDITAR (NUEVO) */}
                      <button
                        onClick={() => navigate(`/admin/equipo/editar/${barbero.usuario.id}`)}
                        className="text-slate-400 hover:text-blue-600 p-2 transition bg-slate-50 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100"
                        title="Editar información"
                      >
                        <Edit2 size={18} />
                      </button>
                      {barbero.activo ? (
                        <button
                          onClick={() => handleBaja(barbero.usuario.id)}
                          className="text-slate-400 hover:text-red-600 p-2 transition bg-slate-50 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100"
                          title="Dar de baja"
                        >
                          <Trash2 size={18} />
                        </button>

                      ) : (
                        <button
                          onClick={() => handleReactivate(barbero.usuario.id)}
                          className="text-slate-400 hover:text-green-600 p-2 transition bg-slate-50 hover:bg-green-50 rounded-lg border border-transparent hover:border-green-100"
                          title="Reactivar"
                        >
                          <RefreshCcw size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {barberos?.length === 0 && !isLoading && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No hay barberos registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};