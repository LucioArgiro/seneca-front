import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginRequest } from '../api/auth';
import { useAuthStore } from '../store/auth';
import { Mail, Lock, Facebook, Chrome, ArrowLeft } from 'lucide-react'; // Iconos

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.setLogin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginRequest(email, password);
      setLogin(data.access_token, data.user);

      if (data.user.role === 'ADMIN') {
        navigate('/admin/agenda');
      } else if (data.user.role=== 'BARBER') {
        navigate('/admin/agenda');
      }else
        navigate('/turnos');
      }
     catch (err: any) {
      console.error(err);
      setError('Credenciales inválidas. Intenta de nuevo.');
    }
  };

  return (
    // CONTENEDOR PRINCIPAL (FONDO)
    <div className="min-h-screen w-full flex items-center justify-center relative bg-slate-900">

      {/* 1. IMAGEN DE FONDO CON OVERLAY */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop')" }}
      ></div>
      <div className="absolute inset-0 bg-slate-900/80 z-0"></div> {/* Oscurecedor */}

      {/* BOTÓN VOLVER (Opcional, por si quieren salir) */}
      <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 z-20 transition">
        <ArrowLeft size={20} /> Volver al Inicio
      </Link>

      {/* 2. TARJETA DE LOGIN */}
      <div className="relative z-10 w-full max-w-md bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-2xl">

        {/* ICONO DE CANDADO SUPERIOR */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600/20 p-4 rounded-full">
            <Lock className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">¡Bienvenido de nuevo!</h1>
          <p className="text-gray-400 text-sm">Ingresa tus credenciales para acceder a tu cuenta.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 mb-6 rounded text-center text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* INPUT EMAIL CON ICONO */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-gray-500" size={20} />
            </div>
            <input
              type="email"
              className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@ejemplo.com"
              required
            />
          </div>

          {/* INPUT PASSWORD CON ICONO */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-gray-500" size={20} />
            </div>
            <input
              type="password"
              className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-gray-400 cursor-pointer">
              <input type="checkbox" className="mr-2 accent-blue-600" />
              Recordarme
            </label>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition">¿Olvidaste tu contraseña?</a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition shadow-lg shadow-blue-600/20"
          >
            Iniciar Sesión
          </button>
        </form>
        <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-slate-600 flex-1"></div>
            <span className="text-gray-400 text-sm">O continúa con</span>
            <div className="h-px bg-slate-600 flex-1"></div>
        </div>

        {/* BOTONES SOCIALES (VISUALES) */}
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-900 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition">
            <Chrome size={20} /> Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2.5 rounded-lg font-bold hover:bg-[#166fe5] transition">
            <Facebook size={20} /> Facebook
          </button>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center text-sm text-gray-400">
          ¿Aún no tienes una cuenta?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition">
            Regístrate aquí
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;