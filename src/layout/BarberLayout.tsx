import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, LogOut, Scissors, Menu, X, User, Wallet 
} from 'lucide-react'; 
import { useAuthStore } from '../store/auth';

export const BarberLayout = () => {
  const { logout, usuario } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cerrar sidebar al cambiar de ruta en móvil
  useEffect(() => { setIsSidebarOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  // Helper para estilos de enlaces activos
  const getLinkClasses = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium mb-1
      ${isActive
        ? 'bg-[#C9A227]/10 text-[#C9A227] shadow-[0_0_15px_rgba(201,162,39,0.1)] border-r-2 border-[#C9A227]' // Activo: Dorado
        : 'text-slate-400 hover:bg-white/5 hover:text-[#C9A227]' // Inactivo
      }
    `;
  };

  return (
    // FONDO GENERAL #131313
    <div className="flex h-screen bg-[#131313] text-slate-200 font-sans overflow-hidden">

      {/* --- OVERLAY MÓVIL --- */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/90 lg:hidden transition-opacity backdrop-blur-sm"
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-[#1A1A1A] border-r border-white/5 flex flex-col z-30 
        transition-transform duration-300 ease-in-out shadow-2xl 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0
      `}>
        
        {/* LOGO */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
           <div className="flex items-center gap-3 text-xl font-black text-white tracking-tight">
            <div className="bg-gradient-to-br from-[#C9A227] to-[#B45309] p-2 rounded-xl shadow-lg shadow-[#C9A227]/20 transform -rotate-6">
              <Scissors className="text-black" size={20} />
            </div>
            <span>Barber<span className="text-[#C9A227]">Panel</span></span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-[#C9A227] transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 px-4 py-8 overflow-y-auto space-y-1 custom-scrollbar">
          
          <p className="px-4 text-[10px] font-bold text-[#C9A227] uppercase tracking-[0.2em] mb-4 opacity-80">
            Tu Espacio
          </p>

          <Link to="/barber/agenda" className={getLinkClasses('/barber/agenda')}>
            <Calendar size={20} /> Agenda de Turnos
          </Link>

          <Link to="/barber/caja" className={getLinkClasses('/barber/caja')}>
            <Wallet size={20} /> Mi Caja y Pagos
          </Link>

          <Link to="/barber/historial" className={getLinkClasses('/barber/historial')}>
            <Users size={20} /> Historial Clientes
          </Link>

          <div className="pt-6 mt-6 border-t border-white/5">
             <Link to="/barber/perfil" className={getLinkClasses('/barber/perfil')}>
                <User size={20} /> Mi Perfil
            </Link>
          </div>

        </nav>

        {/* PERFIL (BOTTOM) */}
        <div className="p-4 border-t border-white/5 bg-[#131313]/50">
          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5 shadow-lg flex flex-col gap-3 group">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#252525] border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227] font-bold shadow-md shrink-0">
                {usuario?.nombre?.charAt(0).toUpperCase() || 'B'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate capitalize">
                    {usuario?.nombre} {usuario?.apellido}
                </p>
                <p className="text-[10px] text-[#C9A227] font-bold uppercase tracking-wide truncate">
                  Profesional
                </p>
              </div>
            </div>

            <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center gap-2 text-zinc-400 hover:bg-red-900/10 hover:text-red-400 hover:border-red-900/30 py-2.5 rounded-lg transition-all duration-300 text-xs font-bold border border-white/5 tracking-wide uppercase"
            >
                <LogOut size={14} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative bg-[#131313]">
        
        {/* HEADER MÓVIL */}
        <div className="lg:hidden bg-[#1A1A1A] border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-20 shadow-md shrink-0">
            <div className="flex items-center gap-2 font-bold text-white">
                <div className="bg-[#C9A227] p-1 rounded text-black">
                    <Scissors size={16} />
                </div>
                <span>Barber<span className="text-[#C9A227]">App</span></span>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="text-[#C9A227]">
                <Menu size={24} />
            </button>
        </div>

        {/* CONTENIDO DE LA PÁGINA */}
        <div className="flex-1 overflow-auto bg-[#131313] relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet />
        </div>

      </main>
    </div>
  );
};