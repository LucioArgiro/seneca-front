import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { barberosApi } from '../../api/barberos';
import { User, Mail, Lock, Hash, Phone, Calendar, Users, Briefcase, Save, CalendarDays, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AgendaSelector } from '../../components/admin/AgendaSelector';

export const AdminEditBarber = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estado del formulario
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '', // Se mantiene vacío a menos que quiera cambiarla
    dni: '',
    telefono: '',
    edad: 18,
    sexo: 'M',
    biografia: '',
    especialidad: ''
  });

  const [horarios, setHorarios] = useState<any[]>([]);

  // 1. CARGAR DATOS DEL BARBERO
  const { data: barbero, isLoading, isError } = useQuery({
    queryKey: ['barbero', id],
    queryFn: () => barberosApi.getOne(id!), // Asumiendo que tienes este método
    enabled: !!id, // Solo ejecuta si hay ID
  });

  // 2. RELLENAR FORMULARIO CUANDO LLEGAN LOS DATOS
  useEffect(() => {
    if (barbero) {
      setForm({
        fullname: barbero.usuario.fullname,
        email: barbero.usuario.email,
        password: '', // No rellenamos la contraseña por seguridad
        dni: barbero.dni || '',
        telefono: barbero.telefono || '',
        edad: barbero.edad || 18,
        sexo: barbero.sexo || 'M',
        biografia: barbero.biografia || '',
        especialidad: barbero.especialidad || ''
      });
      
      // Cargamos la agenda existente
      if (barbero.horarios) {
        setHorarios(barbero.horarios);
      }
    }
  }, [barbero]);

  // 3. MUTACIÓN DE ACTUALIZACIÓN
  const updateMutation = useMutation({
    mutationFn: (data: any) => barberosApi.update(id!, data),
    onSuccess: () => {
      toast.success('¡Cambios guardados correctamente!');
      queryClient.invalidateQueries({ queryKey: ['barberos-admin'] });
      queryClient.invalidateQueries({ queryKey: ['barbero', id] });
      navigate('/admin/equipo');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al actualizar';
      toast.error(msg);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'edad' ? Number(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiamos el payload: Si la contraseña está vacía, la quitamos para no enviarla
    const payload: any = { ...form, horarios };
    if (!payload.password) delete payload.password;

    updateMutation.mutate(payload);
  };

  // --- LÓGICA VISUAL ---
  const agendaLabel = useMemo(() => {
    if (horarios.length === 0) return 'Sin definir';
    const hasManana = horarios.some(h => parseInt(h.horaInicio) < 15);
    const hasTarde = horarios.some(h => parseInt(h.horaInicio) >= 15);
    if (hasManana && hasTarde) return 'Jornada Completa';
    if (hasManana) return 'Turno Mañana';
    if (hasTarde) return 'Turno Tarde';
    return 'Personalizada';
  }, [horarios]);

  // Renderizado de carga
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500">Error al cargar barbero</div>;

  const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1";
  const inputContainer = "relative group";
  const iconClass = "absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none";
  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all";

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Editar Profesional</h1>
                    <p className="text-xs text-slate-500">Actualiza la información del barbero.</p>
                </div>
            </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- COLUMNA IZQUIERDA --- */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    
                    {/* CREDENCIALES */}
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Credenciales</h2>
                                <p className="text-xs text-slate-400">Datos de acceso.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Nombre Completo</label>
                                <div className={inputContainer}>
                                    <User className={iconClass} size={18} />
                                    <input required type="text" name="fullname" value={form.fullname} onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Email Corporativo</label>
                                <div className={inputContainer}>
                                    <Mail className={iconClass} size={18} />
                                    <input required type="email" name="email" value={form.email} onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Nueva Contraseña</label>
                                <div className={inputContainer}>
                                    <Lock className={iconClass} size={18} />
                                    <input type="password" name="password" minLength={6} value={form.password} onChange={handleChange}
                                        className={inputClass} placeholder="Dejar vacía para mantener la actual"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 ml-1">* Solo llenar si deseas cambiar la contraseña del usuario.</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 mx-8"></div>

                    {/* FICHA PERSONAL */}
                    <div className="p-8 bg-slate-50/20">
                        <div className="flex items-center gap-3 mb-6">
                             <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Ficha Personal</h2>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                             <div>
                                <label className={labelClass}>DNI</label>
                                <div className={inputContainer}>
                                    <Hash className={iconClass} size={18} />
                                    <input required type="text" name="dni" value={form.dni} onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                             <div>
                                <label className={labelClass}>Teléfono</label>
                                <div className={inputContainer}>
                                    <Phone className={iconClass} size={18} />
                                    <input required type="text" name="telefono" value={form.telefono} onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                             <div>
                                <label className={labelClass}>Edad</label>
                                <div className={inputContainer}>
                                    <Calendar className={iconClass} size={18} />
                                    <input required type="number" name="edad" min={18} value={form.edad} onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Sexo</label>
                                <div className={inputContainer}>
                                    <Users className={iconClass} size={18} />
                                    <select name="sexo" required value={form.sexo} onChange={handleChange}
                                        className={inputClass + " appearance-none"}
                                    >
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                        <option value="X">Otro</option>
                                    </select>
                                </div>
                            </div>
                             <div className="md:col-span-2">
                                <label className={labelClass}>Especialidad</label>
                                <div className={inputContainer}>
                                    <Briefcase className={iconClass} size={18} />
                                    <input type="text" name="especialidad" value={form.especialidad} onChange={handleChange}
                                        className={inputClass} placeholder="Ej: Especialista en Navaja"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 mx-8"></div>

                    {/* AGENDA */}
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                             <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                                <CalendarDays size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Agenda Laboral</h2>
                                <p className="text-xs text-slate-400">Edita los turnos disponibles.</p>
                            </div>
                        </div>
                        
                        {/* ⚠️ IMPORTANTE: Pasamos 'value' para que el componente sepa qué mostrar */}
                        <AgendaSelector value={horarios} onChange={setHorarios} />
                    </div>
                </div>
            </div>

            {/* --- COLUMNA DERECHA --- */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 sticky top-24">
                    <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider border-b border-slate-100 pb-4">Resumen</h3>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shrink-0">
                            <User size={24} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-slate-900 text-sm truncate">{form.fullname}</p>
                            <p className="text-xs text-slate-500 truncate">{form.email}</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3 text-xs border border-slate-100">
                         <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Agenda Actual</span>
                            <span className={`font-bold text-xs px-2 py-1 rounded-md border
                                ${horarios.length > 0 
                                    ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                    : 'bg-red-50 text-red-500 border-red-100'}
                            `}>
                                {agendaLabel}
                            </span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={updateMutation.isPending}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {updateMutation.isPending ? 'Guardando...' : <><Save size={18}/> Guardar Cambios</>}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)}
                        className="w-full mt-3 py-2.5 text-slate-400 font-bold text-xs hover:text-red-500 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
};