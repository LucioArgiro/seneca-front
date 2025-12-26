import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Scissors, User, ChevronDown } from 'lucide-react';
import { createTurno } from '../../api/turnos';
import { getServicios, type Servicio } from '../../api/servicios';
import { getBarberos, type Usuario } from '../../api/usuarios';

// Generador de horarios (Helper)
const generarHorarios = () => {
  const horarios = [];
  for (let i = 9; i < 14; i++) {
    horarios.push(`${i.toString().padStart(2, '0')}:00`);
    horarios.push(`${i.toString().padStart(2, '0')}:30`);
  }
  for (let i = 17; i < 22; i++) {
    horarios.push(`${i.toString().padStart(2, '0')}:00`);
    horarios.push(`${i.toString().padStart(2, '0')}:30`);
  }
  return horarios;
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export const BookingModal = ({ isOpen, onClose, onSuccess, userId }: BookingModalProps) => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [barberos, setBarberos] = useState<Usuario[]>([]);
  
  // Estados del Formulario
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      Promise.all([getServicios(), getBarberos()])
        .then(([s, b]) => { 
            // Filtramos solo los servicios activos para que el cliente no elija uno oculto
            setServicios(s.filter(serv => serv.activo)); 
            setBarberos(b); 
        })
        .catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const fechaISO = `${fecha}T${hora}:00`;
      await createTurno({
        fecha: fechaISO,
        clienteId: userId,
        barberoId: selectedBarber,
        servicioId: selectedService,
      });
      
      // Resetear form
      setFecha(''); setHora(''); setSelectedService(''); setSelectedBarber('');
      onSuccess(); 
      onClose();   
      
    } catch (err: any) {
        if (err.response?.status === 409) {
            setError('⚠️ Ese horario ya está ocupado. Por favor elige otro.');
        } 
        else if (err.response?.status === 400) {
            setError('🕒 El horario seleccionado no es válido o el local está cerrado.');
        } 
        else {
            setError('❌ No se pudo reservar. Verifica tu conexión.');
        }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Clases reutilizables para inputs (Light Theme)
  const inputContainerClass = "relative";
  const iconClass = "absolute left-3 top-3.5 text-slate-400 pointer-events-none";
  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition appearance-none";
  const labelClass = "block text-slate-500 text-xs font-bold uppercase mb-1.5 ml-1";

  return (
    // 1. OVERLAY: Fondo con blur
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4 animate-in fade-in duration-200">
      
      {/* 2. CARD: Blanco puro con sombra suave */}
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">✨ Reservar Turno</h2>
            <p className="text-xs text-slate-500 mt-0.5">Elige el servicio y horario de tu preferencia.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition">
            <X size={24}/>
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-start gap-2">
                    <span>{error}</span>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* SERVICIO */}
                <div>
                    <label className={labelClass}>Servicio</label>
                    <div className={inputContainerClass}>
                        <Scissors className={iconClass} size={18}/>
                        <select 
                            className={inputClass}
                            value={selectedService} onChange={e => setSelectedService(e.target.value)} required
                        >
                            <option value="">Selecciona un servicio...</option>
                            {servicios.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.nombre} — ${s.precio} ({s.duracionMinutos} min)
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                    </div>
                </div>

                {/* BARBERO */}
                <div>
                    <label className={labelClass}>Profesional</label>
                    <div className={inputContainerClass}>
                        <User className={iconClass} size={18}/>
                        <select 
                            className={inputClass}
                            value={selectedBarber} onChange={e => setSelectedBarber(e.target.value)} required
                        >
                            <option value="">Cualquier profesional disponible...</option>
                            {barberos.map(b => <option key={b.id} value={b.id}>{b.fullname}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                    </div>
                </div>

                {/* FECHA Y HORA (Grid) */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Fecha</label>
                        <div className={inputContainerClass}>
                            <Calendar className={iconClass} size={18}/>
                            <input 
                                type="date" 
                                className={inputClass}
                                value={fecha} onChange={e => setFecha(e.target.value)} required
                                min={new Date().toLocaleDateString('en-CA')} 
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Horario</label>
                        <div className={inputContainerClass}>
                            <Clock className={iconClass} size={18}/>
                            <select 
                                className={inputClass}
                                value={hora} onChange={e => setHora(e.target.value)} required
                            >
                                <option value="">--:--</option>
                                {generarHorarios().map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>
                </div>
                
                {/* Resumen de Precio (Opcional, si hay servicio seleccionado) */}
                {selectedService && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center text-blue-800 text-sm mt-2">
                        <span className="font-medium">Total a pagar en el local:</span>
                        <span className="font-bold text-lg">
                            ${servicios.find(s => s.id === selectedService)?.precio}
                        </span>
                    </div>
                )}

                <div className="pt-4">
                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Confirmando...
                            </span>
                        ) : 'CONFIRMAR RESERVA'}
                    </button>
                    <button 
                        type="button" onClick={onClose}
                        className="w-full mt-3 text-slate-400 hover:text-slate-600 text-sm font-bold py-2 transition"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};