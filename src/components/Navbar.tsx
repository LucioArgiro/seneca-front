import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scissors, Menu, X, User, LogOut } from "lucide-react"; // Agregamos iconos nuevos
import { useAuthStore } from "../store/auth"; // <--- 1. Importamos el store

export const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // 2. Extraemos el usuario y la función logout del estado global
  const { user, isAuth, logout } = useAuthStore(); 

  const closeMenu = () => setIsOpen(false);

  // 3. Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout(); // Borra el token
    closeMenu();
    navigate('/login'); // Te manda al login
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center px-8 py-4">
        
        {/* LOGO (Clic te lleva al inicio) */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 font-bold text-xl text-slate-800 cursor-pointer"
        >
          <Scissors className="text-blue-600" />
          <span>Séneca</span>
        </div>

        {/* LINKS CENTRALES (Solo si NO estás logueado o si quieres que se vean siempre) */}
        <div className="hidden md:flex gap-6 font-medium text-gray-600">
          <a href="/#inicio" className="hover:text-blue-600 transition">Inicio</a>
          <a href="/#servicios" className="hover:text-blue-600 transition">Servicios</a>
          <a href="/#barberos" className="hover:text-blue-600 transition">Equipo</a>
          <a href="/#barberos" className="hover:text-blue-600 transition">Contacto</a>
        </div>

        {/* ZONA DE USUARIO / ACCIONES */}
        <div className="flex items-center gap-4">
            
            {/* 4. RENDERIZADO CONDICIONAL */}
            {isAuth ? (
              // --- SI ESTÁ LOGUEADO ---
              <div className="flex items-center gap-4">
                <span className="hidden md:block text-sm font-bold text-slate-700">
                  Hola, {user?.fullname?.split(' ')[0]} {/* Muestra solo el primer nombre */}
                </span>
                
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 px-4 py-2 rounded-full font-bold transition text-sm border border-slate-200"
                >
                    <LogOut size={18} />
                    <span className="hidden md:inline">Salir</span>
                </button>
              </div>
            ) : (
              // --- SI NO ESTÁ LOGUEADO ---
              <button 
                  onClick={() => navigate('/login')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold transition text-sm md:text-base flex items-center gap-2"
              >
                  <User size={18} />
                  Iniciar Sesión
              </button>
            )}

            {/* BOTÓN HAMBURGUESA (Móvil) */}
            <button 
                className="md:hidden text-slate-800 focus:outline-none ml-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg flex flex-col z-50">
          {/* Si está logueado, mostramos su nombre arriba en el menú móvil */}
          {isAuth && (
            <div className="p-4 bg-slate-50 border-b border-slate-100 text-center font-bold text-slate-700">
               👤 {user?.fullname}
            </div>
          )}

          <a href="/#inicio" onClick={closeMenu} className="block py-4 px-8 hover:bg-slate-50 border-b border-gray-50 text-gray-600">Inicio</a>
          <a href="/#servicios" onClick={closeMenu} className="block py-4 px-8 hover:bg-slate-50 border-b border-gray-50 text-gray-600">Servicios</a>
          
          {isAuth && (
            <button 
              onClick={handleLogout} 
              className="block w-full text-left py-4 px-8 text-red-500 font-bold hover:bg-red-50 transition"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
};