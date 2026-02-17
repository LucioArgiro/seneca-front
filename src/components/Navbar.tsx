import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 Importamos Link
import { Scissors, Menu, X, User, LogOut } from "lucide-react";
import { useAuthStore } from "../store/auth";
import { useNegocio } from "../hooks/useNegocio";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { usuario, isAuth, logout } = useAuthStore();
  const { negocio } = useNegocio();
  const logoUrl = negocio?.logoUrl;
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout(); 
    closeMenu();
    navigate('/login');
  };

  const NAV_LINKS = [
    { name: 'Inicio', path: '/', isHash: true },
    { name: 'Contacto', path: '/contacto', isHash: false },
    { name: 'Turnos', path: '/turnos', isHash: false }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled || isOpen ? "bg-[#131313] shadow-2xl py-5" : "bg-transparent py-5"}`}>
      <div className="flex justify-between items-center px-6 md:px-8">

        {/* --- LOGO PRINCIPAL --- */}
        <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-auto h-12 object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-[#C9A227]/10 p-2 rounded-lg group-hover:bg-[#C9A227]/20 transition-colors">
                <Scissors className="text-[#C9A227]" size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black tracking-widest text-lg leading-none">SÉNECA</span>
                <span className="text-[#C9A227] text-[10px] tracking-[0.3em] font-medium">BARBERÍA</span>
              </div>
            </div>
          )}
        </div>

        {/* --- DESKTOP LINKS --- */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-8 font-medium text-white/80">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="hover:text-[#C9A227] transition-all text-xs uppercase tracking-widest hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            {isAuth ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                  HOLA, <span className="text-[#C9A227]">{usuario?.nombre?.split(' ')[0]}</span>
                </span>
                <button onClick={handleLogout} className="bg-[#1A1A1A] hover:bg-[#C9A227] text-white hover:text-[#131313] p-2 rounded-lg transition-all border border-white/10 hover:border-[#C9A227]">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-[#C9A227] text-[#131313] px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors">
                Ingresar
              </button>
            )}
          </div>
        </div>

        {/* --- BOTÓN HAMBURGUESA --- */}
        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          {!isOpen && <Menu size={28} />}
        </button>
      </div>

      {/* --- MENÚ MÓVIL --- */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-[#C9A227]/20 bg-gradient-to-r from-[#131313] to-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#C9A227] flex items-center justify-center text-[#131313]">
                <Scissors size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-[0.2em] leading-none">SÉNECA</h2>
                <p className="text-[10px] text-[#C9A227] tracking-[0.4em] mt-1">BARBERÍA</p>
              </div>
            </div>
            <button onClick={closeMenu} className="p-2 bg-[#131313] text-zinc-400 rounded-lg border border-white/10">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col p-6 space-y-2">
            {NAV_LINKS.map((item) => (
              // 👇 CAMBIO: También en móvil usamos Link
              item.isHash ? (
                <a key={item.name} href={item.path} onClick={closeMenu} className="group flex items-center justify-between py-4 border-b border-white/5 text-zinc-400 hover:text-white transition-all">
                  <span className="text-lg font-medium tracking-widest uppercase">{item.name}</span>
                  <span className="text-[#C9A227]">→</span>
                </a>
              ) : (
                <Link key={item.name} to={item.path} onClick={closeMenu} className="group flex items-center justify-between py-4 border-b border-white/5 text-zinc-400 hover:text-white transition-all">
                  <span className="text-lg font-medium tracking-widest uppercase">{item.name}</span>
                  <span className="text-[#C9A227]">→</span>
                </Link>
              )
            ))}
          </div>

          <div className="mt-auto p-6 pb-10">
            {isAuth ? (
              <div className="bg-[#131313] rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-full border-2 border-[#C9A227] flex items-center justify-center bg-zinc-800 text-[#C9A227] font-bold">
                    {usuario?.nombre?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[#C9A227] text-[10px] uppercase font-bold tracking-wider">Bienvenido</p>
                    <p className="text-white font-bold text-lg leading-none">{usuario?.nombre}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-zinc-400 hover:text-red-400 border border-white/10 py-3 rounded-xl font-bold transition-all text-sm uppercase">
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            ) : (
              <button onClick={() => { closeMenu(); navigate('/login'); }} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#C9A227] to-[#b88d15] text-[#131313] py-4 rounded-xl font-black text-sm uppercase tracking-widest">
                <User size={18} /> Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};