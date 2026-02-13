// src/components/common/HorariosList.tsx
import { Clock } from 'lucide-react';

interface HorariosListProps {
    jsonHorarios?: string;
}

export const HorariosList = ({ jsonHorarios }: HorariosListProps) => {
    if (!jsonHorarios || !jsonHorarios.startsWith('[')) {
        return <p className="text-xs text-zinc-500 italic">Horarios no disponibles</p>;
    }

    let dias = [];
    try {
        dias = JSON.parse(jsonHorarios);
    } catch (error) {
        return <p className="text-xs text-red-400">Error en datos</p>;
    }

    // Calcular índice de hoy (0=Lunes en tu array, pero 0=Domingo en JS Date)
    const hoyDate = new Date().getDay(); 
    // Ajuste: Si hoyDate es 0 (Domingo) -> index 6. Si es 1 (Lunes) -> index 0.
    const hoyIndex = hoyDate === 0 ? 6 : hoyDate - 1;
    
    const diaActual = dias[hoyIndex];

    if (!diaActual) return <p className="text-xs text-zinc-500">Sin información para hoy</p>;

    return (
        <div className="w-full mt-2">
            <div className="bg-[#0a0a0a] border border-[#C9A227]/30 rounded-xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden group">

                <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-[#C9A227]/10 p-2 rounded-lg text-[#C9A227]">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-[#C9A227] font-bold uppercase tracking-widest mb-0.5">
                            HOY ({diaActual.dia?.slice(0, 3)})
                        </p>
                        
                        {diaActual.abierto ? (
                            <div className="flex flex-col">
                                {/* Turno Mañana */}
                                {diaActual.manana && (
                                    <span className="text-white font-mono text-sm font-bold tracking-tight">
                                        {diaActual.manana.desde} - {diaActual.manana.hasta}
                                    </span>
                                )}
                                {/* Turno Tarde */}
                                {diaActual.tarde?.activo && (
                                    <span className="text-zinc-400 font-mono text-xs font-medium">
                                        {diaActual.tarde.desde} - {diaActual.tarde.hasta}
                                    </span>
                                )}
                                {/* Turno Único (Legacy) */}
                                {!diaActual.manana && diaActual.desde && (
                                    <span className="text-white font-mono text-sm font-bold">
                                        {diaActual.desde} - {diaActual.hasta}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-red-400 font-bold text-xs bg-red-900/10 px-2 py-0.5 rounded border border-red-900/30 uppercase tracking-wide">
                                CERRADO
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};