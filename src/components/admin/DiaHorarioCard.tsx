import { Sun, Moon, Copy } from 'lucide-react';

export const DiaHorarioCard = ({ dia, onChange, onCopy }: {
  dia: any;
  onChange: (d: any) => void;
  onCopy: () => void;
}) => {
  
  // Estilo común para inputs de hora
  const inputClass = "w-full bg-[#131313] border border-zinc-800 rounded-lg text-white text-center text-sm py-1.5 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-colors font-medium";

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 space-y-4 shadow-lg hover:border-[#C9A227]/30 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <p className="font-bold text-white capitalize">{dia.dia}</p>

        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer">
          <input
            type="checkbox"
            checked={dia.abierto}
            onChange={e => onChange({ ...dia, abierto: e.target.checked })}
            className="accent-[#C9A227] h-4 w-4 rounded bg-[#131313] border-zinc-600 cursor-pointer"
          />
          <span className={dia.abierto ? 'text-[#C9A227]' : 'text-zinc-500'}>
            {dia.abierto ? 'Abierto' : 'Cerrado'}
          </span>
        </label>
      </div>

      {!dia.abierto ? (
        <div className="py-6 text-center border border-dashed border-red-900/30 rounded-lg bg-red-900/5 flex flex-col items-center justify-center gap-1">
           <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Cerrado</span>
           <span className="text-[10px] text-red-400/50">Sin atención al público</span>
        </div>
      ) : (
        <>
          {/* Mañana */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-[#C9A227] flex items-center gap-1 uppercase tracking-wider">
              <Sun size={12} /> Mañana
            </p>
            <div className="flex gap-2">
              <input type="time" value={dia.manana.desde}
                onChange={e => onChange({ ...dia, manana: { ...dia.manana, desde: e.target.value } })}
                className={inputClass}
              />
              <span className="text-zinc-600 self-center">-</span>
              <input type="time" value={dia.manana.hasta}
                onChange={e => onChange({ ...dia, manana: { ...dia.manana, hasta: e.target.value } })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Tarde */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <p className={`text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider transition-colors ${dia.tarde.activo ? 'text-zinc-300' : 'text-zinc-600'}`}>
                <Moon size={12} /> Tarde
              </p>
              <input
                type="checkbox"
                checked={dia.tarde.activo}
                onChange={e => onChange({ ...dia, tarde: { ...dia.tarde, activo: e.target.checked } })}
                className="accent-[#C9A227] h-3 w-3 cursor-pointer"
              />
            </div>

            <div className={`flex gap-2 transition-all duration-200 ${!dia.tarde.activo ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
              <input type="time" value={dia.tarde.desde}
                onChange={e => onChange({ ...dia, tarde: { ...dia.tarde, desde: e.target.value } })}
                className={inputClass}
              />
              <span className="text-zinc-600 self-center">-</span>
              <input type="time" value={dia.tarde.hasta}
                onChange={e => onChange({ ...dia, tarde: { ...dia.tarde, hasta: e.target.value } })}
                className={inputClass}
              />
            </div>
          </div>
        </>
      )}

      {/* Copiar */}
      <button
        type="button"
        onClick={onCopy}
        className="w-full mt-2 text-[10px] font-bold text-zinc-500 hover:text-[#C9A227] hover:bg-white/5 rounded-lg flex items-center justify-center gap-1.5 transition-colors py-2.5 border border-transparent hover:border-white/5"
      >
        <Copy size={12} /> COPIAR A OTROS DÍAS
      </button>
    </div>
  );
};