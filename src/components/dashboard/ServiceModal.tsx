import { useState, useEffect } from 'react';
import { X, Save, Star, CheckCircle, Info } from 'lucide-react'; 
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
  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition font-medium";
  const labelClass = "block text-slate-500 text-xs font-bold uppercase mb-2 ml-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* 3. HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${servicio ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {servicio ? <Info size={24}/> : <Star size={24}/>}
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-900">
                    {servicio ? 'Editar Servicio' : 'Nuevo Servicio'}
                </h2>
                <p className="text-xs text-slate-500">Completa la información para el catálogo.</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition">
            <X size={24}/>
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
            
            {/* SWITCH POPULAR (Estilo Tarjeta) */}
            <div>
                <label className={labelClass}>Destacado</label>
                <div 
                    onClick={() => setPopular(!popular)}
                    className={`cursor-pointer border rounded-xl p-3 flex items-center justify-between transition-all select-none
                        ${popular 
                            ? 'bg-yellow-50 border-yellow-200' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${popular ? 'bg-yellow-200 text-yellow-700' : 'bg-slate-100 text-slate-400'}`}>
                            <Star size={16} fill={popular ? "currentColor" : "none"} />
                        </div>
                        <span className={`text-sm font-bold ${popular ? 'text-yellow-800' : 'text-slate-500'}`}>
                            {popular ? 'Es Popular' : 'Normal'}
                        </span>
                    </div>
                    {/* Toggle Visual */}
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${popular ? 'bg-yellow-400' : 'bg-slate-200'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${popular ? 'translate-x-4' : 'translate-x-0'}`}></div>
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
            <div className="relative">
                <input type="text" className={`${inputClass} pl-10`} 
                value={features} onChange={e => setFeatures(e.target.value)} 
                placeholder="Ej: Lavado incluido, Bebida gratis, Toalla caliente" />
                <CheckCircle className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 ml-1">Se mostrarán como lista con íconos en la tarjeta.</p>
          </div>

          {/* SWITCH ACTIVO (Zona de Peligro / Visibilidad) */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
             <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-slate-800 font-bold text-sm">Visibilidad del Servicio</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Si lo desactivas, los clientes no podrán agendarlo.</p>
                </div>
                
                <div 
                   onClick={() => setActivo(!activo)}
                   className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors flex items-center ${activo ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${activo ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
             </div>
          </div>

          {/* Footer de Botones */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold transition active:scale-95">
                Cancelar
            </button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition flex justify-center items-center gap-2 active:scale-95">
                <Save size={20} /> Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};