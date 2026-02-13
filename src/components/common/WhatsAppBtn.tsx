import { MessageCircle } from 'lucide-react';
import { type ReactNode } from 'react'; // 👈 1. Importar ReactNode

interface WhatsAppBtnProps {
  telefono?: string | number;
  mensaje?: string;
  label?: string;
  tipo?: 'ICON' | 'BUTTON';
  className?: string;
  iconSize?: number;
  children?: ReactNode; // 👈 2. Agregar esta propiedad opcional
}

export const WhatsAppBtn = ({ 
  telefono, 
  mensaje = '', 
  label = 'Enviar WhatsApp', 
  tipo = 'BUTTON',
  className = '',
  iconSize = 20,
  children // 👈 3. Recibir children
}: WhatsAppBtnProps) => {

  if (!telefono) return null;

  const cleanPhone = String(telefono).replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(mensaje);
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  const defaultClasses = className 
    ? className 
    : (tipo === 'ICON' 
        ? "p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all flex items-center justify-center hover:scale-110 shadow-sm"
        : "flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95"
      );

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={defaultClasses}
      onClick={(e) => e.stopPropagation()}
      title={label}
    >
      {/* 4. LÓGICA: Si hay children (contenido personalizado), úsalo. Si no, usa el defecto. */}
      {children ? (
        children
      ) : (
        <>
          <MessageCircle size={iconSize} />
          {tipo === 'BUTTON' && <span>{label}</span>}
        </>
      )}
    </a>
  );
};