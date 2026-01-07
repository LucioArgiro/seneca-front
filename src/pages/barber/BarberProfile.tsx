import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useResenas } from '../../hooks/useResenas';
import { useBarber } from '../../hooks/useBarber'; 
import { Star, MapPin, Calendar, User } from 'lucide-react';
import { type Resena } from '../../types';

const StarRatingInput = ({ rating, setRating, disabled }: { rating: number, setRating: (r: number) => void, disabled: boolean }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => setRating(star)}
          className={`text-2xl transition-colors ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${!disabled && 'hover:scale-110'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export const BarberProfile = () => {
  const { id } = useParams(); // ID del USUARIO del barbero (viene de la URL)
  const { user, token } = useAuthStore();
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const { data: barbero, isLoading: loadingBarber } = useBarber(id!);
  
  const { 
    data: resenas, 
    isLoading: loadingReviews, 
    createResena, 
    isCreating 
  } = useResenas(id!);

  // 2. Lógica: ¿El usuario ya comentó?
  // Verificamos si alguna reseña pertenece al usuario logueado.
  // Nota: r.cliente?.usuario?.id es la nueva ruta segura.
  const userHasReviewed = resenas?.some(
    (r) => r.cliente?.usuario?.id === user?.id
  );

  // 3. Manejo del Envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calificacion === 0) return alert('Por favor selecciona una calificación');
    
    createResena({
      barberoId: id!, // ID del usuario barbero
      calificacion,
      comentario
    }, {
      onSuccess: () => {
        setComentario('');
        setCalificacion(0);
      }
    });
  };

  if (loadingBarber) return <div className="text-center p-10">Cargando perfil...</div>;
  if (!barbero) return <div className="text-center p-10 text-red-500">Barbero no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* --- HEADER DEL BARBERO --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-blue-600 h-32 w-full relative"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="bg-white p-1 rounded-2xl shadow-md">
              {barbero.fotoUrl ? (
                <img src={barbero.fotoUrl} alt={barbero.fullname} className="w-24 h-24 rounded-xl object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={40} />
                </div>
              )}
            </div>
            {/* Botón de Reserva (Ejemplo) */}
            <Link 
              to={`/reservar/${id}`}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Calendar size={18} />
              Reservar Cita
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">{barbero.fullname}</h1>
          <div className="flex flex-wrap gap-4 mt-3 text-slate-600 text-sm">
      
            
            {(barbero as any).provincia && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {(barbero as any).provincia}, {(barbero as any).pais}
              </span>
            )}
          </div>
          
          {barbero.biografia && (
            <div className="mt-6 border-t pt-6">
              <h3 className="font-semibold text-slate-900 mb-2">Sobre mí</h3>
              <p className="text-slate-600 leading-relaxed">{barbero.biografia}</p>
            </div>
          )}
        </div>
      </div>

      {/* --- SECCIÓN DE RESEÑAS --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Star className="fill-yellow-400 text-yellow-400" />
          Opiniones de Clientes
        </h2>

        {/* 1. Formulario (Solo si está logueado y NO ha comentado) */}
        {token && !userHasReviewed ? (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl mb-8 border border-slate-200">
            <h3 className="font-medium text-slate-900 mb-4">Deja tu calificación</h3>
            
            <div className="mb-4">
              <StarRatingInput rating={calificacion} setRating={setCalificacion} disabled={isCreating} />
            </div>

            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="¿Qué te pareció el servicio?"
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 mb-4"
              disabled={isCreating}
            />

            <button
              type="submit"
              disabled={isCreating || calificacion === 0}
              className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto"
            >
              {isCreating ? 'Publicando...' : 'Publicar Reseña'}
            </button>
          </form>
        ) : userHasReviewed ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-8 text-center border border-green-100">
            ✓ Ya has compartido tu opinión sobre este profesional.
          </div>
        ) : (
          <div className="bg-slate-50 text-slate-500 p-4 rounded-xl mb-8 text-center">
            Inicia sesión para dejar una reseña.
          </div>
        )}

        {/* 2. Lista de Comentarios */}
        <div className="space-y-6">
          {loadingReviews ? (
            <p className="text-center text-slate-400">Cargando opiniones...</p>
          ) : resenas?.length === 0 ? (
            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Aún no hay opiniones. ¡Sé el primero en reservar!
            </div>
          ) : (
            resenas?.map((review: Resena) => (
              <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">

                   
                    <div>
                      {/* NOMBRE: Acceso seguro con la nueva estructura */}
                      <p className="font-bold text-slate-900 text-sm">
                        {review.cliente?.usuario?.fullname || "Usuario Anónimo"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(review.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {/* Estrellas estáticas */}
                  <div className="flex gap-0.5 text-yellow-400 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < review.calificacion ? '★' : '☆'}</span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 text-sm pl-[52px]">{review.comentario}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BarberProfile;