import { Navbar } from '../../components/Navbar';
import { ArrowLeft, Loader2, Scissors, User, Calendar, Clock } from 'lucide-react';
import { useReservaForm } from '../../hooks/useReservaForm';
import { SelectionCard } from '../../components/client/SelectionCard';
import { ResumenReserva } from '../../components/client/ResumenReserva';
import { CustomCalendar } from '../../components/client/CustomCalendar';

export const ReservarTurno = () => {
  const { formState, setters, data, status, actions } = useReservaForm();

  if (status.isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a] gap-4">
      <Loader2 className="animate-spin text-[#C9A227]" size={40} />
      <p className="text-[#C9A227] font-serif tracking-widest animate-pulse text-sm">CARGANDO DISPONIBILIDAD...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 pt-20 font-sans text-slate-200 selection:bg-[#C9A227] selection:text-[#131313]">
      <Navbar />

      {/* HEADER NORMAL (Ya no es sticky) */}
      <div className="bg-[#0a0a0a] border-b border-white/5 mb-8">
        <div className="max-w-6xl mx-auto p-4">
          <button onClick={() => actions.navigate(-1)} className="group flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer outline-none">
            <div className="p-2 rounded-full text-zinc-400 transition-colors duration-300 group-hover:text-[#C9A227]"><ArrowLeft size={24} strokeWidth={2.5} /></div>
            <h1 className="font-black text-xl text-white tracking-tight transition-colors duration-300 group-hover:text-[#C9A227]">{status.isReprogramming ? 'Reprogramar Cita' : 'Nueva Reserva'}</h1>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <form onSubmit={actions.handleSubmit} className="grid lg:grid-cols-3 gap-8">

          {/* === COLUMNA IZQUIERDA (INPUTS) === */}
          <div className="lg:col-span-2 space-y-6">

            {/* CARD 1: SERVICIO Y BARBERO */}
            <div className="bg-[#131313] rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 border border-[#C9A227]/20 relative group">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-wide">
                <div className="p-2.5 bg-[#131313] rounded-xl text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] border border-[#C9A227]/30">
                  <Scissors size={20} />
                </div>
                Servicio y Profesional
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <SelectionCard
                  label="Servicio" icon={Scissors} placeholder="Selecciona..."
                  value={formState.selectedService} onChange={setters.setSelectedService}
                  options={data.servicios.map(s => ({ id: s.id, label: `${s.nombre} ($${s.precio})` }))}
                />
                <SelectionCard
                  label="Profesional" icon={User} placeholder="Cualquiera..."
                  value={formState.selectedBarber} onChange={setters.setSelectedBarber}
                  options={data.barberos.map(b => ({ id: b.id, label: `${b.usuario.nombre} ${b.usuario.apellido}` }))}
                />
              </div>
            </div>

            {/* CARD 2: FECHA Y HORA */}
            <div className="bg-[#131313] rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 border border-[#C9A227]/20 relative overflow-hidden">

              <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-wide">
                <div className="p-2.5 bg-[#131313] rounded-xl text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] border border-[#C9A227]/30 shadow-[0_0_15px_rgba(201,162,39,0.1)]">
                  <Calendar size={20} />
                </div>
                Fecha y Hora
              </h2>

              <div className="mb-8">
                {/* 👇 AQUÍ ESTÁ EL CAMBIO: Usamos nuestro CustomCalendar */}
                <CustomCalendar
                  value={formState.selectedDate}
                  onChange={(date) => {
                    setters.setSelectedDate(date);
                    setters.setSelectedTime(''); // Reseteamos la hora al cambiar de día
                  }}
                />
              </div>

              <div className="flex items-center gap-2 mb-4 ml-1">
                <Clock size={16} className="text-[#C9A227]" />
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest">Horarios Disponibles</label>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {status.loadingHorarios ? (
                  <div className="col-span-full flex justify-center py-12"><Loader2 className="animate-spin text-[#C9A227]" size={32} /></div>
                ) : data.horariosDisponibles.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center text-center py-10 bg-[#1A1A1A]/50 rounded-2xl border border-dashed border-[#333]">
                    <p className="text-sm text-zinc-500 font-medium">No hay turnos disponibles para esta fecha.</p>
                  </div>
                ) : (
                  data.horariosDisponibles.map(hora => (
                    <button
                      key={hora} type="button"
                      onClick={() => setters.setSelectedTime(hora)}
                      className={`
                            py-3 px-2 rounded-xl text-sm font-bold border transition-all duration-300 relative overflow-hidden group/time
                            ${formState.selectedTime === hora
                          ? 'bg-[#C9A227] text-[#131313] border-[#C9A227] scale-105 shadow-[0_0_20px_rgba(201,162,39,0.4)]'
                          : 'bg-[#1A1A1A] text-zinc-400 border-[#333] hover:border-[#C9A227]/50 hover:text-white hover:bg-[#202020]'
                        }
                          `}
                    >
                      {hora}
                    </button>
                  ))
                )}
              </div>
            </div>

            {data.errorMsg && (
              <div className="bg-red-900/10 text-red-400 p-4 rounded-xl font-bold text-sm border border-red-900/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                ⚠️ {data.errorMsg}
              </div>
            )}
          </div>

          {/* === COLUMNA DERECHA (RESUMEN) === */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ResumenReserva
                serviceInfo={data.serviceInfo}
                barberInfo={data.barberInfo}
                fechaResumen={data.fechaResumen}
                hora={formState.selectedTime}
                precios={data.precios}
                opcionPago={formState.opcionPago}
                setOpcionPago={setters.setOpcionPago}
                isSubmitting={status.isSubmitting}
                isReprogramming={status.isReprogramming}
              />
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};