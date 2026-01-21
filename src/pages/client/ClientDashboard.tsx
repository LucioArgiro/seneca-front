import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useMisTurnos } from '../../hooks/useTurnos';
import { useMisMensajes } from '../../hooks/useMensajes';
import { Navbar } from '../../components/Navbar';
import MisMensajesList from '../../components/client/MisMensajesList';
import { TurnoCard } from '../../components/dashboard/TurnoCard'; // Ensure this matches your file path
import { Calendar, MapPin, Phone, Clock, Plus, Scissors, LayoutDashboard, MessageSquare } from 'lucide-react';

const ClientDashboard = () => {
    const navigate = useNavigate();

    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'turnos' | 'mensajes'>('turnos');

    // These hooks handle data fetching
    const { proximos, isLoading: loadingTurnos, cancelarTurno } = useMisTurnos();
    const { data: mensajes } = useMisMensajes();

    // Memoized notification count logic
    const notificaciones = useMemo(() => {
        if (!mensajes) return 0;
        return mensajes.filter((m: any) => {
            const replies = m.replies || [];
            if (replies.length > 0) {
                const ultimo = replies[replies.length - 1];
                return ultimo.autor?.role !== 'CLIENT';
            }
            return !!m.respuesta;
        }).length;
    }, [mensajes]);

    const handleCancelar = (id: string) => {
        if (confirm('¿Seguro que deseas cancelar este turno?')) {
            cancelarTurno(id);
        }
    };

    if (loadingTurnos) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <p className="animate-pulse text-slate-400">Cargando panel...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Hola, {user?.fullname?.split(' ')[0]} 👋</h1>
                        <p className="text-slate-500 mt-1">Bienvenido a tu panel personal.</p>
                    </div>
                    {activeTab === 'turnos' && (
                        <button
                            onClick={() => navigate('/reservar')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition hover:-translate-y-1"
                        >
                            <Plus size={20} /> Agendar Turno
                        </button>
                    )}
                </div>

                {/* TABS */}
                <div className="flex gap-8 border-b border-slate-200 mb-8">
                    <button
                        onClick={() => setActiveTab('turnos')}
                        className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 transition-all border-b-2 ${activeTab === 'turnos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <LayoutDashboard size={18} /> Mis Turnos
                    </button>

                    <button
                        onClick={() => setActiveTab('mensajes')}
                        className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 transition-all border-b-2 relative ${activeTab === 'mensajes' ? 'border-[#c4a484] text-[#c4a484]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <MessageSquare size={18} />
                        Mis Consultas
                        {notificaciones > 0 && activeTab !== 'mensajes' && (
                            <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                                {notificaciones}
                            </span>
                        )}
                    </button>
                </div>

                {/* CONTENT AREA */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {activeTab === 'turnos' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* LEFT COLUMN: Appointments */}
                            <div className="lg:col-span-2 space-y-10">
                                {/* Upcoming Appointments */}
                                <section>
                                    <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800">
                                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Calendar size={18} /></div> Próximos Turnos
                                    </h2>
                                    {proximos.length === 0 ? (
                                        <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-10 text-center">
                                            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Scissors className="text-slate-300" size={24} /></div>
                                            <p className="text-slate-500 mb-4 font-medium">No tienes cortes programados.</p>
                                            <button onClick={() => navigate('/reservar')} className="text-blue-600 font-bold hover:underline text-sm">¡Reserva ahora!</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {proximos.map((turno: any) => (
                                                <TurnoCard
                                                    key={turno.id}
                                                    turno={turno}
                                                    onCancel={handleCancelar}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </section>


                            </div>

                            {/* RIGHT COLUMN: Info */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">Información del Local</h3>
                                    <ul className="space-y-4 text-sm text-slate-600">
                                        <li className="flex gap-3"><MapPin className="text-blue-600 shrink-0 mt-0.5" size={18} /><span>Av. Aconquija 1234<br />Tucumán, Argentina</span></li>
                                        <li className="flex gap-3"><Clock className="text-blue-600 shrink-0 mt-0.5" size={18} /><div><p className="flex justify-between w-full gap-4"><span>Lun - Sáb:</span> <span className="font-bold text-slate-800">9:00 - 21:00</span></p></div></li>
                                        <li className="flex gap-3"><Phone className="text-blue-600 shrink-0 mt-0.5" size={18} /><span className="font-bold text-slate-800">+54 381 444-5555</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'mensajes' && (
                        <div className="w-full">
                            <MisMensajesList />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;