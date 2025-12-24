import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Calendar, Scissors, LogOut, History } from 'lucide-react'; // Iconos para que se vea pro

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber en qué URL estamos

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Función auxiliar para estilos del link (Activo vs Inactivo)
  const getLinkClasses = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium mb-1
      ${isActive
        ? 'bg-blue-50 text-blue-600 shadow-sm'   // Estilo ACTIVO (Azul)
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900' // Estilo INACTIVO (Gris)
      }
    `;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">

      {/* --- SIDEBAR (IZQUIERDA) --- */}
      {/* fixed h-full: Para que el menú se quede quieto al hacer scroll */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">

        {/* LOGO */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <div className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Scissors className="text-white" size={20} />
            </div>
            <span>BarberAdmin</span>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 px-4 py-6">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Menu Principal</p>

          <Link to="/admin/agenda" className={getLinkClasses('/admin/agenda')}>
            <Calendar size={20} />
            Agenda Activa
          </Link>

          <Link to="/admin/historial" className={getLinkClasses('/admin/historial')}>
            <History size={20} />
            Historial
          </Link>

          <Link to="/admin/servicios" className={getLinkClasses('/admin/servicios')}>
            <Scissors size={20} />
            Servicios
          </Link>
        </nav>

        {/* PERFIL Y LOGOUT (ABAJO) */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            {/* Info Usuario */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                {user?.fullname?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate">{user?.fullname}</p>
                <p className="text-xs text-slate-400">Administrador</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded-lg transition text-sm font-bold border border-transparent hover:border-red-100"><LogOut size={16} /> Cerrar Sesión</button>
          </div>
        </div>
      </aside>
      <main className="flex-1 ml-72 transition-all duration-300">

        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;