import { type LucideIcon } from 'lucide-react';

interface SelectionCardProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (val: string) => void;
  options: { id: string; label: string }[];
  disabled?: boolean;
  placeholder: string;
}

export const SelectionCard = ({ label, icon: Icon, value, onChange, options, disabled, placeholder }: SelectionCardProps) => {
  return (
    <div>
      <label className="block text-slate-500 text-xs font-bold uppercase mb-1.5 ml-1">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" size={18} />
        <select
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none disabled:bg-slate-50 disabled:text-slate-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};