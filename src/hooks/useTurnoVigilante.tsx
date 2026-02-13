import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import { AlertCircle, Banknote, X, Clock } from 'lucide-react'; // Agregué icono Clock
import { type TurnoResponse } from '../api/turnos';

const TOLERANCIA_MINUTOS = 10;
const CHECK_INTERVAL_MS = 60000; 
const TIEMPO_SNOOZE_MS = 10 * 60 * 1000; 

export const useTurnoVigilante = (
  turnos: TurnoResponse[] | undefined,
  onCobrar: (turno: TurnoResponse) => void
) => {const notificadosRef = useRef<Set<string>>(new Set());

  const posponerNotificacion = (turnoId: string, toastId: string) => {
    toast.dismiss(toastId);
    
    // 2. Programamos el olvido
    setTimeout(() => {notificadosRef.current.delete(turnoId);}, TIEMPO_SNOOZE_MS);

    toast.success("Te recordaré este cobro en 10 min", { duration: 1000, icon: '⏰' });
  };

  const lanzarToastVencido = (turno: TurnoResponse, minutosPasados: number) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} w-[90vw] max-w-sm bg-[#1A1A1A] shadow-2xl rounded-xl border border-[#C9A227] flex overflow-hidden pointer-events-auto`}>
        <div className="flex-1 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-[#C9A227]/20 flex items-center justify-center animate-pulse">
                <AlertCircle className="h-6 w-6 text-[#C9A227]" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-white">¿Finalizar Turno?</p>
              <p className="text-xs text-zinc-400 mt-1">
                El turno de <span className="text-[#C9A227] font-bold">{turno.cliente.usuario.nombre}</span> terminó hace {minutosPasados} min.
              </p>
              <div className="mt-3 flex gap-2">
                {/* BOTÓN COBRAR */}
                <button
                  onClick={() => { toast.dismiss(t.id); onCobrar(turno); }}
                  className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold text-[#131313] bg-[#C9A227] hover:bg-[#b88d15] transition-colors"
                >
                  <Banknote size={14} className="mr-1" /> Cobrar
                </button>
                
                {/* BOTÓN POSPONER (Antes "Omitir") */}
                <button
                  onClick={() => posponerNotificacion(turno.id, t.id)}
                  className="px-3 py-2 border border-zinc-700 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1"
                >
                  <Clock size={14} /> +10min
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* BOTÓN CERRAR DEFINITIVO (X) */}
        <div className="border-l border-white/10 flex">
          <button 
            onClick={() => toast.dismiss(t.id)} // La X cierra sin posponer (lo ignora para siempre en esta sesión)
            className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-zinc-400 hover:text-white focus:outline-none"
          >
             <X size={18} />
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'bottom-right',
      id: `turno-vencido-${turno.id}`
    });
  };

  useEffect(() => {
    if (!turnos) return;

    const chequearTurnosVencidos = () => {
      const ahora = dayjs();

      turnos.forEach((turno) => {
        if (turno.estado !== 'CONFIRMADO') return;

        const finTurno = dayjs(turno.fecha).add(30, 'minute');
        const minutosPasados = ahora.diff(finTurno, 'minute');

        const esVencido = minutosPasados >= TOLERANCIA_MINUTOS;
        const esReciente = minutosPasados < 720; 
        const yaAvisado = notificadosRef.current.has(turno.id);

        if (esVencido && esReciente && !yaAvisado) {
          notificadosRef.current.add(turno.id);
          lanzarToastVencido(turno, minutosPasados);
        }
      });
    };

    chequearTurnosVencidos();
    const intervalo = setInterval(chequearTurnosVencidos, CHECK_INTERVAL_MS);

    return () => clearInterval(intervalo);
  }, [turnos, onCobrar]);
};