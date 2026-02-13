import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { barberosApi } from '../../api/barberos';
import { type CreateBarberoDto } from '../../types';
import { User, Mail, Lock, Hash, Phone, Calendar, Users, Briefcase, Save, CalendarDays, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AgendaSelector } from '../../components/admin/AgendaSelector';

// Agregamos 'apellido' al estado inicial
const initialForm: CreateBarberoDto = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  dni: '',
  telefono: '',
  edad: 18,
  sexo: 'M',
  biografia: 'Profesional del equipo Séneca',
  especialidad: 'Estilista'
};

export const AdminCreateBarber = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState<CreateBarberoDto>(initialForm);
  const [horarios, setHorarios] = useState<any[]>([]);

  // Estilos Luxury para Toast
  const toastStyles = {
    style: {
      background: '#1A1A1A',
      color: '#fff',
      border: '1px solid #C9A227',
    },
    success: { iconTheme: { primary: '#C9A227', secondary: '#1A1A1A' } },
    error: { style: { background: '#1A1A1A', color: '#fff', border: '1px solid #EF4444' } }
  };

  const createMutation = useMutation({
    mutationFn: barberosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barberos-admin'] });
      navigate('/admin/equipo'); 
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'edad' ? Number(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, horarios };
    
    toast.promise(
        createMutation.mutateAsync(payload),
        {
            loading: 'Creando perfil profesional...',
            success: '¡Profesional dado de alta correctamente!',
            error: (err) => err.response?.data?.message || 'Error al crear barbero'
        },
        toastStyles
    );
  };

  // --- LÓGICA PARA ETIQUETA DE AGENDA ---
  const agendaLabel = useMemo(() => {
    if (horarios.length === 0) return 'Sin definir';
    const hasManana = horarios.some(h => parseInt(h.horaInicio) < 15);
    const hasTarde = horarios.some(h => parseInt(h.horaInicio) >= 15);
    if (hasManana && hasTarde) return 'Jornada Completa';
    if (hasManana) return 'Turno Mañana';
    if (hasTarde) return 'Turno Tarde';
    return 'Personalizada';
  }, [horarios]);

  const sexoMap: Record<string, string> = { 'M': 'Masculino', 'F': 'Femenino', 'X': 'Otro' };
  
  // Clases Reutilizables Luxury Dark
  const labelClass = "block text-xs font-bold text-zinc-400 uppercase mb-2 ml-1 tracking-wider";
  const inputContainer = "relative group";
  const iconClass = "absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-[#C9A227] transition-colors pointer-events-none";
  const inputClass = "w-full pl-12 pr-4 py-3 bg-[#131313] border border-zinc-800 rounded-xl text-white font-medium placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all";

  return (
    <div className="min-h-screen bg-[#131313] pb-20 font-sans text-slate-200">
      
      {/* HEADER */}
      <div className="bg-[#1A1A1A] border-b border-white/5 sticky top-0 z-20 shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-[#C9A227] transition-colors"
                    title="Volver atrás"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Alta de Profesional</h1>
                </div>
            </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- COLUMNA IZQUIERDA (FORMULARIO) --- */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* 1. CREDENCIALES */}
                <div className="bg-[#1A1A1A] rounded-2xl shadow-xl border border-white/5 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 flex items-center justify-center shadow-lg shadow-[#C9A227]/5">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Credenciales de Acceso</h2>
                                <p className="text-sm text-zinc-400">Datos de sistema para inicio de sesión.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* CAMPO NOMBRE */}
                            <div>
                                <label className={labelClass}>Nombre</label>
                                <div className={inputContainer}>
                                    <User className={iconClass} size={18} />
                                    <input required type="text" name="nombre" value={form.nombre} onChange={handleChange}
                                        className={inputClass} placeholder="Ej: Juan"
                                    />
                                </div>
                            </div>

                            {/* CAMPO APELLIDO */}
                            <div>
                                <label className={labelClass}>Apellido</label>
                                <div className={inputContainer}>
                                    <UserCheck className={iconClass} size={18} />
                                    <input required type="text" name="apellido" value={form.apellido} onChange={handleChange}
                                        className={inputClass} placeholder="Ej: Pérez"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Email Corporativo</label>
                                <div className={inputContainer}>
                                    <Mail className={iconClass} size={18} />
                                    <input required type="email" name="email" value={form.email} onChange={handleChange}
                                        className={inputClass} placeholder="juan@barberia.com"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Contraseña Temporal</label>
                                <div className={inputContainer}>
                                    <Lock className={iconClass} size={18} />
                                    <input required type="password" name="password" minLength={6} value={form.password} onChange={handleChange}
                                        className={inputClass} placeholder="Mínimo 6 caracteres"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. FICHA PERSONAL */}
                <div className="bg-[#1A1A1A] rounded-2xl shadow-xl border border-white/5 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 flex items-center justify-center">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Ficha Personal</h2>
                                <p className="text-sm text-zinc-400">Información legal y de contacto.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                             <div>
                                <label className={labelClass}>DNI / Identificación</label>
                                <div className={inputContainer}>
                                    <Hash className={iconClass} size={18} />
                                    <input required type="text" name="dni" value={form.dni} onChange={handleChange}
                                        className={inputClass} placeholder="Sin puntos"
                                    />
                                </div>
                            </div>
                             <div>
                                <label className={labelClass}>Teléfono</label>
                                <div className={inputContainer}>
                                    <Phone className={iconClass} size={18} />
                                    <input required type="text" name="telefono" value={form.telefono} onChange={handleChange}
                                        className={inputClass} placeholder="+54 9 ..."
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
                                        className={inputClass + " appearance-none cursor-pointer"}
                                    >
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                        <option value="X">Otro</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. AGENDA */}
                <div className="bg-[#1A1A1A] rounded-2xl shadow-xl border border-white/5 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 flex items-center justify-center">
                                <CalendarDays size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Agenda Laboral</h2>
                                <p className="text-sm text-zinc-400">Define los turnos de disponibilidad semanal.</p>
                            </div>
                        </div>
                        
                        <AgendaSelector onChange={setHorarios} />
                    </div>
                </div>
            </div>

            {/* --- COLUMNA DERECHA (RESUMEN) --- */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* TARJETA RESUMEN STICKY */}
                <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl border border-white/5 p-6 sticky top-28">
                    <h3 className="font-bold text-[#C9A227] mb-6 text-xs uppercase tracking-[0.2em] border-b border-zinc-800 pb-4">
                        Resumen de Alta
                    </h3>
                    
                    {/* Previsualización Mini */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-[#131313] flex items-center justify-center text-zinc-500 border border-zinc-800 shrink-0 shadow-inner">
                            <User size={28} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-white text-lg truncate capitalize">
                                {form.nombre || 'Nuevo'} {form.apellido}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">{form.email || 'email@...'}</p>
                        </div>
                    </div>

                    {/* LISTA DE DATOS */}
                    <div className="bg-[#131313] rounded-xl p-5 mb-6 space-y-4 text-xs border border-zinc-800 shadow-inner">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-500 font-medium uppercase tracking-wide">DNI</span>
                            <span className="font-bold text-zinc-300 tracking-wider">{form.dni || '--'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-500 font-medium uppercase tracking-wide">Teléfono</span>
                            <span className="font-bold text-zinc-300">{form.telefono || '--'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-500 font-medium uppercase tracking-wide">Edad</span>
                            <span className="font-bold text-zinc-300">{form.edad} años</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-500 font-medium uppercase tracking-wide">Sexo</span>
                            <span className="font-bold text-zinc-300">{sexoMap[form.sexo]}</span>
                        </div>
                        
                        <div className="h-px bg-zinc-800 my-2"></div>

                        <div className="flex justify-between items-center pt-1">
                            <span className="text-zinc-500 font-medium uppercase tracking-wide">Agenda</span>
                            <span className={`font-bold text-[10px] px-2 py-1 rounded border uppercase tracking-wider
                                ${horarios.length > 0 
                                    ? 'bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/30' 
                                    : 'bg-red-900/20 text-red-500 border-red-900/30'}
                            `}>
                                {agendaLabel}
                            </span>
                        </div>
                    </div>

                    <button type="submit" disabled={createMutation.isPending} className="w-full py-4 rounded-xl font-bold text-sm tracking-wide text-white text-[#C9A227] bg-[#131313] rounded-lg hover:bg-[#C9A227] hover:text-[#131313] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 border border-[#C9A227]/30 flex items-center justify-center gap-2 group">{createMutation.isPending ? 'PROCESANDO...' : <><Save size={18} className="group-hover:scale-110 transition-transform"/> CONFIRMAR ALTA</>}</button>
                    
                    <button type="button" onClick={() => navigate(-1)} className="w-full mt-3 py-3 text-zinc-500 font-bold text-xs hover:text-red-400 hover:bg-red-900/10 rounded-xl transition-colors uppercase tracking-wide">Cancelar operación</button>
                </div>
            </div>

        </form>
      </div>
    </div>
  );
};