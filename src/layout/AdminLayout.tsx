import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Calendar, Scissors, LogOut, History, Menu, X, Users, Briefcase, Wallet, Settings } from 'lucide-react';

const AdminLayout = () => {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => { setIsSidebarOpen(false); }, [location.pathname]);

  const getLinkClasses = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-50 font-medium mb-1
      ${isActive
        ? 'bg-[#C9A227]/10 text-[#C9A227] shadow-[0_0_15px_rgba(212,175,55,0.1)] border-r-2 border-[#D4AF37]' // Activo: Fondo dorado suave + Borde derecho
        : 'text-slate-400 hover:bg-[#131313a1] hover:text-[#C9A227]' // Inactivo: Gris a Blanco
      }
    `;
  };

  return (
    // FONDO GENERAL: Slate 900 (Carbón)
    <div className="flex h-screen bg-[#131313] text-slate-200 font-sans overflow-hidden ">

      {/* --- 1. DARK OVERLAY (Mobile Only) --- */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/90 lg:hidden transition-opacity "
        />
      )}

      {/* --- 2. SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-granular-dark border-r border-slate-800 flex flex-col z-30 transition-transform duration-300 ease-in-out shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
       {/* LOGO */}
        <div className="h-24 flex items-center justify-between px-8 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 text-2xl font-black text-white tracking-tight">
            <div className="bg-gradient-to-br from-[#C9A227] to-[#B45309] p-2.5 rounded-xl shadow-lg shadow-[#C9A227]/20 transform rotate-3">
              <Scissors className="text-white" size={22} />
            </div>
            <span>Barber<span className="text-[#C9A227]">Admin</span></span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-[#C9A227] transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <p className="px-4 text-[10px] font-bold text-[#C9A227] uppercase tracking-[0.2em] mb-4 opacity-90">Gestión</p>

          <Link to="/admin/agenda" className={getLinkClasses('/admin/agenda')}>
            <Calendar size={20} /> Agenda Global
          </Link>
          <Link to="/admin/historial" className={getLinkClasses('/admin/historial')}>
            <History size={20} />Clientes
          </Link>

          <Link to="/admin/finanzas" className={getLinkClasses('/admin/finanzas')}>
            <Wallet size={20} /> Caja y Finanzas
          </Link>

          <p className="px-4 text-[10px] font-bold text-[#C9A227] uppercase tracking-[0.2em] mb-4 mt-10 opacity-90">Configuración</p>

          <Link to="/admin/configuracion" className={getLinkClasses('/admin/configuracion')}>
            <Settings size={20} /> Negocio y Web
          </Link>

          <Link to="/admin/servicios" className={getLinkClasses('/admin/servicios')}>
            <Briefcase size={20} /> Servicios y Precios
          </Link>
          <Link to="/admin/equipo" className={getLinkClasses('/admin/equipo')}>
            <Users size={20} /> Equipo
          </Link>

        </nav>

        {/* PROFILE (Bottom) */}
        <div className="p-4 border-t border-slate-800 shrink-0 bg-granular-dark/30">
          <div className="bg-[#131313] rounded-xl p-4 border border-slate-700 shadow-lg relative group">
            {/* Brillo decorativo */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A227/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-[#D4AF37]/50 flex items-center justify-center text-[#C9A227] font-bold shadow-md shrink-0">{usuario?.nombre?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-200 truncate">{usuario?.nombre}{usuario?.apellido}</p>
                <p className="text-[10px] text-[#C9A227] font-bold uppercase tracking-wide truncate">
                  {usuario?.role === 'ADMIN' ? 'Administrador' : 'Barbero'}
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] py-2.5 rounded-lg transition-all duration-300 text-xs font-bold border border-[#D4AF37]/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] tracking-wide uppercase"><LogOut size={14} /> Cerrar Sesión</button>
          </div>
        </div>
      </aside>

      {/* --- 3. MAIN CONTENT --- */}
      <main className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative bg-[#131313]">

        {/* MOBILE HEADER */}
        <div className="lg:hidden bg-[#131313] border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-20 shadow-md shrink-0">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="bg-[#C9A227] p-1.5 rounded-md text-black">
              <Scissors size={16} />
            </div>
            <span>Barber<span className="text-[#C9A227]">Admin</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[#C9A227] bg-[#131313] rounded-lg hover:bg-[#C9A227] hover:text-[#C9A227] transition border border-[#C9A227]"><Menu size={24} /></button>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-auto bg-[#131313] relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default AdminLayout;