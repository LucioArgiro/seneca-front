import { Navbar } from '../../components/Navbar';
import { ArrowLeft, Loader2, Scissors, User } from 'lucide-react';
import { useReservaForm } from '../../hooks/useReservaForm';
// 👇 Importamos nuestros nuevos componentes limpios
import { SelectionCard } from '../../components/client/SelectionCard';
import { ResumenReserva } from '../../components/client/ResumenReserva';

export const ReservarTurno = () => {
  // 🔥 LÓGICA: Toda la magia ocurre aquí dentro
  const { formState, setters, data, status, actions } = useReservaForm();

  // Si está cargando datos iniciales, spinner
  if (status.isLoading) return <div className="h-screen flex items-center justify-center text-slate-400"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans text-slate-800">
      <Navbar />

      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex gap-4 items-center">
          <button onClick={() => actions.navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20}/></button>
          <h1 className="font-bold text-lg">{status.isReprogramming ? 'Reprogramar Cita' : 'Nueva Reserva'}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={actions.handleSubmit} className="grid lg:grid-cols-3 gap-8">

          {/* === COLUMNA IZQUIERDA (INPUTS) === */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* CARD 1: SERVICIO Y BARBERO */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Scissors className="text-blue-600"/> Servicio y Profesional</h2>
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
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User className="text-blue-600"/> Fecha y Hora</h2>
                
                <div className="mb-6">
                  <label className="block text-slate-500 text-xs font-bold uppercase mb-1.5 ml-1">Fecha</label>
                  <input 
                    type="date" 
                    value={formState.selectedDate} 
                    onChange={e => { setters.setSelectedDate(e.target.value); setters.setSelectedTime(''); }} 
                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    min={new Date().toLocaleDateString('en-CA')}
                  />
                </div>
                
                <label className="block text-slate-500 text-xs font-bold uppercase mb-3 ml-1">Horarios Disponibles</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                   {status.loadingHorarios ? (
                      <div className="col-span-full flex justify-center py-8"><Loader2 className="animate-spin text-blue-500"/></div>
                   ) : data.horariosDisponibles.length === 0 ? (
                      <div className="col-span-full text-center text-sm text-slate-400 py-4 bg-slate-50 rounded-xl border border-dashed">No hay turnos para esta fecha.</div>
                   ) : (
                      data.horariosDisponibles.map(hora => (
                        <button 
                          key={hora} type="button"
                          onClick={() => setters.setSelectedTime(hora)}
                          className={`py-2 px-1 rounded-xl text-sm font-bold border transition-all ${formState.selectedTime === hora ? 'bg-slate-900 text-white border-slate-900 scale-105 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                        >
                          {hora}
                        </button>
                      ))
                   )}
                </div>
            </div>

            {/* MENSAJE DE ERROR */}
            {data.errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-medium border border-red-100">{data.errorMsg}</div>}
          </div>

          {/* === COLUMNA DERECHA (RESUMEN & PAGO) === */}
          <div className="lg:col-span-1">
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

        </form>
      </div>
    </div>
  );
};