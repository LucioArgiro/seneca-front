import { Star, StarHalf } from 'lucide-react';

interface Props {
  rating: number; 
  count?: number; 
  size?: number;  
  showCount?: boolean;
}

export const StarDisplay = ({ rating, count = 0, size = 16, showCount = true }: Props) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<Star key={i} size={size} className="fill-yellow-400 text-yellow-400" />);
      } else if (rating >= i - 0.5) {
        stars.push(<StarHalf key={i} size={size} className="fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} size={size} className="text-slate-200" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {renderStars()}
      </div>
      {showCount && count > 0 && (
        <span className="text-xs text-slate-500 font-medium">
           {rating} ({count} reseñas)
        </span>
      )}
      {showCount && count === 0 && (
        <span className="text-xs text-slate-400">Sin calificaciones</span>
      )}
    </div>
  );
};