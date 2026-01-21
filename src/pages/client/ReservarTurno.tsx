import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Calendar, Scissors, User, AlertCircle, Loader2, ArrowLeft,
  CheckCircle2, RefreshCw, Wallet, Clock, MapPin, Receipt, CreditCard, Store
} from 'lucide-react';

import { Navbar } from '../../components/Navbar';
import { useDisponibilidad } from '../../hooks/useDisponibilidad';
import { turnosApi } from '../../api/turnos';
import { getServicios, type Servicio } from '../../api/servicios';
import { barberosApi } from '../../api/barberos';
import type { BarberoPerfil } from '../../types';

// ==========================================
// 🧠 1. CUSTOM HOOK (Toda la lógica aquí)
// ==========================================
const useReservaLogic = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const queryClient = useQueryClient();

  // Datos de navegación
  const isReprogramming = state?.modo === 'reprogramar';
  const turnoOriginal = state?.turno;

  // Estados de Datos
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [barberos, setBarberos] = useState<BarberoPerfil[]>([]);

  // Estados del Formulario
  const [selectedService, setSelectedService] = useState(turnoOriginal?.servicio?.id || '');
  const [selectedBarber, setSelectedBarber] = useState(turnoOriginal?.barbero?.id || state?.barberId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [metodoPago, setMetodoPago] = useState<'LOCAL' | 'ONLINE'>('LOCAL');

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 🔄 Carga Inicial
  useEffect(() => {
    Promise.all([getServicios(), barberosApi.getAll()])
      .then(([s, b]) => {
        setServicios(s.filter(serv => serv.activo));
        setBarberos(b);

        // Pre-selección inteligente
        const idPre = turnoOriginal?.barbero?.id || state?.barberId;
        if (idPre && b.find(barb => barb.id === idPre)) {
          setSelectedBarber(idPre);
        }
      })
      .catch(console.error);
  }, []);

  // 🧮 Datos Derivados
  const serviceInfo = useMemo(() => servicios.find(s => s.id === selectedService), [selectedService, servicios]);
  const barberInfo = useMemo(() => barberos.find(b => b.id === selectedBarber), [selectedBarber, barberos]);

  // 🕒 Integración de Horarios Dinámicos
  // Extraemos la configuración horaria del barbero seleccionado (o array vacío)
  const horariosConfig = useMemo(() => barberInfo?.horarios || [], [barberInfo]);

  const { horariosDisponibles, isLoading: loadingHorarios } = useDisponibilidad(
    selectedDate,
    selectedBarber,
    horariosConfig // 👈 ¡Aquí pasamos la configuración dinámica!
  );

  const fechaResumen = useMemo(() => {
    if (!selectedDate) return 'Fecha no seleccionada';
    return new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' });
  }, [selectedDate]);

  // 🚀 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return setError('Por favor selecciona un horario.');

    setIsSubmitting(true);
    setError('');

    try {
      const fechaISO = `${selectedDate}T${selectedTime}:00`;

      if (isReprogramming) {
        await turnosApi.reprogramarTurno(turnoOriginal.id, fechaISO);
      } else {
        await turnosApi.createTurno({
          fecha: fechaISO,
          barberoId: selectedBarber,
          servicioId: selectedService,
          // metodoPago envialo si el back lo soporta
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['mis-turnos'] });
      await queryClient.invalidateQueries({ queryKey: ['disponibilidad'] });
      navigate('/panel');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 409) {
        setError('⚠️ Ese horario ya está ocupado. Elige otro.');
        queryClient.invalidateQueries({ queryKey: ['disponibilidad'] });
      } else {
        setError(msg ? `❌ ${msg}` : '❌ Error al procesar.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    navigate, isReprogramming, servicios, barberos,
    selectedService, setSelectedService,
    selectedBarber, setSelectedBarber,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    metodoPago, setMetodoPago,
    isSubmitting, error,
    horariosDisponibles, loadingHorarios,
    serviceInfo, barberInfo, fechaResumen, handleSubmit
  };
};

// ==========================================
// 🎨 2. SUB-COMPONENTES (UI Pura)
// ==========================================

const SelectionCard = ({ label, icon: Icon, options, value, onChange, disabled, placeholder }: any) => (
  <div>
    <label className="block text-slate-500 text-xs font-bold uppercase mb-1.5 ml-1">{label}</label>
    <div className="relative group">
      <Icon className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" size={18} />
      <select
        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none disabled:bg-slate-50 disabled:text-slate-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
    </div>
  </div>
);

// ==========================================
// 🚀 3. COMPONENTE PRINCIPAL
// ==========================================
export const ReservarTurno = () => {
  const logic = useReservaLogic();

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 pb-20">
      <Navbar />

      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => logic.navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {logic.isReprogramming ? <><RefreshCw size={18} className="text-amber-600" /> Reprogramar Cita</> : 'Nueva Reserva'}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={logic.handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- COLUMNA IZQUIERDA --- */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. SELECCIÓN DE SERVICIO Y BARBERO */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Scissors size={20} className="text-blue-600" /> Servicio y Profesional
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <SelectionCard
                  label="Servicio"
                  icon={Scissors}
                  value={logic.selectedService}
                  onChange={logic.setSelectedService}
                  disabled={logic.isReprogramming}
                  placeholder="Selecciona servicio..."
                  options={logic.servicios.map(s => ({ id: s.id, label: `${s.nombre} ($${s.precio})` }))}
                />
                <SelectionCard
                  label="Profesional"
                  icon={User}
                  value={logic.selectedBarber}
                  onChange={logic.setSelectedBarber}
                  disabled={logic.isReprogramming}
                  placeholder="Cualquiera disponible..."
                  options={logic.barberos.map(b => ({ id: b.id, label: b.usuario.nombre + ' ' + b.usuario.apellido }))}
                />
              </div>
            </div>

            {/* 2. FECHA Y HORA */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-blue-600" /> Fecha y Hora
              </h2>

              <div className="mb-8">
                <label className="block text-slate-500 text-xs font-bold uppercase mb-1.5 ml-1">Fecha del turno</label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    value={logic.selectedDate}
                    onChange={e => { logic.setSelectedDate(e.target.value); logic.setSelectedTime(''); }}
                    min={new Date().toLocaleDateString('en-CA')}
                    required
                  />
                </div>
              </div>

              {/* Grilla de Horarios */}
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase mb-3 ml-1">Horarios Disponibles</label>
                {!logic.selectedDate || !logic.selectedBarber ? (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                    <Clock className="mx-auto mb-2 opacity-20" size={32} />
                    <p className="text-sm font-medium">Selecciona profesional y fecha.</p>
                  </div>
                ) : logic.loadingHorarios ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                ) : logic.horariosDisponibles.length === 0 ? (
                  <div className="bg-orange-50 text-orange-700 p-6 rounded-2xl border border-orange-100 text-center text-sm font-medium">
                    No hay turnos disponibles.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {logic.horariosDisponibles.map(hora => (
                      <button
                        key={hora}
                        type="button"
                        onClick={() => logic.setSelectedTime(hora)}
                        className={`py-2.5 px-1 rounded-xl text-sm font-bold transition-all border relative ${logic.selectedTime === hora
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105 z-10'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                          }`}
                      >
                        {hora}
                        {logic.selectedTime === hora && <CheckCircle2 size={14} className="absolute -top-1.5 -right-1.5 text-white bg-green-500 rounded-full border-2 border-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ERROR */}
            {logic.error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle size={20} className="shrink-0" />
                <p>{logic.error}</p>
              </div>
            )}
          </div>

          {/* --- COLUMNA DERECHA (RESUMEN) --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 bg-slate-900 text-white">
                  <h3 className="text-lg font-bold flex items-center gap-2"><Receipt size={18} className="text-slate-400" /> Resumen</h3>
                  <p className="text-slate-400 text-xs mt-1">Revisa los detalles antes de confirmar.</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Info Barbero */}
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden shrink-0 bg-slate-100 relative">
                      {logic.barberInfo?.fotoUrl ? (
                        <img src={logic.barberInfo.fotoUrl} alt="Barbero" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={28} /></div>
                      )}
                      {logic.selectedBarber && <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Profesional</p>
                      <p className="font-bold text-slate-900 text-lg leading-tight">{logic.barberInfo?.usuario.nombre + ' ' + logic.barberInfo?.usuario.apellido || <span className="text-slate-300">Seleccionar...</span>}</p>
                      {logic.barberInfo?.especialidad && <p className="text-xs text-blue-600 font-medium">{logic.barberInfo.especialidad}</p>}
                    </div>
                  </div>

                  {/* Detalles */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400 text-xs font-bold uppercase mt-1">Servicio</span>
                      <span className="text-right text-sm font-bold text-slate-800 w-2/3 leading-tight">{logic.serviceInfo?.nombre || <span className="text-slate-300 italic">Seleccionar...</span>}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400 text-xs font-bold uppercase mt-1">Fecha</span>
                      <div className="text-right">
                        <span className="block text-sm font-bold text-slate-800 capitalize">{logic.selectedDate ? logic.fechaResumen : <span className="text-slate-300 italic">--/--</span>}</span>
                        {logic.selectedTime && <span className="inline-block mt-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-100">{logic.selectedTime} hs</span>}
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-slate-100 pt-4 flex justify-between items-end">
                    <span className="text-slate-500 font-medium text-sm">Total a pagar</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tight">${logic.serviceInfo?.precio || 0}</span>
                  </div>

                  {/* Método de Pago */}
                  <div>
                    <span className="text-slate-400 text-xs font-bold uppercase block mb-3">Método de pago</span>
                    <div className="grid grid-cols-2 gap-3">
                      {['LOCAL', 'ONLINE'].map((metodo) => (
                        <button key={metodo} type="button" onClick={() => logic.setMetodoPago(metodo as any)}
                          className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-2 transition-all ${logic.metodoPago === metodo ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:text-slate-700'}`}
                        >
                          {metodo === 'LOCAL' ? <Store size={20} /> : <CreditCard size={20} />}
                          <span className="text-xs font-bold">{metodo === 'LOCAL' ? 'En el local' : 'Pago Online'}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={logic.isSubmitting || !logic.selectedTime}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed ${logic.isReprogramming ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
                  >
                    {logic.isSubmitting ? <Loader2 className="animate-spin" /> : <Wallet size={20} />}
                    {logic.isReprogramming ? 'Confirmar Cambio' : (logic.metodoPago === 'ONLINE' ? 'Ir a Pagar' : 'Confirmar Reserva')}
                  </button>

                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                      <CheckCircle2 size={10} /> {logic.metodoPago === 'LOCAL' ? 'El pago se realiza presencialmente en el local.' : 'Serás redirigido a la pasarela de pago segura.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100/50 rounded-2xl p-4 border border-slate-200/50 text-xs text-slate-500 space-y-2">
                <div className="flex gap-2 items-center"><MapPin size={14} /> Av. Aconquija 1234, Tucumán</div>
                <div className="flex gap-2 items-center"><Clock size={14} /> Lun-Sáb: 9:00 - 21:00</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};