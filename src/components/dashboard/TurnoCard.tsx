import { useState } from 'react';
import { Calendar, Clock, Edit2, XCircle, MessageCircle, CreditCard, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { turnosApi, type TurnoResponse } from '../../api/turnos';
import { WhatsAppBtn } from '../common/WhatsAppBtn';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';

interface TurnoCardProps {
  turno: TurnoResponse;
  onCancel: (id: string) => void;
}

const TELEFONO_ADMIN = "5493815790448";

export const TurnoCard = ({ turno, onCancel }: TurnoCardProps) => {
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);

  const isPendiente = turno.estado === 'PENDIENTE';
  const isConfirmado = turno.estado === 'CONFIRMADO';
  const isCompletado = turno.estado === 'COMPLETADO';

  // Lógica de Pago Existente
  const estadoPago = turno.pago?.estado as string;
  const isPagado = estadoPago === 'approved';
  const isPagoPendiente = estadoPago === 'pending' || estadoPago === 'in_process';

  const precioTotal = Number(turno.servicio?.precio) || 0;
  const montoPagado = isPagado ? Number(turno.pago?.monto) : 0;
  const saldoPendiente = Math.max(0, precioTotal - montoPagado);

  // 👇 LÓGICA DE COBRO DINÁMICA (Aquí está el cambio clave)
  // 1. Obtenemos el precio de la seña real (sin defaults falsos)
  const precioSeniaConfigurado = Number(turno.barbero?.precioSenia) || 0;

  // 2. Decidimos qué cobrar: ¿Tiene seña? -> Seña. ¿No tiene? -> Total.
  const hayQuePagarSenia = precioSeniaConfigurado > 0;

  const montoAPagarAhora = hayQuePagarSenia ? precioSeniaConfigurado : precioTotal;
  const tipoPagoApi = hayQuePagarSenia ? 'SENIA' : 'TOTAL';
  const etiquetaPago = hayQuePagarSenia ? 'Seña' : 'Total';

  // -----------------------------------------------------------

  const fechaObj = dayjs(turno.fecha);
  const fechaFormat = fechaObj.format('ddd D MMM');
  const horaFormat = fechaObj.format('HH:mm');
  const diffHoras = fechaObj.diff(dayjs(), 'hour');
  const HORAS_ANTICIPACION = 12;

  const puedeReprogramar = !isCompletado && (isPendiente || isConfirmado) && diffHoras > HORAS_ANTICIPACION;
  const puedeCancelar = !isCompletado && (isPendiente || isConfirmado) && !isPagado && diffHoras > HORAS_ANTICIPACION;

  const telefonoContacto = turno.barbero?.usuario?.telefono || TELEFONO_ADMIN;

  const handlePagarAhora = async () => {
    try {
      setIsPaying(true);
      // Usamos la variable dinámica (SENIA o TOTAL)
      const response = await turnosApi.crearPreferenciaPago(turno.id, tipoPagoApi);

      if (response && response.url) {
        window.location.href = response.url;
      } else {
        toast.error("No se pudo generar el link de pago");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al conectar con pagos");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="bg-granular-dark rounded-2xl p-6 border border-[#C9A227]/30 shadow-xl relative overflow-hidden group w-full mx-auto hover:shadow-[0_0_20px_rgba(201,162,39,0.1)] transition-all">

      {/* CABECERA */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-2xl font-black text-white leading-tight mb-1">{turno.servicio?.nombre}</h3>
          <p className="text-zinc-400 text-sm flex items-center gap-1">
            con <span className="text-[#C9A227] font-bold">{turno.barbero?.usuario?.nombre} {turno.barbero?.usuario?.apellido}</span>
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className={`text-[10px] font-black py-1 rounded uppercase tracking-widest mb-1 inline-block
              ${isConfirmado ? 'text-[#C9A227]' : isPendiente ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
            {turno.estado}
          </span>
          <span className={`block text-3xl font-black tracking-tight ${saldoPendiente === 0 ? 'text-green-500' : 'text-zinc-300'}`}>
            ${precioTotal}
          </span>
          {saldoPendiente > 0 && (
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Resta: ${saldoPendiente}</p>
          )}
        </div>
      </div>

      {/* ALERTA DE PAGO PENDIENTE (Texto Dinámico) */}
      {isPendiente && !isPagoPendiente && (
        <div className="mb-4 bg-amber-900/10 border border-amber-500/20 p-3 rounded-xl flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-amber-500 text-xs font-bold uppercase tracking-wide">Pago no detectado</p>
            <p className="text-amber-200/70 text-[11px] leading-snug">
              Tu turno no está confirmado. Abona {hayQuePagarSenia ? 'la seña' : 'el total'} de <span className="text-white font-bold">${montoAPagarAhora}</span> para asegurar tu lugar.
            </p>
          </div>
        </div>
      )}

      {/* FECHA */}
      <div className="mb-6 pt-4 border-t border-white/5 flex items-center gap-6">
        <div className="flex items-center gap-2 text-zinc-300 text-sm">
          <Calendar size={16} className="text-[#C9A227]" />
          <span className="font-bold capitalize">{fechaFormat}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300 text-sm">
          <Clock size={16} className="text-[#C9A227]" />
          <span className="font-bold">{horaFormat} hs</span>
        </div>
        {isPagoPendiente && (
          <span className="ml-auto text-[10px] text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 flex items-center gap-1 font-bold">
            <AlertTriangle size={10} /> Procesando Pago
          </span>
        )}
      </div>

      {/* FOOTER: BOTONES */}
      <div className="flex flex-col gap-3">

        {/* BOTÓN DE PAGAR DINÁMICO */}
        {isPendiente && !isPagoPendiente && (
          <button
            onClick={handlePagarAhora}
            disabled={isPaying}
            className="w-full bg-[#C9A227] text-[#131313] font-black uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#b08d21] transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(201,162,39,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPaying ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
            {isPaying ? 'Procesando...' : `Pagar ${etiquetaPago} ($${montoAPagarAhora})`}
          </button>
        )}

        <div className="flex gap-3">
          {puedeReprogramar && (
            <button onClick={() => navigate('/reservar', { state: { modo: 'reprogramar', turno } })}
              className="flex-1 flex items-center justify-center gap-2 bg-[#131313] border border-[#C9A227]/30 hover:bg-[#C9A227] text-zinc-400 hover:text-[#131313] rounded-xl py-3 transition-all font-bold text-[10px] md:text-xs uppercase tracking-wider h-10 md:h-12">
              <Edit2 size={14} /> Reprogramar
            </button>
          )}

          {puedeCancelar && (
            <button onClick={() => onCancel(turno.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#131313] border border-white/5 hover:border-red-500/50 hover:bg-red-900/10 text-zinc-500 hover:text-red-400 rounded-xl py-3 transition-all font-bold text-[10px] md:text-xs uppercase tracking-wider h-10 md:h-12">
              <XCircle size={14} /> Cancelar
            </button>
          )}

          <div className="flex-1">
            <WhatsAppBtn
              tipo="BUTTON"
              label=""
              className={`w-full h-10 md:h-12 flex items-center justify-center gap-2 rounded-xl border transition-all font-bold text-[10px] md:text-xs uppercase tracking-wider 
                ${isCompletado
                  ? 'bg-[#1A1A1A] text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'
                  : 'bg-[#131313] text-zinc-300 border-white/10 hover:border-[#C9A227] hover:text-[#C9A227]'
                }`}
              telefono={telefonoContacto}
              mensaje={`Hola, tengo una consulta sobre mi turno...`}
            >
              <MessageCircle size={14} strokeWidth={2.5} />
              <span>Consultar</span>
            </WhatsAppBtn>
          </div>
        </div>
      </div>
    </div>
  );
};