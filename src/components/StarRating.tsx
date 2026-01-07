import { Star } from 'lucide-react';
import { useState } from 'react';

interface Props {
  rating: number;
  setRating: (rating: number) => void;
  disabled?: boolean;
}

const StarRating = ({ rating, setRating, disabled = false }: Props) => {
  const [hover, setHover] = useState(0); // Para el efecto visual al pasar el mouse

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={`transition-all ${disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          onClick={() => setRating(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
        >
          <Star
            size={24}
            className={`
              ${star <= (hover || rating) 
                ? "fill-yellow-400 text-yellow-400"  
                : "text-slate-300 fill-none"       
              } transition-colors
            `}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;