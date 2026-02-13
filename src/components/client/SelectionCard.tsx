import { useState, useRef, useEffect } from 'react';
import { type LucideIcon, ChevronDown, Check } from 'lucide-react';

interface SelectionCardProps {
    label: string;
    icon: LucideIcon;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    options: { id: string; label: string }[];
}

export const SelectionCard = ({ label, icon: Icon, placeholder, value, onChange, options }: SelectionCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Encontrar la etiqueta de la opción seleccionada para mostrarla
    const selectedOption = options.find(opt => opt.id === value);

    // Cerrar el dropdown si se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id: string) => {
        onChange(id);
        setIsOpen(false);
    };

    return (
        <div className="w-full" ref={dropdownRef}>
            {/* Etiqueta */}
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
                {label}
            </label>

            <div className="relative group">
                {/* 1. EL "TRIGGER" (Lo que parece el input) */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between pl-11 pr-4 py-4 rounded-xl border transition-all duration-300 outline-none
                        ${isOpen
                            ? 'bg-[#1A1A1A] border-[#C9A227] shadow-[0_0_15px_rgba(201,162,39,0.15)]'
                            : 'bg-[#121212] border-[#333] hover:border-[#555]'
                        }
                    `}
                >
                    {/* Icono Izquierdo */}
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon
                            className={`transition-colors duration-300 ${isOpen || value ? 'text-[#C9A227]' : 'text-slate-500'}`}
                            size={20}
                        />
                    </div>

                    {/* Texto Seleccionado o Placeholder */}
                    <span className={`text-sm font-medium truncate ${selectedOption ? 'text-white' : 'text-zinc-500'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>

                    {/* Flechita Derecha (Rota al abrir) */}
                    <ChevronDown
                        size={16}
                        className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C9A227]' : ''}`}
                    />
                </button>

                {/* 2. EL DROPDOWN (La lista desplegable personalizada) */}
                {isOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-[#1A1A1A] border border-[#C9A227]/30 rounded-xl shadow-2xl shadow-black overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                        <ul className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                            {options.map((opt) => {
                                const isSelected = opt.id === value;
                                return (
                                    <li key={opt.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelect(opt.id)}
                                            className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center justify-between transition-all
                                                ${isSelected
                                                    ? 'bg-[#C9A227]/10 text-[#C9A227]'
                                                    : 'text-zinc-400 hover:bg-[#C9A227] hover:text-[#131313]'
                                                }
                                            `}
                                        >
                                            <span>{opt.label}</span>
                                            {isSelected && <Check size={14} className="text-[#C9A227]" />}
                                        </button>
                                    </li>
                                );
                            })}

                            {options.length === 0 && (
                                <li className="px-4 py-3 text-xs text-zinc-600 text-center italic">
                                    No hay opciones disponibles
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {/* Estilos para el scrollbar interno del dropdown */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #C9A227; }
            `}</style>
        </div>
    );
};