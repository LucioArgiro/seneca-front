import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginRequest } from '../api/auth';
import { useAuthStore } from '../store/auth';
import { Mail, Lock, ArrowLeft, Loader2, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.setLogin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginRequest(email, password);

      // Guardamos la sesión en el store
      setLogin(data.user);
      if (data.user.role === 'ADMIN' || data.user.role === 'BARBER') {
        navigate('/admin/agenda');
      } else {
        navigate('/turnos');
      }

    } catch (err: any) {
      console.error(err);
      setError('Credenciales inválidas. Verifica tus datos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-[#0a0a0a] overflow-hidden selection:bg-[#C9A227] selection:text-[#131313]">

      {/* 1. IMAGEN DE FONDO CON EFECTO OSCURO */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/80 to-[#0a0a0a] z-0"></div>

      {/* BOTÓN VOLVER */}
      <Link to="/" className="absolute top-8 left-8 text-zinc-500 hover:text-[#C9A227] flex items-center gap-2 z-20 transition-all font-bold uppercase tracking-widest text-xs group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Inicio
      </Link>

      {/* 2. TARJETA DE LOGIN LUXURY */}
      <div className="relative z-10 w-full max-w-md bg-[#131313]/80 p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl shadow-black animate-in fade-in zoom-in-95 duration-500">

        {/* Icono Superior */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#0a0a0a] p-4 rounded-full border border-[#C9A227]/30 shadow-[0_0_20px_rgba(201,162,39,0.15)]">
            <UserCheck className="text-[#C9A227]" size={32} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Bienvenido de nuevo</h1>
          <p className="text-zinc-500 text-sm font-medium">Accede a tu panel para gestionar tus turnos.</p>
        </div>

        {/* FEEDBACK DE ERROR (Solo texto, sin Toaster) */}
        {error && (
          <div className="bg-red-900/10 border border-red-900/30 text-red-400 p-3 mb-6 rounded-xl text-center text-xs font-bold animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* INPUT EMAIL */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
              </div>
              <input
                type="email"
                className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                required
              />
            </div>
          </div>

          {/* INPUT PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#C9A227] uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
              </div>
              <input
                type="password"
                className="w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs pt-2">
            <label className="flex items-center text-zinc-400 cursor-pointer hover:text-zinc-200 transition">
              <input type="checkbox" className="mr-2 accent-[#C9A227] rounded bg-[#333] border-none focus:ring-0 w-4 h-4 cursor-pointer" />
              Recordarme
            </label>

            <Link
              to="/auth/recuperar"
              className="text-zinc-500 hover:text-[#C9A227] transition font-bold"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#C9A227] hover:bg-[#b88d15] rounded-xl font-black text-[#131313] uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(201,162,39,0.2)] hover:shadow-[0_0_30px_rgba(201,162,39,0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'INICIAR SESIÓN'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center text-xs text-zinc-500">
          ¿Aún no tienes una cuenta?{' '}
          <Link to="/register" className="text-[#C9A227] hover:text-white font-bold hover:underline transition uppercase tracking-wide ml-1">
            CREAR CUENTA
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;