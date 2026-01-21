import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useResenas } from '../../hooks/useResenas';
import { useBarber } from '../../hooks/useBarber';
import { Navbar } from '../../components/Navbar';
import { Star, MapPin, Calendar, User, MessageCircle, ArrowLeft } from 'lucide-react';
import { StarDisplay } from '../../components/StarDisplay';


const StarRatingInput = ({ rating, setRating, disabled }: { rating: number, setRating: (r: number) => void, disabled: boolean }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" disabled={disabled} onClick={() => setRating(star)} className={`text-2xl transition-transform ${star <= rating ? 'text-yellow-400' : 'text-slate-200'} ${!disabled && 'hover:scale-110'}`}>★</button>
      ))}
    </div>
  );
};

export const BarberProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { usuario, token } = useAuthStore();
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const { data: barbero, isLoading: loadingBarber } = useBarber(id!);
  const { data: resenas, isLoading: loadingReviews, createResena, isCreating } = useResenas(id!);
  const userHasReviewed = resenas?.some((r) => r.cliente?.usuario?.id === usuario?.id);
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calificacion === 0) return alert('Por favor selecciona una calificación');

    createResena({
      barberoId: id!,
      calificacion,
      comentario
    }, {
      onSuccess: () => {
        setComentario('');
        setCalificacion(0);
        // toast.success("¡Gracias por tu opinión!");
      }
    });
  };

  if (loadingBarber) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  if (!barbero) return (
    <div className="text-center p-20">
      <h2 className="text-2xl font-bold text-slate-800">Barbero no encontrado</h2>
      <p className="text-slate-500">El perfil que buscas no existe o ha sido desactivado.</p>
    </div>
  );

  return (
    <>
      <Navbar />
      <button onClick={() => navigate(-1)} className="group flex items-center px-6 py-3 text-slate-400 hover:text-blue-600 font-medium mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-1 transition-transform group-hover:-translate-x-1" /> Volver al panel</button>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 pb-20">

        {/* --- HEADER DEL PERFIL --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Banner Decorativo */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 h-30 w-full relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>

          <div className="px-6 md:px-10 pb-10">
            <div className="relative flex flex-col md:flex-row justify-between items-end -mt-16 mb-6 gap-4">

              {/* Foto y Datos Principales */}
              <div className="flex flex-col md:flex-row items-end md:items-end gap-6 text-center md:text-left w-full md:w-auto">
                <div className="bg-white p-1.5 rounded-3xl shadow-lg mx-auto md:mx-0, mt-15">
                  {barbero.fotoUrl ? (
                    <img src={barbero.fotoUrl} alt="Perfil" className="w-32 h-32 rounded-2xl object-cover bg-slate-100" />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 leading-tight ">{barbero.usuario?.nombre} {barbero.usuario?.apellido || "Profesional"}</h1>
                  <p className="text-blue-600 font-bold text-lg mb-2">{barbero.especialidad || 'Estilista Profesional'}</p>
                  <div className="mb-3"><StarDisplay rating={barbero.promedio || 0} count={barbero.cantidadResenas || 0} size={20} />
                  </div>

                  {(barbero.provincia || barbero.pais) && (
                    <div className="flex items-center justify-center md:justify-start gap-1 text-slate-500 text-sm mt-1">
                      <MapPin size={14} />
                      <span>{barbero.provincia}{barbero.pais ? `, ${barbero.pais}` : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Reserva */}
              <button onClick={() => navigate('/reservar', { state: { barberId: barbero.id } })} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"><Calendar size={20} />Reservar Cita Ahora</button>
            </div>

            {/* Biografía */}
            {barbero.biografia && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-3 text-lg">Sobre mí</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{barbero.biografia}</p>
              </div>
            )}
          </div>
        </div>

        {/* --- SECCIÓN DE OPINIONES --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
              <Star className="fill-current" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Opiniones de Clientes</h2>
          </div>

          {/* Formulario de Reseña */}
          {token && !userHasReviewed ? (
            <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-6 rounded-2xl mb-10 border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MessageCircle size={18} /> Deja tu comentario
              </h3>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Calificación</label>
                <StarRatingInput rating={calificacion} setRating={setCalificacion} disabled={isCreating} />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tu experiencia</label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="¿Qué te pareció el servicio? Cuéntanos..."
                  className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32 bg-white"
                  disabled={isCreating}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCreating || calificacion === 0}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isCreating ? 'Publicando...' : 'Publicar Opinión'}
                </button>
              </div>
            </form>
          ) : null}

          {/* Mensajes de Estado (No logueado o Ya comentó) */}
          {!token && (
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-8 text-center border border-blue-100">
              <span className="font-bold">¿Quieres opinar?</span> Inicia sesión para dejar una reseña.
            </div>
          )}
          {userHasReviewed && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-8 text-center border border-green-100 font-medium">
              ✓ Gracias por compartir tu experiencia. Ya has opinado sobre este profesional.
            </div>
          )}

          {/* Lista de Reseñas */}
          <div className="space-y-8">
            {loadingReviews ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-24 bg-slate-50 rounded-xl animate-pulse"></div>)}
              </div>
            ) : resenas?.length === 0 ? (
              <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Star size={40} className="mx-auto mb-3 text-slate-300" />
                <p>Aún no hay opiniones.</p>
                <p className="text-sm">¡Sé el primero en reservar y contar tu experiencia!</p>
              </div>
            ) : (
              resenas?.map((review) => (
                <div key={review.id} className="border-b border-slate-100 last:border-0 pb-8 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200">
                        {review.cliente?.usuario?.nombre?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {review.cliente?.usuario?.nombre + ' ' + review.cliente?.usuario?.apellido || "Usuario Anónimo"}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">
                          {new Date(review.fecha).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-yellow-400 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < review.calificacion ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-[52px]">{review.comentario}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default BarberProfile;