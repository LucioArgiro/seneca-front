import { useState, useEffect } from 'react';
import { X, Save, Star, CheckCircle, Info, Power } from 'lucide-react';
import { type Servicio } from '../../api/servicios';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Servicio>) => void;
  servicio?: Servicio | null;
}

export const ServiceModal = ({ isOpen, onClose, onSave, servicio }: ServiceModalProps) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [features, setFeatures] = useState('');
  const [popular, setPopular] = useState(false);
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (servicio) {
      setNombre(servicio.nombre);
      setPrecio(servicio.precio.toString());
      setDuracion(servicio.duracionMinutos.toString());
      setDescripcion(servicio.descripcion || '');
      setFeatures(servicio.features || '');
      setPopular(servicio.popular || false);
      setActivo(servicio.activo !== undefined ? servicio.activo : true);
    } else {
      setNombre(''); setPrecio(''); setDuracion('');
      setDescripcion(''); setFeatures(''); setPopular(false); setActivo(true);
    }
  }, [servicio, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nombre,
      precio: Number(precio),
      duracionMinutos: Number(duracion),
      descripcion,
      features,
      popular,
      activo
    });
    onClose();
  };

  if (!isOpen) return null;

  // Clases Reutilizables Luxury
  const inputClass = "w-full bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition font-medium";
  const labelClass = "block text-zinc-400 text-xs font-bold uppercase mb-2 ml-1 tracking-wider";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 ">

      {/* Modal Container: Carbón #131313 */}
      <div className="bg-[#131313] rounded-2xl w-full max-w-2xl shadow-2xl shadow-black/80 border border-white/10 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#131313] sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${servicio ? 'bg-blue-900/20 text-blue-400 border-blue-500/30' : 'bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/30'}`}>
              {servicio ? <Info size={24} /> : <Star size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {servicio ? 'EDITAR SERVICIO' : 'NUEVO SERVICIO'}
              </h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">Gestión de Catálogo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-[#C9A227] transition">
            <X size={24} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Nombre del Servicio</label>
              <input type="text" required className={inputClass}
                value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Corte Fade + Barba" />
            </div>
            <div>
              <label className={labelClass}>Precio ($)</label>
              <input type="number" required className={inputClass}
                value={precio} onChange={e => setPrecio(e.target.value)} placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className={labelClass}>Duración (minutos)</label>
              <input type="number" required className={inputClass}
                value={duracion} onChange={e => setDuracion(e.target.value)} placeholder="30" />
            </div>

            {/* SWITCH POPULAR */}
            <div>
              <label className={labelClass}>Destacado</label>
              <div
                onClick={() => setPopular(!popular)}
                className={`cursor-pointer border rounded-xl p-3 flex items-center justify-between transition-all select-none group
                        ${popular
                    ? 'bg-[#C9A227]/10 border-[#C9A227] shadow-[0_0_15px_rgba(201,162,39,0.1)]'
                    : 'bg-[#1A1A1A] border-[#333] hover:border-zinc-600'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${popular ? 'bg-[#C9A227] text-black' : 'bg-zinc-800 text-zinc-600'}`}>
                    <Star size={16} fill={popular ? "currentColor" : "none"} />
                  </div>
                  <span className={`text-sm font-bold ${popular ? 'text-[#C9A227]' : 'text-zinc-500'}`}>
                    {popular ? 'ES POPULAR' : 'NORMAL'}
                  </span>
                </div>
                {/* Toggle Visual */}
                <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${popular ? 'bg-[#C9A227]' : 'bg-zinc-700'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${popular ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Descripción (Opcional)</label>
            <textarea className={`${inputClass} h-24 resize-none`}
              value={descripcion} onChange={e => setDescripcion(e.target.value)}
              placeholder="Describe brevemente en qué consiste el servicio..." />
          </div>

          <div>
            <label className={labelClass}>Características (Separadas por comas)</label>
            <div className="relative group">
              <input type="text" className={`${inputClass} pl-10`}
                value={features} onChange={e => setFeatures(e.target.value)}
                placeholder="Ej: Lavado incluido, Bebida gratis..." />
              <CheckCircle className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-[#C9A227] transition-colors" size={18} />
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 ml-1">Se mostrarán con íconos dorados en la tarjeta del servicio.</p>
          </div>

          {/* SWITCH ACTIVO */}
          <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5 shadow-inner">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activo ? 'bg-emerald-900/20 text-emerald-500' : 'bg-red-900/20 text-red-500'}`}>
                  <Power size={20} />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${activo ? 'text-white' : 'text-zinc-400'}`}>Visibilidad del Servicio</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {activo ? 'El servicio es visible para los clientes.' : 'El servicio está oculto (Borrador).'}
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActivo(!activo)}
                className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors flex items-center ${activo ? 'bg-emerald-500' : 'bg-zinc-700'}`}
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${activo ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>

          {/* Footer de Botones */}
          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-zinc-400 hover:text-white border border-zinc-700 hover:bg-zinc-800 rounded-lg font-bold transition text-xs uppercase tracking-wider"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="
                    flex-1 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-white
                    bg-[#131313] border border-[#C9A227]
                    hover:bg-[#C9A227] hover:text-[#131313]
                    shadow-[0_4px_20px_rgba(201,162,39,0.1)]
                    transition-all active:scale-95
                    flex justify-center items-center gap-2
                "
            >
              <Save size={18} /> Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};