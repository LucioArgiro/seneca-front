import { Link } from 'react-router-dom';
import { User, Scissors, MapPin } from 'lucide-react';
import { StarDisplay } from './StarDisplay';
// Asegúrate de importar el tipo correcto desde tu archivo de tipos
import type { BarberoPerfil } from '../types'; 

interface Props {
  barbero: BarberoPerfil;
}

export const BarberCard = ({ barbero }: Props) => {
  return (
    <div className="group relative h-96 rounded-2xl overflow-hidden shadow-lg bg-slate-100 border border-slate-200 transition-transform hover:scale-[1.02] duration-300">
      
      {/* 1. IMAGEN DE FONDO */}
      {barbero.fotoUrl ? (
        <img 
          src={barbero.fotoUrl} 
          alt={barbero.usuario.nombre + ' ' + barbero.usuario.apellido} 
          className="w-full h-full object-cover transition duration-700 group-hover:scale-105" 
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
          <User size={64} />
          <span className="text-sm mt-2 font-medium">Sin foto</span>
        </div>
      )}

      {/* 2. OVERLAY (Degradado oscuro) */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent flex flex-col justify-end p-6">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">

          {/* Ubicación */}
          {(barbero.provincia || barbero.pais) && (
            <p className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
              <MapPin size={12} /> 
              {barbero.provincia}{barbero.provincia && barbero.pais ? ', ' : ''}{barbero.pais}
            </p>
          )}

          {/* Nombre */}
          <h3 className="text-2xl font-bold text-white mb-2">
            {barbero.usuario.nombre} {barbero.usuario.apellido}
          </h3>

          {/* Biografía corta */}
          <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all">
            {barbero.biografia || "Experto en cortes clásicos y modernos."}
          </p>

          {/* Estrellas */}
          <div className="mb-4 flex justify-start"> {/* Ajusté justify-center a start para alinearlo mejor */}
            <StarDisplay rating={barbero.promedio || 0} count={barbero.cantidadResenas || 0} size={16} showCount={true}/>
          </div>

          {/* Botón Ver Perfil */}
          <Link 
            to={`/barberos/${barbero.usuario.id}`} 
            className="w-full py-3 bg-white hover:bg-blue-50 text-slate-900 font-bold rounded-xl transition flex items-center justify-center gap-2 active:scale-95 shadow-lg"
          >
            <Scissors size={18} className="text-blue-600" /> 
            Ver Perfil 
          </Link>

        </div>
      </div>
    </div>
  );
};