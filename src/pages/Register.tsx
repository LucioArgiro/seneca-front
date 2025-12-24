import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../api/auth';
import { User, Mail, Lock, CheckCircle, ArrowLeft } from 'lucide-react';

const Register = () => {
  // Estados para los campos visuales
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validación Frontend: Contraseñas iguales
    if (password !== confirmPass) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      // 2. Unificar Nombre y Apellido para el Backend
      const fullname = `${nombre} ${apellido}`.trim();

      await registerRequest({ fullname, email, pass: password });
      
      alert('¡Cuenta creada con éxito! Ahora inicia sesión.');
      navigate('/login');

    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError('Ocurrió un error al registrarse.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-slate-900 py-10">
      
      {/* 1. FONDO (Igual al Login para continuidad) */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop')" }}
      ></div>
      {/* Overlay un poco más oscuro para que resalte la tarjeta blanca */}
      <div className="absolute inset-0 bg-black/80 z-0"></div>

      <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 z-20 transition">
        <ArrowLeft size={20} /> Volver al Inicio
      </Link>

      {/* 2. TARJETA BLANCA (Diseño image_5ab941.jpg) */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Registro de Usuario</h1>
          <p className="text-gray-500 text-sm">
            Crea tu cuenta para gestionar tus reservas y acceder a promociones exclusivas.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 mb-6 rounded text-center text-sm font-bold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* FILA 1: NOMBRE Y APELLIDO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold text-sm mb-1">Nombre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-400" size={18} />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white outline-none transition text-slate-900"
                  placeholder="Ej. Juan"
                  value={nombre} onChange={e => setNombre(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-bold text-sm mb-1">Apellido</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-400" size={18} />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white outline-none transition text-slate-900"
                  placeholder="Ej. Pérez"
                  value={apellido} onChange={e => setApellido(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-slate-700 font-bold text-sm mb-1">Email</label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={18} />
                </div>
              <input 
                type="email" 
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white outline-none transition text-slate-900"
                placeholder="tu@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* CONTRASEÑAS */}
          <div>
            <label className="block text-slate-700 font-bold text-sm mb-1">Contraseña</label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={18} />
                </div>
              <input 
                type="password" 
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white outline-none transition text-slate-900"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold text-sm mb-1">Confirmar Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle className={`${password && password === confirmPass ? 'text-green-500' : 'text-gray-400'}`} size={18} />
                </div>
              <input 
                type="password" 
                className={`w-full pl-10 p-3 bg-gray-50 border rounded-lg focus:bg-white outline-none transition text-slate-900
                  ${confirmPass && password !== confirmPass ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}
                `}
                placeholder="••••••••"
                value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                required
              />
            </div>
            {confirmPass && password !== confirmPass && (
              <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
            )}
          </div>

          {/* CHECKBOX LEGALES */}
          <div className="flex items-start gap-2 text-sm text-gray-500 mt-2">
            <input type="checkbox" className="mt-1 accent-blue-600" required />
            <p>
              Acepto los <a href="#" className="text-blue-600 hover:underline">Términos y Condiciones</a> y la <a href="#" className="text-blue-600 hover:underline">Política de Privacidad</a>.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg shadow-blue-600/20 text-lg"
          >
            Registrarse
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-1 inline-flex">
            Iniciar Sesión <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;