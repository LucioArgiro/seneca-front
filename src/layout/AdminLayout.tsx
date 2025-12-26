import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Calendar, Scissors, LogOut, History, Menu, X } from 'lucide-react'; // Agregamos Menu y X

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
    const isActive = location.pathname === path;
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
      {/* Se muestra solo si el sidebar está abierto Y estamos en móvil (lg:hidden) */}
      {isSidebarOpen && (
        <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* --- 2. SIDEBAR RESPONSIVE --- */}
      {/* - fixed: Siempre fijo.
          - z-40: Por encima del overlay.
          - transition-transform: Para que deslice suave.
          - -translate-x-full: Oculto a la izquierda por defecto en móvil.
          - translate-x-0: Visible si isSidebarOpen es true.
          - lg:translate-x-0: SIEMPRE visible en pantallas grandes (Desktop).
      */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 flex flex-col z-40
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>

        {/* LOGO + Botón Cerrar (Solo móvil) */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-100">
          <div className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Scissors className="text-white" size={20} />
            </div>
            <span>BarberAdmin</span>
          </div>
          
          {/* Botón X solo visible en móvil dentro del sidebar */}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
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

        {/* PERFIL (Bottom) */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold shadow-sm shrink-0">
                {user?.fullname?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate">{user?.fullname}</p>
                <p className="text-xs text-slate-400">Administrador</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded-lg transition text-sm font-bold border border-transparent hover:border-red-100">
                <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* --- 3. CONTENIDO PRINCIPAL --- */}
      {/* - flex-1: Ocupa el resto del espacio.
          - ml-0: En móvil NO tiene margen (el sidebar está oculto).
          - lg:ml-72: En escritorio deja el hueco para el sidebar.
      */}
      <main className="flex-1 ml-0 lg:ml-72 transition-all duration-300 min-h-screen flex flex-col">
        
        {/* HEADER MÓVIL (Solo visible en LG hidden) */}
        {/* Este header aparece arriba solo en el celular para poder abrir el menú */}
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

        {/* Aquí se renderizan tus páginas (Agenda, Historial, etc) */}
        <Outlet />
      
      </main>

    </div>
  );
};

export default AdminLayout;