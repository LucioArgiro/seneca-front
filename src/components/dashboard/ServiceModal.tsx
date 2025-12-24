import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react'; 
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

  return (
    // 1. OVERLAY: Aquí SÍ podemos dejar el blur porque es estático (fondo quieto)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      
      {/* 2. CONTENEDOR: Sólido (bg-slate-800) para rendimiento puro */}
      <div className="bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto relative">
        
        {/* 3. HEADER: Totalmente Sólido. 
             Si le pones transparencia aquí, al scrollear el texto de abajo se mezclaría feo.
        */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800 sticky top-0 z-20">
          <h2 className="text-xl font-bold text-white">
            {servicio ? '✏️ Editar Servicio' : '✨ Nuevo Servicio'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X size={24}/></button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Nombre</label>
              <input type="text" required className="input-admin" 
                value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Corte Clásico" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Precio ($)</label>
              <input type="number" required className="input-admin" 
                value={precio} onChange={e => setPrecio(e.target.value)} placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Duración (min)</label>
              <input type="number" required className="input-admin" 
                value={duracion} onChange={e => setDuracion(e.target.value)} placeholder="30" />
            </div>
            
            {/* SWITCH POPULAR */}
            <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <div 
                  onClick={() => setPopular(!popular)}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${popular ? 'bg-yellow-500' : 'bg-slate-600'}`}
                >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${popular ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <span className={`font-bold ${popular ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {popular ? 'Destacado' : 'Estándar'}
                </span>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Descripción</label>
            <textarea className="input-admin h-20 resize-none" 
              value={descripcion} onChange={e => setDescripcion(e.target.value)} 
              placeholder="Descripción breve..." />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Características (separar con comas)</label>
            <input type="text" className="input-admin" 
              value={features} onChange={e => setFeatures(e.target.value)} 
              placeholder="Ej: Toalla caliente, Lavado incluido" />
          </div>

          {/* SWITCH ACTIVO */}
          <div className="border-t border-slate-700 pt-6">
             <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-white font-bold">Visibilidad</h3>
                    <p className="text-xs text-gray-400">Ocultar servicio sin borrarlo.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm ${activo ? 'text-green-400' : 'text-red-400'}`}>
                        {activo ? 'VISIBLE' : 'OCULTO'}
                    </span>
                    <div 
                    onClick={() => setActivo(!activo)}
                    className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${activo ? 'bg-green-600' : 'bg-red-900/50 border border-red-800'}`}
                    >
                        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${activo ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </div>
                </div>
             </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition">
                Cancelar
            </button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/50 transition flex justify-center items-center gap-2">
                <Save size={20} /> Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};