import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { User, Mail, Lock, CheckCircle, ArrowLeft, Phone, MapPin, Loader2, UserPlus } from 'lucide-react';

const Register = () => {
  const { register, isLoading } = useRegister();
  const [localError, setLocalError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    pais: 'Argentina',
    provincia: '',
    password: '',
    confirmPass: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkStrength = (pass: string) => ({
    length: pass.length >= 8,
    number: /\d/.test(pass),
    upper: /[A-Z]/.test(pass),
    special: /[\W_]/.test(pass),
  });

  const strength = checkStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPass) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }

    if (formData.telefono.length < 10) {
      setLocalError('El teléfono debe tener al menos 10 números.');
      return;
    }

    register({
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      pais: formData.pais,
      provincia: formData.provincia
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-[#0a0a0a] py-16 px-4 selection:bg-[#C9A227] selection:text-[#131313]">

      {/* 1. FONDO FIXED (Soluciona el espacio blanco al hacer scroll) */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop')" }}
      ></div>

      {/* 2. GRADIENTE MÁS SUAVE (Permite ver la imagen de fondo) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/80 to-[#0a0a0a] z-0"></div>

      {/* BOTÓN VOLVER */}
      <Link to="/login" className="absolute top-8 left-8 text-zinc-500 hover:text-[#C9A227] flex items-center gap-2 z-20 transition-all font-bold uppercase tracking-widest text-xs group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Login
      </Link>

      {/* TARJETA */}
      <div className="relative z-10 w-full max-w-2xl bg-[#131313]/90 rounded-3xl border border-white/5  p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500 my-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-[#0a0a0a] p-3 rounded-full border border-[#C9A227]/30 shadow-[0_0_20px_rgba(201,162,39,0.15)] mb-4">
            <UserPlus className="text-[#C9A227]" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Crear Cuenta</h1>
          <p className="text-zinc-500 text-sm font-medium">
            Únete a nosotros para reservar turnos fácilmente.
          </p>
        </div>

        {/* ERRORES */}
        {localError && (
          <div className="bg-red-900/10 text-red-400 p-3 mb-6 rounded-xl text-center text-xs font-bold border border-red-900/30 animate-pulse">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* FILA 1: NOMBRE Y APELLIDO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-1.5 ml-1">Nombre</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
                </div>
                <input
                  name="nombre"
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                  placeholder="Ej. Juan"
                  value={formData.nombre} onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-1.5 ml-1">Apellido</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
                </div>
                <input
                  name="apellido"
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                  placeholder="Ej. Pérez"
                  value={formData.apellido} onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-1.5 ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
              </div>
              <input
                name="email"
                type="email"
                className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                placeholder="tu@email.com"
                value={formData.email} onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* TELÉFONO */}
          <div>
            <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-1.5 ml-1">
              Teléfono <span className="text-zinc-500 text-[9px] lowercase font-normal">(sin 0 ni 15)</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
              </div>
              <input
                name="telefono"
                type="tel"
                className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                placeholder="Ej: 3815123456"
                value={formData.telefono} onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* UBICACIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-1.5 ml-1">País</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
                </div>
                <select
                  name="pais"
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all appearance-none cursor-pointer"
                  value={formData.pais} onChange={handleChange}
                >
                  <option value="Argentina">Argentina</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Chile">Chile</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-1.5 ml-1">Provincia</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
                </div>
                <input
                  name="provincia"
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                  placeholder="Ej: Tucumán"
                  value={formData.provincia} onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* CONTRASEÑA */}
          <div>
            <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-1.5 ml-1">Contraseña</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
              </div>
              <input
                name="password"
                type="password"
                className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                placeholder="••••••••"
                value={formData.password} onChange={handleChange}
                required
              />
            </div>

            {/* INDICADORES DE SEGURIDAD LUXURY */}
            <div className="mt-3 grid grid-cols-2 gap-y-1 pl-2">
              <p className={`text-[10px] font-bold flex items-center gap-1.5 ${strength.length ? "text-[#C9A227]" : "text-zinc-600"}`}>
                {strength.length ? "✓" : "○"} Mínimo 8 caracteres
              </p>
              <p className={`text-[10px] font-bold flex items-center gap-1.5 ${strength.upper ? "text-[#C9A227]" : "text-zinc-600"}`}>
                {strength.upper ? "✓" : "○"} Una mayúscula
              </p>
              <p className={`text-[10px] font-bold flex items-center gap-1.5 ${strength.number ? "text-[#C9A227]" : "text-zinc-600"}`}>
                {strength.number ? "✓" : "○"} Un número
              </p>
              <p className={`text-[10px] font-bold flex items-center gap-1.5 ${strength.special ? "text-[#C9A227]" : "text-zinc-600"}`}>
                {strength.special ? "✓" : "○"} Un carácter especial
              </p>
            </div>
          </div>

          {/* CONFIRM PASS */}
          <div>
            <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-1.5 ml-1">Confirmar Contraseña</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CheckCircle className={`transition-colors duration-300 ${formData.confirmPass && formData.password === formData.confirmPass ? 'text-[#C9A227]' : 'text-zinc-600'}`} size={18} />
              </div>
              <input
                name="confirmPass"
                type="password"
                className={`w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-zinc-700 outline-none transition-all
                  ${formData.confirmPass && formData.password !== formData.confirmPass
                    ? 'border-red-900/50 focus:border-red-500'
                    : 'border-[#333] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]'}
                `}
                placeholder="••••••••"
                value={formData.confirmPass} onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* CHECKBOX LEGALES */}
          <div className="flex items-start gap-2 text-xs text-zinc-500 mt-2 pl-1">
            <input type="checkbox" className="mt-0.5 accent-[#C9A227] bg-[#333] border-none rounded cursor-pointer" required />
            <p>
              Acepto los <a href="#" className="text-[#C9A227] hover:underline font-bold">Términos y Condiciones</a>.
            </p>
          </div>

          {/* BOTÓN SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 text-[#131313] font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(201,162,39,0.2)] flex justify-center items-center gap-2 mt-4
              ${isLoading
                ? 'bg-[#C9A227]/50 cursor-not-allowed'
                : 'bg-[#C9A227] hover:bg-[#b88d15] hover:shadow-[0_0_30px_rgba(201,162,39,0.4)] hover:scale-[1.02] active:scale-95'
              }`}
          >
            {isLoading ? <><Loader2 className="animate-spin" size={18} /> REGISTRANDO...</> : 'CREAR CUENTA'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-zinc-500">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-[#C9A227] font-bold hover:underline hover:text-white transition uppercase tracking-wide ml-1">
            INICIAR SESIÓN
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;