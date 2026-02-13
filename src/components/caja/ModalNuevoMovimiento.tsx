import { useState, useRef, useEffect } from 'react';
import { X, Save, TrendingDown, TrendingUp, DollarSign, ChevronDown, Check } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  isProcessing: boolean;
}

// Opciones separadas por tipo
const CONCEPTOS_EGRESO = [
  { value: 'GASTO_FIJO', label: 'Gasto Fijo (Luz, Alquiler)' },
  { value: 'INSUMOS', label: 'Compra de Insumos' },
  { value: 'RETIRO', label: 'Retiro de Ganancias' },
  { value: 'OTRO_EGRESO', label: 'Otro Gasto' }
];

const CONCEPTOS_INGRESO = [
  { value: 'AJUSTE', label: 'Ajuste / Aporte de Caja' },
  { value: 'VENTA_PRODUCTO', label: 'Venta de Producto' },
  { value: 'PROPINA', label: 'Propina' },
  { value: 'OTRO_INGRESO', label: 'Otro Ingreso' }
];

export const ModalNuevoMovimiento = ({ isOpen, onClose, onConfirm, isProcessing }: ModalProps) => {
  if (!isOpen) return null;

  const [tipo, setTipo] = useState<'INGRESO' | 'EGRESO'>('EGRESO');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [concepto, setConcepto] = useState('GASTO_FIJO'); // Estado inicial

  const [isConceptoOpen, setIsConceptoOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Resetear concepto al cambiar el tipo
  useEffect(() => {
    if (tipo === 'INGRESO') setConcepto('AJUSTE');
    else setConcepto('GASTO_FIJO');
  }, [tipo]);

  // Click outside listener (Mantenido igual)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsConceptoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monto || Number(monto) <= 0) return; // Validación simple

    onConfirm({
      tipo,
      monto: Number(monto),
      descripcion,
      concepto // Ahora enviamos el concepto seleccionado, sea ingreso o egreso
    });
  };

  // Determinar qué lista de opciones mostrar
  const opcionesActuales = tipo === 'EGRESO' ? CONCEPTOS_EGRESO : CONCEPTOS_INGRESO;
  const getConceptoLabel = () => opcionesActuales.find(c => c.value === concepto)?.label || concepto;

  const labelClass = "block text-xs font-bold text-zinc-400 uppercase mb-1 ml-1 tracking-wider";
  const inputClass = "w-full px-4 py-3 bg-[#131313] border border-zinc-800 rounded-xl text-white font-medium placeholder-zinc-700 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 animate-in fade-in">
      <div className="bg-[#1A1A1A] w-full max-w-md rounded-2xl shadow-2xl border border-white/5 overflow-visible">

        {/* HEADER */}
        <div className="bg-[#131313] p-6 border-b border-white/5 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-lg font-black text-white tracking-tight">Registrar Movimiento</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-[#C9A227] transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* SELECTOR TIPO */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-[#131313] rounded-xl border border-white/5">
            <button type="button" onClick={() => setTipo('EGRESO')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all 
                 ${tipo === 'EGRESO' ? 'bg-red-900/20 text-red-500 border border-red-900/30 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <TrendingDown size={16} /> Gasto / Retiro
            </button>
            <button type="button" onClick={() => setTipo('INGRESO')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all 
                 ${tipo === 'INGRESO' ? 'bg-emerald-900/20 text-emerald-500 border border-emerald-900/30 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <TrendingUp size={16} /> Ingreso Extra
            </button>
          </div>

          {/* MONTO */}
          <div>
            <label className={labelClass}>Monto ($)</label>
            <div className="relative group">
              <DollarSign className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-[#C9A227] transition-colors pointer-events-none" size={18} />
              <input required type="number" min="0" step="0.01" className={`${inputClass} pl-12 font-bold text-lg`}
                value={monto} onChange={e => setMonto(e.target.value)} placeholder="0.00" />
            </div>
          </div>

          {/* CONCEPTO - AHORA VISIBLE SIEMPRE */}
          <div className="relative" ref={dropdownRef}>
            <label className={labelClass}>Concepto</label>
            <button
              type="button"
              onClick={() => setIsConceptoOpen(!isConceptoOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 bg-[#131313] border rounded-xl text-white font-medium transition-all
                  ${isConceptoOpen ? 'border-[#C9A227] ring-1 ring-[#C9A227]' : 'border-zinc-800 hover:border-zinc-600'}`}
            >
              <span className="truncate">{getConceptoLabel()}</span>
              <ChevronDown size={18} className={`text-zinc-500 transition-transform ${isConceptoOpen ? 'rotate-180 text-[#C9A227]' : ''}`} />
            </button>

            {isConceptoOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-[#131313] border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden custom-scrollbar max-h-48 overflow-y-auto">
                {opcionesActuales.map((opcion) => {
                  const isSelected = concepto === opcion.value;
                  return (
                    <div
                      key={opcion.value}
                      onClick={() => {
                        setConcepto(opcion.value);
                        setIsConceptoOpen(false);
                      }}
                      className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors
                          ${isSelected ? 'bg-[#C9A227]/10 text-[#C9A227]' : 'text-zinc-300 hover:bg-[#C9A227] hover:text-[#131313]'}`}
                    >
                      <span>{opcion.label}</span>
                      {isSelected && <Check size={16} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className={labelClass}>Descripción</label>
            <input required type="text" className={inputClass}
              value={descripcion} onChange={e => setDescripcion(e.target.value)}
              placeholder={tipo === 'EGRESO' ? "Ej: Pago de Edesur" : "Ej: Aporte inicial de caja"} />
          </div>

          <button disabled={isProcessing} type="submit"
            className={`w-full mt-2 py-3.5 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 active:scale-95 border flex items-center justify-center gap-2
              ${tipo === 'EGRESO'
                ? 'text-[#C9A227] hover:bg-[#C9A227] hover:text-[#131313] border-[#C9A227]/50' // Estilo Egreso (Dorado)
                : 'text-emerald-500 hover:bg-emerald-500 hover:text-white border-emerald-500/50 shadow-emerald-900/20' // Estilo Ingreso (Verde)
              }
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
            `}
          >
            {isProcessing ? 'Guardando...' : <><Save size={18} /> Confirmar {tipo === 'INGRESO' ? 'Ingreso' : 'Egreso'}</>}
          </button>

        </form>
      </div>
    </div>
  );
};