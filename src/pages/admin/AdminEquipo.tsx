import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { barberosApi } from '../../api/barberos';
import { Plus, Trash2, RefreshCcw, Mail, Phone, Edit2, Scissors, AlertTriangle, CheckCircle2 } from 'lucide-react'; // Agregué iconos extra
import { toast } from 'react-hot-toast';
import { StarDisplay } from '../../components/StarDisplay';

export const AdminEquipo = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: barberos, isLoading } = useQuery({
    queryKey: ['barberos-admin'],
    queryFn: barberosApi.getAllAdmin,
  });

  // Estilos Base Luxury para Toasts
  const toastStyles = {
    style: {
      background: '#1F2937',
      color: '#fff',
      border: '1px solid #D4AF37',
    },
    success: { iconTheme: { primary: '#D4AF37', secondary: '#1F2937' } },
    error: { style: { background: '#1F2937', color: '#fff', border: '1px solid #EF4444' } }
  };

  // --- MUTATIONS ---
  const deleteMutation = useMutation({
    mutationFn: barberosApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['barberos-admin'] }),
  });

  const reactivateMutation = useMutation({
    mutationFn: barberosApi.reactivate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['barberos-admin'] }),
  });

  const handleBaja = (id: string, nombre: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px]">
        <div className="flex items-start gap-3">
          <div className="bg-red-900/30 p-2 rounded-full text-red-500">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="font-bold text-white">¿Dar de baja?</p>
            <p className="text-xs text-slate-400 mt-1">
              {nombre} perderá acceso al sistema.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-1">
          {/* Botón CANCELAR */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition"
          >
            Cancelar
          </button>

          {/* Botón CONFIRMAR (Rojo) */}
          <button
            onClick={() => {
              toast.dismiss(t.id); // Cierra el toast de pregunta
              // Lanza la promesa de borrado
              toast.promise(
                deleteMutation.mutateAsync(id),
                {
                  loading: 'Procesando baja...',
                  success: 'Profesional dado de baja',
                  error: 'Error al procesar baja'
                },
                toastStyles
              );
            }}
            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-red-900/20"
          >Confirmar</button>
        </div>
      </div>
    ), {
      duration: 5000, // Se queda 5 seg esperando respuesta
      style: { ...toastStyles.style, padding: '12px' }
    });
  };

  const handleReactivate = (id: string, nombre: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px]">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-900/30 p-2 rounded-full text-emerald-500">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="font-bold text-white">¿Reactivar cuenta?</p>
            <p className="text-xs text-slate-400 mt-1">
              {nombre} volverá a estar activo.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast.promise(
                reactivateMutation.mutateAsync(id),
                {
                  loading: 'Reactivando...',
                  success: 'Profesional reactivado',
                  error: 'Error al reactivar'
                },
                toastStyles
              );
            }}
            className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-emerald-900/20">Reactivar</button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: { ...toastStyles.style, padding: '12px' }
    });
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#131313] text-slate-200">

      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Gestión de Equipo</h1>
          <p className="text-slate-400">Administra a tus profesionales, altas, bajas y métricas de rendimiento.</p>
        </div>

        <button onClick={() => navigate('/admin/equipo/nuevo')} className=" text-[#C9A227] hover:bg-[#C9A227] hover:text-[#111827] text-[#C9A227] px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95  border border-[#C9A227]/50">
          <div className="bg-black/20 p-1 rounded-full border"><Plus size={18} /></div>
          <span>NUEVO BARBERO</span>
        </button>
      </div>

      {/* TABLA DE BARBEROS LUXURY */}
      <div className="bg-[#131313] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-granular-dark text-[#C9A227] uppercase text-xs font-bold tracking-wider">
                <th className="p-5">Profesional</th>
                <th className="p-5">Contacto</th>
                <th className="p-5 text-center">Estado</th>
                <th className="p-5 text-center">Calificación</th>
                <th className="p-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-16 text-center text-[#C9A227] animate-pulse font-bold tracking-widest">CARGANDO EQUIPO...</td></tr>
              ) : barberos?.map((barbero) => (
                <tr key={barbero.id} className="hover:bg-slate-900/50 transition duration-200 group">

                  {/* COLUMNA: PROFESIONAL */}
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 border-2 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${barbero.activo? 'bg-[#131313] text-[#C9A227]' : 'bg-[slate-700] border-slate-600 text-slate-400 grayscale'}`}>
                        {barbero.fotoUrl ? (<img src={barbero.fotoUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />) : (
                          <span className="tracking-tighter">{barbero.usuario.nombre.charAt(0)}{barbero.usuario.apellido.charAt(0)}</span>)}
                      </div>

                      <div>
                        <p className={`font-bold text-base ${barbero.activo ? 'text-white group-hover:text-[#C9A227] transition-colors' : 'text-slate-500'}`}>
                          {barbero.usuario.nombre} {barbero.usuario.apellido}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <Scissors size={12} className={barbero.activo ? "text-[#D4AF37]" : "text-slate-600"} />
                          <span className="uppercase tracking-wide font-medium">{barbero.especialidad || 'Barbero'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* COLUMNA: CONTACTO */}
                  <td className="p-5 text-sm">
                    <div className="flex flex-col gap-1.5">
                      <span className="flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors">
                        <Mail size={14} className="text-slate-500 group-hover:text-[#D4AF37]" />
                        {barbero.usuario.email}
                      </span>
                      <span className="flex items-center gap-2 text-slate-500">
                        <Phone size={14} />
                        {barbero.telefono || 'Sin teléfono'}
                      </span>
                    </div>
                  </td>

                  {/* COLUMNA: ESTADO */}
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${barbero.activo? ' text-[#C9A227]':'text-red-400'}`}> {barbero.activo ? 'ACTIVO' : 'INACTIVO'}</span>
                  </td>

                  {/* COLUMNA: CALIFICACIÓN */}
                  <td className="p-5">
                    <div className="flex justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <StarDisplay rating={barbero.promedio || 0} count={barbero.cantidadResenas || 0} size={16} showCount={true} />
                    </div>
                  </td>

                  {/* COLUMNA: ACCIONES */}
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">

                      <button
                        onClick={() => navigate(`/admin/equipo/editar/${barbero.usuario.id}`)}
                        className="p-2 rounded-lg text-[#C9A227] hover:text-[#C9A227] hover:bg-[#D4AF37]/10 border border-transparent hover:border-[#D4AF37]/30 transition-all" title="Editar información"><Edit2 size={18} /></button>{barbero.activo ? (
                        <button onClick={() => handleBaja(barbero.usuario.id, barbero.usuario.nombre)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 border border-transparent hover:border-red-900/50 transition-all" title="Dar de baja"><Trash2 size={18} /></button>

                      ) : (
                        /* Botón Reactivar -> Llama al Toast interactivo */
                        <button onClick={() => handleReactivate(barbero.usuario.id, barbero.usuario.nombre)} className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-900/20 border border-transparent hover:border-emerald-900/50 transition-all" title="Reactivar">
                          <RefreshCcw size={18} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {barberos?.length === 0 && !isLoading && (
                <tr><td colSpan={5} className="p-16 text-center text-slate-500 italic">No hay barberos registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};