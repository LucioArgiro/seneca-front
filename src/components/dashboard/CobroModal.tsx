import { useState, type ReactNode } from 'react';
import {
  X, Banknote, QrCode, Smartphone, CheckCircle2,
  AlertCircle, Copy, Wallet
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CobroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (metodo: 'EFECTIVO' | 'TRANSFERENCIA') => void;
  turno: any;
  isProcessing: boolean;
  children?: ReactNode;
}

export const CobroModal = ({
  isOpen,
  onClose,
  onConfirm,
  turno,
  isProcessing,
  children
}: CobroModalProps) => {

  if (!isOpen || !turno) return null;

  const [metodo, setMetodo] = useState<'EFECTIVO' | 'TRANSFERENCIA'>('EFECTIVO');
  const precioTotal = Number(turno.servicio.precio);
  const pagadoPrevio = Number(turno.montoAbonado || 0);
  const aCobrar = Math.max(0, precioTotal - pagadoPrevio);
  const barbero = turno.barbero;
  const tieneQr = !!barbero.imagenQrUrl;

  const handleCopyAlias = () => {
    if (barbero.aliasMp) {
      navigator.clipboard.writeText(barbero.aliasMp);
      toast.success("Alias copiado", {
        style: { background: '#1A1A1A', color: '#fff', border: '1px solid #C9A227' },
        iconTheme: { primary: '#C9A227', secondary: '#1A1A1A' },
      });
    }
  };

  return (
    // Overlay Oscuro
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-200">
      <div className="bg-[#1A1A1A] w-full max-w-md rounded-3xl shadow-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* HEADER */}
        <div className="bg-[#131313] p-6 border-b border-white/5 flex justify-between items-start sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Wallet className="text-[#C9A227]" size={20} /> FINALIZAR Y COBRAR
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Turno de <span className="font-bold text-white capitalize">{turno.cliente?.usuario?.nombre || 'Cliente'}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-[#C9A227]">
            <X size={20} />
          </button>
        </div>

        {/* RESUMEN DE SALDOS */}
        <div className="p-6 bg-[#1A1A1A] space-y-3 pb-6 border-b border-white/5">
          <div className="flex justify-between text-sm text-zinc-400 font-medium">
            <span>Total Servicio</span>
            <span className="text-slate-200">${precioTotal}</span>
          </div>

          {/* Mostramos el descuento si ya pagó algo (sea seña web o efectivo previo) */}
          {pagadoPrevio > 0 && (
            <div className="flex justify-between text-sm text-emerald-500 font-medium">
              <span>Ya Abonado / Seña</span>
              <span>- ${pagadoPrevio}</span>
            </div>
          )}

          <div className="flex justify-between items-end pt-3 border-t border-white/5 mt-2">
            <span className="font-bold text-[#C9A227] uppercase text-xs tracking-[0.2em] mb-1">Resto a Cobrar</span>
            <span className="text-4xl font-black text-white tracking-tighter">${aCobrar}</span>
          </div>
        </div>

        {/* CONTENT INYECTADO (Children) */}
        {children && (
          <div className="px-6 pt-4 pb-2">
            {children}
          </div>
        )}

        {/* SELECTOR DE MÉTODO */}
        {aCobrar > 0 && ( // Solo mostramos selector si hay algo que cobrar
          <div className="px-6 pt-4 pb-2">
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#131313] rounded-xl border border-white/5">
              <button
                onClick={() => setMetodo('EFECTIVO')}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all 
                                ${metodo === 'EFECTIVO'
                    ? 'bg-[#1A1A1A] text-[#C9A227] shadow-lg border border-[#C9A227]/30'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#1A1A1A]'}`}
              >
                <Banknote size={16} /> Efectivo
              </button>
              <button
                onClick={() => setMetodo('TRANSFERENCIA')}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all 
                                ${metodo === 'TRANSFERENCIA'
                    ? 'bg-[#1A1A1A] text-blue-400 shadow-lg border border-blue-500/30'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#1A1A1A]'}`}
              >
                <QrCode size={16} /> QR / Transf.
              </button>
            </div>
          </div>
        )}

        {/* CUERPO DINÁMICO */}
        <div className="p-6 pt-4">

          {/* Si ya no hay nada que cobrar */}
          {aCobrar === 0 && (
            <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-2xl p-6 text-center space-y-2 mb-4">
              <h4 className="font-bold text-emerald-400">¡Totalmente Pagado!</h4>
              <p className="text-xs text-emerald-300/70">Este turno ya no tiene saldo pendiente.</p>
            </div>
          )}

          {/* CASO A: EFECTIVO (Solo si hay deuda) */}
          {metodo === 'EFECTIVO' && aCobrar > 0 && (
            <div className="bg-[#131313] border border-[#C9A227]/30 rounded-2xl p-6 text-center space-y-4 animate-in slide-in-from-left-4 duration-300 relative overflow-hidden">
              <div className="w-14 h-14 bg-[#131313] text-[#C9A227] border border-[#C9A227]/20 rounded-full flex items-center justify-center mx-auto relative z-10"><Banknote size={28} /></div>
              <div className="relative z-10">
                <h4 className="font-bold text-white text-lg">Cobro en Efectivo</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-[200px] mx-auto">
                  Recibe <strong>${aCobrar}</strong> y regístralo en tu caja diaria.
                </p>
              </div>
            </div>
          )}

          {/* CASO B: TRANSFERENCIA / QR (Solo si hay deuda) */}
          {metodo === 'TRANSFERENCIA' && aCobrar > 0 && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              {tieneQr ? (
                <div className="space-y-4">
                  {/* Imagen del QR */}
                  <div className="bg-[#131313] border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center gap-3 relative group hover:border-[#C9A227]/50 transition-colors">
                    <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-[0.2em] group-hover:text-[#C9A227] transition-colors">
                      Escaneá para pagar
                    </p>
                    <div className="w-48 h-48 rounded-lg overflow-hidden bg-white p-2">
                      <img src={barbero.imagenQrUrl} alt="QR Barbero" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  {/* Alias con Copiar */}
                  {barbero.aliasMp && (
                    <div
                      onClick={handleCopyAlias}
                      className="bg-[#131313] border border-white/5 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-[#C9A227]/50 hover:bg-[#1E1E1E] transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-900/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Alias / CBU</p>
                          <p className="text-sm font-bold text-white group-hover:text-[#C9A227] transition-colors">{barbero.aliasMp}</p>
                        </div>
                      </div>
                      <Copy size={18} className="text-zinc-600 group-hover:text-[#C9A227]" />
                    </div>
                  )}
                </div>
              ) : (
                // Si el barbero no subió QR
                <div className="bg-red-900/10 border border-red-900/30 rounded-2xl p-5 text-center space-y-3">
                  <div className="w-12 h-12 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-400">QR No Configurado</h4>
                    <p className="text-xs text-red-300/70 mt-1">
                      Este profesional no ha cargado su QR o Alias en el sistema.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 pt-0">
          <button
            onClick={() => onConfirm(metodo)}
            disabled={isProcessing}
            className="
                w-full py-4 rounded-xl font-bold text-sm tracking-wide
                text-[#C9A227] bg-[#131313] 
                hover:bg-[#C9A227] hover:text-[#131313]
                border border-[#C9A227]
                shadow-[0_4px_20px_rgba(201,162,39,0.15)]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                transition-all transform hover:-translate-y-0.5 active:scale-95
                flex items-center justify-center gap-2 group
            "
          >
            {isProcessing ? 'PROCESANDO...' : (
              <>
                <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                {aCobrar > 0 ? `CONFIRMAR COBRO DE $${aCobrar}` : 'FINALIZAR TURNO (PAGADO)'}
              </>
            )}
          </button>

          {metodo === 'TRANSFERENCIA' && aCobrar > 0 && (
            <p className="text-[10px] text-center text-zinc-500 mt-4 px-4 font-medium">
              * Al confirmar, asegúrate de haber visto el comprobante de pago del cliente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};