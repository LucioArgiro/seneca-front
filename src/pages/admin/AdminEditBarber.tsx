import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { barberosApi } from '../../api/barberos';
import {
  User, Mail, Lock, Hash, Phone, Calendar, Users, Briefcase,
  Save, CalendarDays, ArrowLeft, ShieldCheck, Loader2, Banknote,
  QrCode, Smartphone, Upload, Trash2, UserCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AgendaSelector } from '../../components/admin/AgendaSelector';

export const AdminEditBarber = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estado del formulario
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    dni: '',
    telefono: '',
    edad: 18,
    sexo: 'M',
    biografia: '',
    especialidad: '',
    precioSenia: 2000,
    aliasMp: '',
    imagenQrUrl: ''
  });

  const [horarios, setHorarios] = useState<any[]>([]);
  const [uploadingQr, setUploadingQr] = useState(false);

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

  // 1. CARGAR DATOS DEL BARBERO
  const { data: barbero, isLoading, isError } = useQuery({
    queryKey: ['barbero', id],
    queryFn: () => barberosApi.getOne(id!),
    enabled: !!id,
  });

  // 2. RELLENAR FORMULARIO
  useEffect(() => {
    if (barbero) {
      setForm({
        nombre: barbero.usuario.nombre,
        apellido: barbero.usuario.apellido,
        email: barbero.usuario.email,
        password: '',
        dni: barbero.dni || '',
        telefono: barbero.telefono || '',
        edad: barbero.edad || 18,
        sexo: barbero.sexo || 'M',
        biografia: barbero.biografia || '',
        especialidad: barbero.especialidad || '',
        precioSenia: barbero.precioSenia || 0,
        aliasMp: barbero.aliasMp || '',
        imagenQrUrl: barbero.imagenQrUrl || ''
      });

      if (barbero.horarios) {
        setHorarios(barbero.horarios);
      }
    }
  }, [barbero]);

  // 3. MUTACIÓN DE ACTUALIZACIÓN
  const updateMutation = useMutation({
    mutationFn: (data: any) => barberosApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barberos-admin'] });
      queryClient.invalidateQueries({ queryKey: ['barbero', id] });
      navigate('/admin/equipo');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumberField = name === 'edad' || name === 'precioSenia';
    setForm({ ...form, [name]: isNumberField ? Number(value) : value });
  };

  // 4. FUNCIONES DE SUBIDA DE QR
  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQr(true);
    const uploadPromise = barberosApi.uploadImage(file);

    toast.promise(
      uploadPromise,
      {
        loading: 'Subiendo QR...',
        success: (url) => {
          setForm(prev => ({ ...prev, imagenQrUrl: url }));
          return "QR cargado. Recuerda guardar.";
        },
        error: "Error al subir la imagen"
      },
      toastStyles
    );

    try {
      await uploadPromise;
    } catch (e) {
      console.error(e);
    } finally {
      setUploadingQr(false);
    }
  };

  const handleRemoveQr = () => {
    setForm(prev => ({ ...prev, imagenQrUrl: '' }));
    toast.success("QR eliminado (pendiente de guardar)", toastStyles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...form, horarios };
    if (!payload.password) delete payload.password;

    toast.promise(
      updateMutation.mutateAsync(payload),
      {
        loading: 'Actualizando perfil...',
        success: '¡Perfil actualizado correctamente!',
        error: (err) => err.response?.data?.message || 'Error al actualizar'
      },
      toastStyles
    );
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#131313]"><Loader2 className="animate-spin text-[#C9A227]" size={40} /></div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center bg-[#131313] text-red-500 font-bold">Error al cargar datos del profesional.</div>;

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
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Editar Profesional</h1>
              <p className="text-xs text-zinc-400">Actualiza la información y configuración.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- COLUMNA IZQUIERDA --- */}
          <div className="lg:col-span-8 space-y-8">

            {/* 1. CREDENCIALES */}
            <div className="bg-[#1A1A1A] rounded-2xl shadow-xl border border-white/5 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-[#131313] text-[#C9A227] border border-[#C9A227]/20 flex items-center justify-center shadow-lg shadow-[#C9A227]/5">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Credenciales</h2>
                    <p className="text-sm text-zinc-400">Datos de acceso al sistema.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Nombre</label>
                    <div className={inputContainer}>
                      <User className={iconClass} size={18} />
                      <input required type="text" name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Apellido</label>
                    <div className={inputContainer}>
                      <UserCheck className={iconClass} size={18} />
                      <input required type="text" name="apellido" value={form.apellido} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <div className={inputContainer}>
                      <Mail className={iconClass} size={18} />
                      <input required type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Nueva Contraseña</label>
                    <div className={inputContainer}>
                      <Lock className={iconClass} size={18} />
                      <input type="password" name="password" minLength={6} value={form.password} onChange={handleChange}
                        className={inputClass} placeholder="Vacío para mantener actual"
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
                  <div className="w-12 h-12 rounded-xl bg-[#131313] text-[#C9A227] border border-[#C9A227]/20 flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Ficha Personal</h2>
                    <p className="text-sm text-zinc-400">Información pública del perfil.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>DNI</label>
                    <div className={inputContainer}>
                      <Hash className={iconClass} size={18} />
                      <input required type="text" name="dni" value={form.dni} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Teléfono</label>
                    <div className={inputContainer}>
                      <Phone className={iconClass} size={18} />
                      <input required type="text" name="telefono" value={form.telefono} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Edad</label>
                    <div className={inputContainer}>
                      <Calendar className={iconClass} size={18} />
                      <input required type="number" name="edad" min={18} value={form.edad} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Sexo</label>
                    <div className={inputContainer}>
                      <Users className={iconClass} size={18} />
                      <select name="sexo" required value={form.sexo} onChange={handleChange} className={inputClass + " appearance-none"}>
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

                  {/* SEÑA DINÁMICA */}
                  <div className="md:col-span-2 bg-[#131313] p-5 rounded-xl border border-[#C9A227]/20 shadow-inner">
                    <label className={labelClass + " text-[#C9A227]"}>Valor de Seña Online ($)</label>
                    <div className={inputContainer}><Banknote className="absolute left-4 top-3.5 text-[#C9A227] pointer-events-none" size={18} /><input type="number" name="precioSenia" min={0} value={form.precioSenia} onChange={handleChange} className="w-full pl-12 pr-4 py-3 border border-[#C9A227]/30 rounded-xl text-[#C9A227] font-bold focus:bg-[#1A1A1A] focus:border-[#C9A227] outline-none transition-all placeholder-[#C9A227]/50" placeholder="0"
                    />
                    </div>
                    <p className="text-[10px] text-[#C9A227]/70 mt-2 ml-1">
                      * Monto a cobrar por Mercado Pago para confirmar reserva.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. MÉTODO DE COBRO */}
            <div className="bg-[#131313] rounded-2xl shadow-xl border border-white/5 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl text-[#C9A227] border border-[#C9A227] flex items-center justify-center">
                    <QrCode size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Método de Cobro</h2>
                    <p className="text-sm text-zinc-400">Configuración para transferencias.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* INPUT: Alias de MP */}
                  <div>
                    <label className={labelClass}>Alias de Mercado Pago</label>
                    <div className={inputContainer}>
                      <Smartphone className={iconClass} size={18} />
                      <input type="text" name="aliasMp" value={form.aliasMp} onChange={handleChange} className={inputClass} placeholder="Ej: pedro.barber.mp" />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 ml-1">Se mostrará al cliente si decide pagar por transferencia.</p>
                  </div>

                  {/* ZONA DE CARGA DE QR */}
                  <div className="flex flex-col gap-3">
                    <label className={labelClass}>Código QR (Imagen)</label>

                    <div className="flex items-center gap-4">
                      {/* Visualización del QR */}
                      <div className="w-32 h-32 rounded-xl border-2 border-dashed border-zinc-700 bg-[#131313] flex items-center justify-center relative overflow-hidden group hover:border-[#C9A227] transition-colors">
                        {uploadingQr ? (
                          <Loader2 className="animate-spin text-[#C9A227]" />
                        ) : form.imagenQrUrl ? (
                          <>
                            <img src={form.imagenQrUrl} alt="QR" className="w-full h-full object-cover" />
                            <button type="button" onClick={handleRemoveQr} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white"><Trash2 size={24} /></button></>) : (<QrCode className="text-zinc-600" size={32} />
                        )}
                      </div>

                      {/* Botones de Acción */}
                      <div className="flex flex-col gap-2">
                        <label className="cursor-pointer bg-[#252525] hover:bg-[#333] text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border border-white/5 hover:border-white/10"><Upload size={14} className="text-[#C9A227]" />{form.imagenQrUrl ? 'Cambiar Imagen' : 'Subir QR'}
                          <input type="file" accept="image/*" className="hidden" onChange={handleQrUpload} disabled={uploadingQr} />
                        </label>
                        <p className="text-[10px] text-zinc-500 max-w-[150px] leading-tight">Sube captura de tu QR de Mercado Pago. </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. AGENDA */}
            <div className="bg-[#1A1A1A] rounded-2xl shadow-xl border border-white/5 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-[#131313] text-[#C9A227] border border-[#C9A227]/20 flex items-center justify-center">
                    <CalendarDays size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Agenda Laboral</h2>
                    <p className="text-sm text-zinc-400">Define los días y horarios de atención.</p>
                  </div>
                </div>
                <AgendaSelector value={horarios} onChange={setHorarios} />
              </div>
            </div>
          </div>

          {/* --- COLUMNA DERECHA (RESUMEN) --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl border border-white/5 p-6 sticky top-28">
              <h3 className="font-bold text-[#C9A227] mb-6 text-xs uppercase tracking-[0.2em] border-b border-zinc-800 pb-4">Resumen</h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#131313] flex items-center justify-center text-zinc-500 border border-zinc-800 shrink-0 shadow-inner">
                  <User size={28} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-white text-lg truncate capitalize">{form.nombre} {form.apellido}</p>
                  <p className="text-xs text-zinc-500 truncate">{form.email}</p>
                </div>
              </div>

              <div className="bg-[#131313] rounded-xl p-5 mb-6 space-y-4 text-xs border border-zinc-800 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium uppercase tracking-wide">Seña Configurada</span>
                  <span className="font-bold text-[#C9A227] bg-[#C9A227]/10 px-2 py-1 rounded-md border border-[#C9A227]/30">
                    ${form.precioSenia}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium uppercase tracking-wide">Agenda Actual</span>
                  <span className={`font-bold px-2 py-1 rounded border uppercase tracking-wider
                                        ${horarios.length > 0
                      ? 'bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/30'
                      : 'bg-red-900/20 text-red-500 border-red-900/30'}
                                    `}>
                    {agendaLabel}
                  </span>
                </div>
                {/* Resumen del QR */}
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium uppercase tracking-wide">QR Cobro</span>
                  <span className={`font-bold px-2 py-1 rounded border uppercase tracking-wider ${form.imagenQrUrl ? 'bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/30' : 'bg-[#252525] text-zinc-500 border-zinc-700'}`}>{form.imagenQrUrl ? 'Cargado' : 'Sin Cargar'}</span>
                </div>
              </div>

              <button type="submit" disabled={updateMutation.isPending} className="w-full py-4 rounded-xl font-bold text-sm tracking-wide text-white text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 border border-[#C9A227] flex items-center justify-center gap-2 group">{updateMutation.isPending ? 'Guardando...' : <><Save size={18} className="group-hover:scale-110 transition-transform" /> GUARDAR CAMBIOS</>}</button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full mt-3 py-3 text-zinc-500 font-bold text-xs hover:text-red-400 hover:bg-red-900/10 rounded-xl transition-colors uppercase tracking-wide"
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