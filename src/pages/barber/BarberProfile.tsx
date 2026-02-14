import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useResenas } from '../../hooks/useResenas';
import { useBarber } from '../../hooks/useBarber';
import { Navbar } from '../../components/Navbar';
import { StarDisplay } from '../../components/StarDisplay';
import { Calendar, User, MessageCircle, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Componente interno para el INPUT de estrellas
const StarRatingInput = ({ rating, setRating, disabled }: { rating: number, setRating: (r: number) => void, disabled: boolean }) => {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => setRating(star)}
          className={`text-3xl transition-all duration-300 transform 
            ${star <= rating 
              ? 'text-[#C9A227] scale-110 drop-shadow-[0_0_10px_rgba(201,162,39,0.5)]' 
              : 'text-zinc-700 hover:text-zinc-500'} 
            ${!disabled && 'hover:scale-125 cursor-pointer'} 
            active:scale-95`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export const BarberProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { usuario, isAuth } = useAuthStore(); // Usamos isAuth para verificar sesión

  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');

  // 1. Cargar datos
  const { data: barbero, isLoading: loadingBarber } = useBarber(id!);
  const { data: resenas, isLoading: loadingReviews, createResena, isCreating } = useResenas(id!);

  // Verificar si el usuario ya comentó (Evitar duplicados)
  const userHasReviewed = useMemo(() => {
    if (!resenas || !usuario) return false;
    return resenas.some((r: any) => r.clienteId === usuario.id || r.cliente?.usuario?.id === usuario.id);
  }, [resenas, usuario]);

  // 2. Calcular Promedio Local (Fallback visual)
  const stats = useMemo(() => {
    if (!resenas || resenas.length === 0) return { promedio: 0, total: 0 };
    const suma = resenas.reduce((acc: number, r: any) => acc + Number(r.calificacion || 0), 0);
    return {
      promedio: suma / resenas.length,
      total: resenas.length
    };
  }, [resenas]);

  const displayPromedio = barbero?.promedio || stats.promedio;
  const displayTotal = barbero?.cantidadResenas || stats.total;

  // 3. LÓGICA DE ENVÍO DE RESEÑA
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (calificacion === 0) return toast.error('Debes seleccionar una calificación (estrellas).');
    if (comentario.trim().length < 5) return toast.error('Escribe un comentario un poco más largo.');

    createResena({
      barberoId: id!,
      calificacion: Number(calificacion),
      comentario: comentario.trim()
    }, {
      onSuccess: () => {
        setComentario('');
        setCalificacion(0);
        toast.success("¡Gracias por tu opinión!");
      }
    });
  };

  if (loadingBarber) return <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]"></div></div>;
  if (!barbero) return <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center text-zinc-500">Barbero no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-24">
        <button onClick={() => navigate(-1)} className="group flex items-center text-zinc-500 hover:text-[#C9A227] font-bold uppercase tracking-widest text-xs transition-colors">
          <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" /> Volver
        </button>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 pb-24">

        {/* --- HEADER DEL PERFIL --- */}
        <div className="bg-[#131313] rounded-3xl shadow-2xl shadow-black border border-white/5 overflow-hidden relative group">
          <div className="h-40 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-[#131313]"></div>
          </div>

          <div className="px-6 md:px-10 pb-10 relative">
            <div className="flex flex-col md:flex-row justify-between items-end -mt-20 mb-8 gap-6">
              <div className="flex flex-col md:flex-row items-end gap-6 text-center md:text-left w-full md:w-auto">
                <div className="p-1.5 rounded-full bg-[#131313] border border-[#C9A227]/30 shadow-[0_0_30px_rgba(201,162,39,0.15)] mx-auto md:mx-0 relative group/avatar">
                  <div className="w-36 h-36 rounded-full overflow-hidden bg-[#0a0a0a] relative">
                    {barbero.fotoUrl ? (
                      <img src={barbero.fotoUrl} alt="Perfil" className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700"><User size={48} /></div>
                    )}
                  </div>
                </div>

                <div className="mb-2 w-full md:w-auto">
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-1 text-center md:text-left">
                    {barbero.usuario?.nombre} <span className="text-[#C9A227]">{barbero.usuario?.apellido}</span>
                  </h1>
                  <p className="text-zinc-400 font-medium text-lg mb-3 flex items-center justify-center md:justify-start gap-2">
                    <span className="w-8 h-[1px] bg-[#C9A227]"></span>
                    {barbero.especialidad || 'Estilista Profesional'}
                  </p>
                  <div className="mb-4 flex justify-center md:justify-start">
                    <StarDisplay rating={displayPromedio} count={displayTotal} size={20} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/reservar', { state: { barberId: barbero.id } })}
                className="w-full md:w-auto bg-[#C9A227] hover:bg-[#b89322] text-[#131313] px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#C9A227]/20"
              >
                <Calendar size={18} strokeWidth={2.5} /> Reservar Turno
              </button>
            </div>
          </div>
        </div>

        {/* --- SECCIÓN DE OPINIONES --- */}
        <div className="bg-[#131313] rounded-3xl shadow-xl border border-white/5 p-6 md:p-10">
          <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
            <div className="bg-[#1A1A1A] p-3 rounded-xl text-[#C9A227]">
              <MessageCircle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Opiniones de Clientes</h2>
              <p className="text-zinc-500 text-sm">Experiencias reales sobre {barbero.usuario?.nombre}</p>
            </div>
          </div>

          {/* FORMULARIO DE RESEÑA */}
          {/* Lógica: Solo mostrar si está logueado Y NO ha comentado antes */}
          {isAuth ? (
            !userHasReviewed ? (
              <form onSubmit={handleReviewSubmit} className="bg-[#0a0a0a] p-6 md:p-8 rounded-2xl mb-12 border border-white/5 relative overflow-hidden group/form transition-all hover:border-white/10">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A227]"></div>

                <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-lg">
                  ¿Te atendiste con {barbero.usuario?.nombre}? <span className="text-[#C9A227]">Cuéntanos.</span>
                </h3>

                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Tu Calificación</label>
                  <StarRatingInput rating={calificacion} setRating={setCalificacion} disabled={isCreating} />
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Tu Comentario</label>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder={`Excelente atención, ${barbero.usuario?.nombre} es un crack...`}
                    className="w-full p-4 rounded-xl bg-[#131313] border border-zinc-800 text-white placeholder-zinc-600 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none resize-none h-32 transition-all"
                    disabled={isCreating}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isCreating || calificacion === 0 || !comentario.trim()}
                    className="bg-white hover:bg-zinc-200 text-black px-8 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wide text-xs flex items-center gap-2"
                  >
                    {isCreating ? <span className="animate-pulse">Publicando...</span> : <><Send size={14} /> Publicar Opinión</>}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-[#C9A227]/10 border border-[#C9A227]/20 p-6 rounded-2xl mb-10 text-center">
                <p className="text-[#C9A227] font-bold">¡Ya has valorado a este profesional!</p>
                <p className="text-zinc-400 text-sm mt-1">Gracias por compartir tu experiencia con la comunidad.</p>
              </div>
            )
          ) : (
            <div className="bg-[#1A1A1A] p-8 rounded-2xl mb-10 text-center border border-white/5">
              <p className="text-zinc-300 mb-4">Inicia sesión para dejar una reseña.</p>
              <button onClick={() => navigate('/login')} className="text-[#C9A227] font-bold hover:underline uppercase text-xs tracking-widest">
                Ir al Login
              </button>
            </div>
          )}

          {/* LISTA DE RESEÑAS */}
          <div className="space-y-8 mt-8">
            {loadingReviews ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227] mx-auto mb-2"></div>
              </div>
            ) : resenas?.length === 0 ? (
              <div className="text-center py-16 opacity-50">
                <MessageCircle size={40} className="mx-auto text-zinc-600 mb-3" />
                <p className="text-zinc-500">Aún no hay opiniones. ¡Sé el primero!</p>
              </div>
            ) : (
              resenas?.map((review: any) => (
                <div key={review.id} className="border-b border-white/5 last:border-0 pb-8 last:pb-0 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[#C9A227] font-bold text-sm">
                        {review.cliente?.usuario?.nombre?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-200 text-sm">
                          {review.cliente?.usuario?.nombre} {review.cliente?.usuario?.apellido}
                        </p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          {new Date(review.fecha).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#0a0a0a] px-3 py-1 rounded-lg border border-white/5">
                      <StarDisplay rating={Number(review.calificacion)} showCount={false} size={14} />
                    </div>
                  </div>
                  <p className="text-zinc-400 pl-[56px] text-sm leading-relaxed">
                    {review.comentario}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberProfile;