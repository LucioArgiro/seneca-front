import { Link } from 'react-router-dom';
import { User, Scissors, MapPin } from 'lucide-react';
import { StarDisplay } from './StarDisplay';
import type { BarberoPerfil } from '../types'; 

interface Props {
  barbero: BarberoPerfil;
}

export const BarberCard = ({ barbero }: Props) => {
  // Construimos el nombre completo
  const nombreCompleto = `${barbero.usuario.nombre} ${barbero.usuario.apellido}`;

  return (
    <div className="group relative h-[450px] w-full rounded-2xl overflow-hidden bg-[#131313] border border-white/5 shadow-lg transition-all duration-500  hover:border-[#C9A227]/30">
      
      {/* 1. IMAGEN DE FONDO */}
      {barbero.fotoUrl ? (
        <img src={barbero.fotoUrl} alt={nombreCompleto} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:grayscale-[0.2]"/>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A] text-zinc-600 group-hover:text-[#C9A227] transition-colors">
          <User size={80} strokeWidth={1} />
          <span className="text-xs mt-4 font-bold tracking-widest uppercase">Sin foto disponible</span>
        </div>
      )}

      {/* 2. OVERLAY (Gradiente Negro Luxury) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90 transition-opacity duration-300"></div>

      {/* 3. CONTENIDO */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">

          {/* Ubicación */}
          {(barbero.provincia || barbero.pais) && (
            <div className="flex items-center gap-1.5 mb-2 text-[#C9A227]">
              <MapPin size={12} /> 
              <p className="font-bold text-[10px] uppercase tracking-widest">
                {barbero.provincia}{barbero.provincia && barbero.pais ? ', ' : ''}{barbero.pais}
              </p>
            </div>
          )}

          {/* Nombre */}
          <h3 className="text-2xl font-black text-white mb-1 leading-tight">
            {barbero.usuario.nombre} {barbero.usuario.apellido}
          </h3>
          <h5 className="text-xs font-medium text-zinc-400 mb-3 leading-tight">
            {barbero.especialidad}
          </h5>

          {/* Biografía corta (Oculta hasta hover en desktop, o siempre visible reducida) */}
          <p className="text-zinc-400 text-xs leading-relaxed mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-50 h-0 group-hover:h-auto">
            {barbero.biografia || "Especialista en cortes clásicos, modernos y perfilado de barba. Tu estilo en las mejores manos."}
          </p>

          {/* Estrellas */}
          <div className="mb-6 flex items-center gap-2">
            <StarDisplay rating={barbero.promedio || 0} count={barbero.cantidadResenas || 0} size={16} showCount={false}/>
            {barbero.cantidadResenas ? (
                <span className="text-[10px] text-zinc-500 font-medium">({barbero.cantidadResenas} reseñas)</span>
            ) : (
                <span className="text-[10px] text-zinc-600 italic">Nuevo Talento</span>
            )}
          </div>

          {/* Botón Ver Perfil */}
          <Link to={`/barberos/${barbero.usuario.id}`} className="w-full py-3.5 bg-[#C9A227] hover:bg-[#131313] hover:text-[#C9A227] text-[#131313] font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wide text-xs">
            <Scissors size={16} strokeWidth={2.5} /> 
            Reservar Turno
          </Link>

        </div>
      </div>
    </div>
  );
};