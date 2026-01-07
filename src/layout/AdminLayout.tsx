import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Calendar, Scissors, LogOut, History, Menu, X, Users, Briefcase } from 'lucide-react'; // Agregamos Briefcase para Servicios

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para controlar si el sidebar está abierto en móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Cierra el sidebar automáticamente cuando cambiamos de ruta (UX móvil)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const getLinkClasses = (path: string) => {
    // Verificamos si la ruta actual EMPIEZA con el path del link (para sub-rutas)
    const isActive = location.pathname.startsWith(path);
    return `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium mb-1
      ${isActive
        ? 'bg-blue-50 text-blue-600 shadow-sm'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }
    `;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">

      {/* --- 1. OVERLAY OSCURO (Solo Móvil) --- */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* --- 2. SIDEBAR --- */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 flex flex-col z-40
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>

        {/* LOGO + Botón Cerrar */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-100">
          <div className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Scissors className="text-white" size={20} />
            </div>
            <span>BarberAdmin</span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Gestión</p>

          <Link to="/admin/agenda" className={getLinkClasses('/admin/agenda')}>
            <Calendar size={20} />
            Agenda Global
          </Link>

          <Link to="/admin/historial" className={getLinkClasses('/admin/historial')}>
            <History size={20} />
            CRM Clientes
          </Link>

          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 mt-6">Configuración</p>

          <Link to="/admin/servicios" className={getLinkClasses('/admin/servicios')}>
            <Briefcase size={20} />
            Servicios y Precios
          </Link>
          
          {/* Apunta a donde gestionas el equipo (puede ser crear o listar) */}
          <Link to="/admin/crear-barbero" className={getLinkClasses('/admin/crear-barbero')}>
            <Users size={20} />
            Equipo de Barberos
          </Link>
        </nav>

        {/* PERFIL (Bottom) */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold shadow-sm shrink-0">
                {user?.fullname?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate">{user?.fullname}</p>
                {/* 🟢 CORRECCIÓN VISUAL: Mostrar rol real */}
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                    {user?.role === 'ADMIN' ? 'Administrador' : 'Barbero'}
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded-lg transition text-sm font-bold border border-transparent hover:border-red-100">
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* --- 3. CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 ml-0 lg:ml-72 transition-all duration-300 min-h-screen flex flex-col">

        {/* HEADER MÓVIL (Solo visible en LG hidden) */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <div className="bg-blue-600 p-1 rounded">
              <Scissors className="text-white" size={16} />
            </div>
            <span>BarberAdmin</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100">
            <Menu size={24} />
          </button>
        </div>

        {/* Renderiza las páginas */}
        <Outlet />

      </main>

    </div>
  );
};

export default AdminLayout;