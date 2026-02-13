import { User, Receipt, CheckCircle2, Loader2, Wallet, Banknote, Store, CreditCard } from 'lucide-react';

interface ResumenProps {
  serviceInfo: any;
  barberInfo: any;
  fechaResumen: string;
  hora: string;
  precios: {
    totalServicio: number;
    valorSenia: number;
    aPagarHoy: number;
    saldoPendiente: number;
    requierePago: boolean;
  };
  opcionPago: 'TOTAL' | 'SENIA' | 'LOCAL';
  setOpcionPago: (opt: 'TOTAL' | 'SENIA' | 'LOCAL') => void;
  isSubmitting: boolean;
  isReprogramming: boolean;
}

export const ResumenReserva = ({
  serviceInfo, barberInfo, fechaResumen, hora,
  precios, opcionPago, setOpcionPago, isSubmitting, isReprogramming
}: ResumenProps) => {

  return (
    <div className="space-y-4">
      <div className="bg-[#131313] rounded-3xl shadow-2xl shadow-black/50 border border-[#C9A227]/20 overflow-hidden">

        {/* ENCABEZADO OSCURO CON BORDE */}
        <div className="p-6 bg-[#1A1A1A] border-b border-white/5">
          <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-wide">
            <div className="p-1.5 bg-[#C9A227]/10 rounded-lg text-[#C9A227]">
                <Receipt size={18} /> 
            </div>
            Resumen
          </h3>
          <p className="text-zinc-500 text-xs mt-1 pl-9">Revisa los detalles antes de confirmar.</p>
        </div>

        <div className="p-6 space-y-6">

          {/* INFO BARBERO */}
          <div className="flex items-center gap-4 pb-6 border-b border-white/5">
            <div className="w-16 h-16 rounded-full border-2 border-[#C9A227]/30 shadow-lg shadow-[#C9A227]/10 overflow-hidden shrink-0 bg-[#0a0a0a] relative group">
              {barberInfo?.fotoUrl ?
                <img src={barberInfo.fotoUrl} alt="Barbero" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> :
                <div className="w-full h-full flex items-center justify-center text-zinc-600"><User size={28} /></div>
              }
            </div>
            <div>
              <p className="text-[10px] text-[#C9A227] font-bold uppercase tracking-widest mb-0.5">Profesional</p>
              <p className="font-black text-white text-lg leading-tight">{barberInfo?.usuario.nombre || 'Seleccionar...'}</p>
            </div>
          </div>

          {/* DETALLES DE FECHA Y SERVICIO */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 text-xs font-bold uppercase mt-1 tracking-wider">Servicio</span>
              <span className="text-right text-sm font-bold text-zinc-200 w-2/3 leading-tight">{serviceInfo?.nombre || '--'}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 text-xs font-bold uppercase mt-1 tracking-wider">Fecha</span>
              <div className="text-right">
                <span className="block text-sm font-bold text-zinc-200 capitalize">{fechaResumen}</span>
                {hora && <span className="inline-block mt-1 bg-[#C9A227]/10 text-[#C9A227] px-2 py-0.5 rounded text-xs font-bold border border-[#C9A227]/20">{hora} hs</span>}
              </div>
            </div>
          </div>

          {/* SECCIÓN DE PAGO */}
          <div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-3">¿Cómo prefieres pagar?</span>
            <div className="grid grid-cols-1 gap-3">

              {/* OPCIÓN 1: PAGO EN LOCAL */}
              {!precios.requierePago && (
                <button type="button" onClick={() => setOpcionPago('LOCAL')}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all group relative overflow-hidden
                    ${opcionPago === 'LOCAL' 
                        ? 'border-[#C9A227] bg-[#C9A227]/10 ring-1 ring-[#C9A227]/50' 
                        : 'border-[#333] bg-[#1A1A1A] hover:border-zinc-500 hover:bg-[#202020]'
                    }`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors 
                        ${opcionPago === 'LOCAL' ? 'bg-[#C9A227] text-[#131313]' : 'bg-[#0a0a0a] text-zinc-500'}`}>
                      <Store size={20} />
                    </div>
                    <div className="text-left">
                      <p className={`font-bold text-sm ${opcionPago === 'LOCAL' ? 'text-[#C9A227]' : 'text-zinc-300'}`}>Pago en el Local</p>
                      <p className="text-xs text-zinc-500">Pagas al terminar.</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#C9A227] text-[10px] uppercase tracking-wider border border-[#C9A227]/30 px-2 py-1 rounded bg-[#C9A227]/5 relative z-10">Gratis hoy</span>
                </button>
              )}

              {/* OPCIÓN 2: PAGAR TOTAL ONLINE */}
              <button type="button" onClick={() => setOpcionPago('TOTAL')}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all group 
                    ${opcionPago === 'TOTAL' 
                        ? 'border-[#C9A227] bg-[#C9A227]/10 ring-1 ring-[#C9A227]/50' 
                        : 'border-[#333] bg-[#1A1A1A] hover:border-[#C9A227]/50 hover:bg-[#202020]'
                    }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors 
                    ${opcionPago === 'TOTAL' ? 'bg-[#C9A227] text-[#131313]' : 'bg-[#0a0a0a] text-[#C9A227]'}`}>
                    <CreditCard size={20} />
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-sm ${opcionPago === 'TOTAL' ? 'text-[#C9A227]' : 'text-zinc-300'}`}>Pagar Total Online</p>
                    <p className="text-xs text-zinc-500">Adelantas el 100%.</p>
                  </div>
                </div>
                <span className="font-black text-white text-lg">${precios.totalServicio}</span>
              </button>

              {/* OPCIÓN 3: SOLO SEÑA */}
              {precios.requierePago && (
                <button type="button" onClick={() => setOpcionPago('SENIA')}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all group 
                    ${opcionPago === 'SENIA' 
                        ? 'border-[#C9A227] bg-[#C9A227]/10 ring-1 ring-[#C9A227]/50' 
                        : 'border-[#333] bg-[#1A1A1A] hover:border-[#C9A227]/50 hover:bg-[#202020]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors 
                        ${opcionPago === 'SENIA' ? 'bg-[#C9A227] text-[#131313]' : 'bg-[#0a0a0a] text-[#C9A227]'}`}>
                      <Wallet size={20} />
                    </div>
                    <div className="text-left">
                      <p className={`font-bold text-sm ${opcionPago === 'SENIA' ? 'text-[#C9A227]' : 'text-zinc-300'}`}>Solo Seña</p>
                      <p className="text-xs text-zinc-500">Congelas precio.</p>
                    </div>
                  </div>
                  <span className="font-black text-white text-lg">${precios.valorSenia}</span>
                </button>
              )}

            </div>
          </div>

          {/* TOTALES Y BOTÓN FINAL */}
          <div className="border-t border-white/5 pt-4 space-y-2">

            {/* Aviso de Saldo Pendiente */}
            {(opcionPago === 'SENIA' || opcionPago === 'LOCAL') && precios.saldoPendiente > 0 && (
              <div className="bg-[#1A1A1A] text-zinc-400 p-3 rounded-xl text-[10px] font-medium flex items-start gap-2 border border-white/10 mb-2">
                <Banknote size={14} className="shrink-0 mt-0.5 text-[#C9A227]" />
                <span>Abonarás el resto (<span className="text-white font-bold underline">${precios.saldoPendiente}</span>) en la barbería.</span>
              </div>
            )}

            <div className="flex justify-between items-end pb-2">
              <span className="text-zinc-400 font-bold text-sm uppercase tracking-wider">
                {opcionPago === 'LOCAL' ? 'A pagar hoy' : 'A pagar con MP'}
              </span>
              <span className={`text-3xl font-black tracking-tight ${opcionPago === 'LOCAL' ? 'text-[#C9A227]' : 'text-[#C9A227]'}`}>
                ${precios.aPagarHoy}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !hora}
            className={`w-full py-4 px-6 rounded-xl font-black text-[#131313] shadow-[0_0_25px_rgba(201,162,39,0.2)] transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm
              ${isReprogramming 
                ? 'bg-[#1A1A1A] text-[#C9A227] border border-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313]' // Botón Reprogramar (Inverso)
                : 'bg-[#C9A227] hover:bg-[#b88d15]' // Botón Normal (Dorado Sólido)
              }`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : (opcionPago === 'LOCAL' ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <Wallet size={20} strokeWidth={2.5} />)}

            {isReprogramming
              ? 'Confirmar Cambio'
              : (opcionPago === 'LOCAL' ? 'Confirmar Reserva' : 'Ir a Pagar')
            }
          </button>

          <div className="text-center">
            <p className="text-[10px] text-zinc-500 flex items-center justify-center gap-1.5 font-medium">
              {opcionPago === 'LOCAL'
                ? 'Reserva inmediata sin pagos online.'
                : <><CheckCircle2 size={10} className="text-green-500"/> Redirección segura a Mercado Pago.</>
              }
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};