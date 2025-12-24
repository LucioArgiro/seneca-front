import { useEffect, useState } from 'react';
import { getTurnos, cancelarTurnoCliente, type TurnoResponse } from '../api/turnos';
import { useAuthStore } from '../store/auth';
import { BookingModal } from '../components/dashboard/BookingModal';
import { Navbar } from '../components/Navbar';
import { X, Calendar, MapPin, Phone, Clock, Plus, History, Scissors } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuthStore();
  const [turnos, setTurnos] = useState<TurnoResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const cargarTurnos = async () => {
    try {
      setLoading(true);
      const data = await getTurnos();
      setTurnos(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { cargarTurnos(); }, []);
  const handleCancelar = async (id: string) => {
    if (!confirm('¿Seguro que deseas cancelar este turno?')) return;
    try {
      await cancelarTurnoCliente(id);
      cargarTurnos();
    } catch (error) { alert('Error al cancelar'); }
  };
  const now = new Date();
  const proximos = turnos
    .filter(t => new Date(t.fecha) >= now && t.estado !== 'CANCELADO')
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  const historial = turnos
    .filter(t => new Date(t.fecha) < now || t.estado === 'CANCELADO')
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  return (

    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* HEADER DE BIENVENIDA */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Hola, {user?.fullname?.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 mt-1">Aquí tienes el estado de tus próximas visitas.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition hover:-translate-y-1"
          >
            <Plus size={20} />
            Agendar Turno
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* COLUMNA IZQUIERDA (2/3): TURNOS */}
          <div className="lg:col-span-2 space-y-10">

            {/* SECCIÓN PRÓXIMOS */}
            <section>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                  <Calendar size={18} />
                </div>
                Próximos Turnos
              </h2>

              {proximos.length === 0 ? (
                // EMPTY STATE MEJORADO
                <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-10 text-center shadow-sm">
                  <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Scissors className="text-slate-300" size={24} />
                  </div>
                  <p className="text-slate-500 mb-4 font-medium">No tienes cortes programados.</p>
                  <button onClick={() => setIsModalOpen(true)} className="text-blue-600 font-bold hover:underline text-sm">
                    ¡Reserva tu lugar ahora!
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {proximos.map(turno => (
                    // TARJETA DE TURNO (LIGHT MODE)
                    <div key={turno.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">

                      {/* Borde lateral de estado */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${turno.estado === 'PENDIENTE' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>

                      <div className="flex flex-col sm:flex-row justify-between gap-6 pl-4">
                        {/* Info Principal */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide border
                                ${turno.estado === 'PENDIENTE'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-green-50 text-green-700 border-green-200'
                              }`}>
                              {turno.estado}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">#{turno.id.slice(0, 6)}</span>
                          </div>

                          <h3 className="text-xl font-bold text-slate-800 mb-1">{turno.servicio?.nombre}</h3>
                          <p className="text-slate-500 text-sm mb-5 flex items-center gap-1">
                            Con <span className="font-semibold text-slate-700">{turno.barbero?.fullname}</span>
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              <Calendar size={16} className="text-blue-500" />
                              <span className="font-medium capitalize">{new Date(turno.fecha).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              <Clock size={16} className="text-blue-500" />
                              <span className="font-medium">{new Date(turno.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</span>
                            </div>
                          </div>
                        </div>

                        {/* Precio y Acciones */}
                        <div className="flex flex-col justify-between items-end gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                          <div className="text-right">
                            <p className="text-xs text-slate-400 font-bold uppercase">Total</p>
                            <span className="text-3xl font-bold text-slate-900 tracking-tight">${turno.servicio?.precio}</span>
                          </div>

                          {turno.estado === 'PENDIENTE' && (
                            <button
                              onClick={() => handleCancelar(turno.id)}
                              className="px-4 py-2 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-400 rounded-lg text-xs font-bold transition flex items-center gap-2"
                            >
                              <X size={14} /> Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SECCIÓN HISTORIAL */}
            <section>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-400">
                <History className="text-slate-400" size={18} /> Historial Reciente
              </h2>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {historial.length === 0 ? (
                  <div className="p-6 text-slate-400 text-center text-sm">Aún no tienes historial de cortes.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {historial.slice(0, 3).map(turno => (
                      <div key={turno.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <Scissors size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 text-sm">{turno.servicio?.nombre}</p>
                            <p className="text-xs text-slate-400 capitalize">
                              {new Date(turno.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
                            </p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold border
                                ${turno.estado === 'CANCELADO'
                            ? 'bg-red-50 text-red-600 border-red-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                          {turno.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA (1/3): INFO */}
          <div className="space-y-6">

            {/* TARJETA LOCAL (Blanca) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">Información del Local</h3>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <MapPin className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <span>Av. Corrientes 1234<br />Buenos Aires, Argentina</span>
                </li>
                <li className="flex gap-3">
                  <Clock className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="flex justify-between w-full gap-4"><span>Lun - Vie:</span> <span className="font-bold text-slate-800">10:00 - 20:00</span></p>
                    <p className="flex justify-between w-full gap-4"><span>Sábados:</span> <span className="font-bold text-slate-800">10:00 - 16:00</span></p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <span className="font-bold text-slate-800">+54 11 1234-5678</span>
                </li>
              </ul>

              <div className="mt-6 h-32 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs border border-slate-200">
                [Mapa de Google Maps]
              </div>
            </div>

            {/* TARJETA PROMO (Gradiente) */}
            <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg shadow-blue-500/20 text-white relative overflow-hidden">
              {/* Decoración de fondo */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

              <div className="bg-white/20 backdrop-blur-sm w-fit px-2 py-0.5 rounded text-[10px] font-bold mb-3 border border-white/20">PROMO ESPECIAL</div>
              <h3 className="text-lg font-bold mb-2">¡Trae a un amigo! 🤝</h3>
              <p className="text-blue-100 text-sm mb-5 leading-relaxed">
                Obtén un <span className="font-bold text-white">20% de descuento</span> en tu próximo corte si vienes acompañado.
              </p>
              <button className="w-full bg-white text-blue-700 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition text-sm shadow-sm">
                Ver Condiciones
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* RENDERIZADO DEL MODAL */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={cargarTurnos}
        userId={user?.id || ''}
      />
    </div>
  );
};

export default ClientDashboard;