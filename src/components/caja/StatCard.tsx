import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  subtext?: string;
}

export const StatCard = ({ title, value, icon: Icon, color, subtext }: StatCardProps) => {
  
  // Mapeo de colores para estilos dinámicos (Versión Dark Neon)
  const colorMap = {
    blue:   'bg-[#131313] text-[#C9A227] hover:bg-[#C6A227] hover:text-[#131313]',
    green:  'bg-[#131313] text-[#C9A227] hover:bg-[#C6A227] hover:text-[#131313]',
    red:    'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    purple: 'bg-[#131313] text-[#C9A227] hover:bg-[#C6A227] hover:text-[#131313]',
    orange: 'bg-[#131313] text-[#C9A227] hover:bg-[#C6A227] hover:text-[#131313]',
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  return (
    // 👇 CAMBIO: Fondo oscuro, bordes sutiles y hover con elevación
    <div className="bg-granular-dark p-6 rounded-2xl border border-transparent hover:border-[#C9A227] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-[#c9a227] uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-black text-white tracking-tight">
            {formatMoney(value)}
          </h3>
          {subtext && <p className="text-xs text-slate-300 mt-2">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};