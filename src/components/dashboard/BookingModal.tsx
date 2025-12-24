import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Scissors, User } from 'lucide-react';
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
        .then(([s, b]) => { setServicios(s); setBarberos(b); })
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
            setError('⚠️ Ese horario ya está ocupado por otro cliente.');
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
  }; // <--- 🔑 ¡AQUÍ FALTABA CERRAR LA FUNCIÓN handleSubmit!

  // Ahora este código se ejecuta en el componente, no en la función
  if (!isOpen) return null;

  return (
    // Nota: Usé z-[100] para asegurar que tape al Navbar
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-700 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">✨ Agendar Nuevo Turno</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X size={24}/></button>
        </div>

        {/* BODY */}
        <div className="p-6">
            {error && <div className="bg-red-900/30 text-red-200 p-3 rounded mb-4 text-sm border border-red-800">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* SERVICIO */}
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Servicio</label>
                    <div className="relative">
                        <Scissors className="absolute left-3 top-3 text-blue-500" size={18}/>
                        <select 
                            className="w-full pl-10 p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none appearance-none"
                            value={selectedService} onChange={e => setSelectedService(e.target.value)} required
                        >
                            <option value="">Selecciona un servicio...</option>
                            {servicios.map(s => <option key={s.id} value={s.id}>{s.nombre} (${s.precio})</option>)}
                        </select>
                    </div>
                </div>

                {/* BARBERO */}
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Barbero</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-blue-500" size={18}/>
                        <select 
                            className="w-full pl-10 p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none appearance-none"
                            value={selectedBarber} onChange={e => setSelectedBarber(e.target.value)} required
                        >
                            <option value="">Selecciona un profesional...</option>
                            {barberos.map(b => <option key={b.id} value={b.id}>{b.fullname}</option>)}
                        </select>
                    </div>
                </div>

                {/* FECHA Y HORA */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Fecha</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-blue-500" size={18}/>
                            <input 
                                type="date" 
                                className="w-full pl-10 p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none"
                                value={fecha} onChange={e => setFecha(e.target.value)} required
                                // Usamos la fecha local para evitar problemas de zona horaria
                                min={new Date().toLocaleDateString('en-CA')} 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Hora</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 text-blue-500" size={18}/>
                            <select 
                                className="w-full pl-10 p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none appearance-none"
                                value={hora} onChange={e => setHora(e.target.value)} required
                            >
                                <option value="">--:--</option>
                                {generarHorarios().map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/50 transition disabled:opacity-50"
                    >
                        {loading ? 'Confirmando...' : 'CONFIRMAR RESERVA'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};