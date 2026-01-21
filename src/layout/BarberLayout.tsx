import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Users, LogOut, Mail } from 'lucide-react'; // 👈 1. Importamos el icono Mail
import { useAuthStore } from '../store/auth';

export const BarberLayout = () => {
  const logout = useAuthStore(state => state.logout);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path 
    ? "bg-blue-600 text-white" 
    : "text-slate-400 hover:bg-slate-800 hover:text-white";

  return (
    <div className="flex h-screen bg-slate-100">
      {/* SIDEBAR DEL BARBERO */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
           <h2 className="text-2xl font-bold">BarberPanel 💈</h2>
           <p className="text-xs text-slate-500 mt-1">Solo personal autorizado</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          
          <Link to="/barber/agenda" className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive('/barber/agenda')}`}>
            <Calendar size={20} /> Agenda de Turnos
          </Link>

          {/* 👇 2. NUEVO LINK: MENSAJES */}
          <Link to="/barber/mensajes" className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive('/barber/mensajes')}`}>
            <Mail size={20} /> Buzón de Mensajes
          </Link>

          <Link to="/barber/historial" className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive('/barber/historial')}`}>
            <Users size={20} /> Historial Clientes
          </Link>

          <Link to="/barber/perfil" className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive('/barber/perfil')}`}>
            <Users size={20} /> Mi Perfil
          </Link>
          
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition w-full p-2">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};