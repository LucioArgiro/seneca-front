import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useResenas } from '../../hooks/useResenas';
import { useBarber } from '../../hooks/useBarber';
import { Navbar } from '../../components/Navbar';
import { StarDisplay } from '../../components/StarDisplay';
import { MapPin, Calendar, User, MessageCircle, ArrowLeft, Scissors } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Componente interno para el INPUT de estrellas (Clickable) - Estilo Luxury
const StarRatingInput = ({ rating, setRating, disabled }: { rating: number, setRating: (r: number) => void, disabled: boolean }) => {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => setRating(star)}
          className={`text-2xl transition-all duration-300 ${star <= rating ? 'text-[#C9A227] scale-110 drop-shadow-[0_0_8px_rgba(201,162,39,0.6)]' : 'text-zinc-700 hover:text-zinc-500'} ${!disabled && 'hover:scale-110'}`}
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
  const { usuario, token } = useAuthStore();

  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');

  // 1. Cargar datos
  const { data: barbero, isLoading: loadingBarber } = useBarber(id!);
  const { data: resenas, isLoading: loadingReviews, createResena, isCreating } = useResenas(id!);

  const userHasReviewed = resenas?.some((r) => r.cliente?.usuario?.id === usuario?.id);

  // 2. Calcular Promedio
  const stats = useMemo(() => {
    if (!resenas || resenas.length === 0) return { promedio: 0, total: 0 };
    const suma = resenas.reduce((acc, r) => acc + Number(r.calificacion || 0), 0);
    return {
      promedio: suma / resenas.length,
      total: resenas.length
    };
  }, [resenas]);

  const displayPromedio = barbero?.promedio || stats.promedio;
  const displayTotal = barbero?.cantidadResenas || stats.total;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calificacion === 0) return toast.error('Selecciona las estrellas');

    createResena({
      barberoId: id!,
      calificacion: Number(calificacion),
      comentario
    }, {
      onSuccess: () => {
        setComentario('');
        setCalificacion(0);
        toast.success("¡Opinión publicada!");
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

          {/* Fondo decorativo */}
          <div className="h-40 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-granular-dark"></div>
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#131313] to-transparent"></div>
          </div>

          <div className="px-6 md:px-10 pb-10 relative">
            <div className="flex flex-col md:flex-row justify-between items-end -mt-20 mb-8 gap-6">

              <div className="flex flex-col md:flex-row items-end gap-6 text-center md:text-left w-full md:w-auto">
                {/* Avatar con borde dorado */}
                <div className="p-1.5 rounded-full bg-[#131313] border border-[#C9A227]/30 shadow-[0_0_30px_rgba(201,162,39,0.15)] mx-auto md:mx-0 relative group/avatar">
                  <div className="w-36 h-36 rounded-full overflow-hidden bg-[#0a0a0a] relative">
                    {barbero.fotoUrl ? (
                      <img src={barbero.fotoUrl} alt="Perfil" className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700"><User size={48} /></div>
                    )}
                  </div>
                  {/* Badge de Verificado/Profesional */}
                  <div className="absolute bottom-2 right-2 bg-[#C9A227] text-[#131313] p-1.5 rounded-full border-4 border-[#131313]" title="Profesional Verificado">
                    <Scissors size={14} fill="#131313" />
                  </div>
                </div>

                <div className="mb-2 w-full md:w-auto">
                  {/* NOMBRE */}
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-1 text-center md:text-left">
                    {barbero.usuario?.nombre} <span className="text-[#C9A227]">{barbero.usuario?.apellido}</span>
                  </h1>

                  {/* ESPECIALIDAD - Centrado en móvil con justify-center */}
                  <p className="text-zinc-400 font-medium text-lg mb-3 flex items-center justify-center md:justify-start gap-2">
                    <span className="w-8 h-[1px] bg-[#C9A227]"></span>
                    {barbero.especialidad || 'Estilista Profesional'}
                  </p>

                  {/* ⭐ ESTRELLAS HEADER - Centrado en móvil */}
                  <div className="mb-4 flex justify-center md:justify-start">
                    <StarDisplay rating={displayPromedio} count={displayTotal} size={20} />
                  </div>

                  {/* UBICACIÓN - Centrado en móvil */}
                  {(barbero.provincia || barbero.pais) && (
                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                      <MapPin size={14} className="text-[#C9A227]" />
                      <span>{barbero.provincia}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón Reservar */}
              <button
                onClick={() => navigate('/reservar', { state: { barberId: barbero.id } })}
                className="w-full md:w-auto bg-[#C9A227] hover:bg-[#131313] text-[#131313] hover:text-[#C9A227] border border-transparent hover:border-[#C9A227]/50 px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar size={18} strokeWidth={2.5} /> Reservar Turno
              </button>
            </div>

            {barbero.biografia && (
              <div className="mt-8 pt-8 border-t border-white/5">
                <h3 className="font-bold text-[#C9A227] mb-3 text-xs uppercase tracking-widest text-center md:text-left">Biografía</h3>
                <p className="text-zinc-400 leading-relaxed text-base md:text-lg max-w-3xl text-center md:text-left">{barbero.biografia}</p>
              </div>
            )}
          </div>
        </div>

        {/* --- SECCIÓN DE OPINIONES --- */}
        <div className="bg-[#131313] rounded-3xl shadow-xl shadow-black/50 border border-white/5 p-6 md:p-10">
          <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6 justify-center md:justify-start">
          <div className="bg-[#131313] p-3 rounded-xl text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313]">
              <MessageCircle size={24} />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-white tracking-tight">Opiniones de Clientes</h2>
              <p className="text-zinc-500 text-sm">Lo que dicen sobre {barbero.usuario?.nombre}</p>
            </div>
          </div>

          {/* Formulario de Reseña */}
          {token && !userHasReviewed && (
            <form onSubmit={handleReviewSubmit} className="bg-[#0a0a0a] p-6 md:p-8 rounded-2xl mb-12 border border-white/5 relative overflow-hidden group/form">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A227] opacity-50"></div>

              <h3 className="font-bold text-zinc-300 mb-6 flex items-center gap-2 justify-center md:justify-start">
                Dejanos tu experiencia
              </h3>

              <div className="mb-6">
                <label className="block text-[10px] font-bold text-[#C9A227] uppercase tracking-widest mb-3 text-center md:text-left">Tu Calificación</label>
                <div className="flex justify-center md:justify-start">
                  <StarRatingInput rating={calificacion} setRating={setCalificacion} disabled={isCreating} />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 text-center md:text-left">Tu Comentario</label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="¿Qué te pareció el servicio? Cuéntanos..."
                  className="w-full p-4 rounded-xl bg-[#131313] border border-white/10 text-white placeholder-zinc-600 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none resize-none h-32 transition-all"
                  disabled={isCreating}
                />
              </div>

              <div className="flex justify-center md:justify-end">
                <button
                  type="submit"
                  disabled={isCreating || calificacion === 0}
                  className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 disabled:opacity-50 transition-all uppercase tracking-wide text-sm w-full md:w-auto"
                >
                  {isCreating ? 'Publicando...' : 'Publicar Opinión'}
                </button>
              </div>
            </form>
          )}

          {/* Lista de Reseñas */}
          <div className="space-y-8">
            {loadingReviews ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227] mx-auto mb-2"></div>
                <span className="text-zinc-500 text-sm">Cargando opiniones...</span>
              </div>
            ) : resenas?.length === 0 ? (
              <div className="text-center py-16 bg-[#1A1A1A]/50 rounded-2xl border border-dashed border-zinc-800">
                <MessageCircle size={40} className="mx-auto text-zinc-700 mb-3" />
                <p className="text-zinc-500">Aún no hay opiniones para este profesional.</p>
              </div>
            ) : (
              resenas?.map((review) => (
                <div key={review.id} className="border-b border-white/5 last:border-0 pb-8 last:pb-0 group/review transition-colors hover:bg-white/[0.02] p-4 -mx-4 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4">
                      {/* Avatar Cliente */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A1A1A] to-[#0a0a0a] border border-[#C9A227]/50 flex items-center justify-center text-zinc-400 font-bold text-sm shadow-md">
                        {review.cliente?.usuario?.nombre?.charAt(0) || "C"}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-200 text-sm flex items-center gap-2">
                          {review.cliente?.usuario?.nombre} {review.cliente?.usuario?.apellido}
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 font-normal">Cliente</span>
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">
                          {new Date(review.fecha).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Estrellas Estáticas */}
                    <div className="bg-[#0a0a0a] px-2 py-1 rounded-lg border border-white/5">
                      <StarDisplay
                        rating={Number(review.calificacion)}
                        showCount={false}
                        size={14}
                      />
                    </div>
                  </div>
                  <p className="text-zinc-400 leading-relaxed pl-[56px] text-sm md:text-base relative">
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