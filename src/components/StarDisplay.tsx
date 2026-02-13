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
        stars.push(<Star key={i} size={size} className="fill-[#C9A227] text-[#C9A227]" />);
      } else if (rating >= i - 0.5) {
        stars.push(<StarHalf key={i} size={size} className="fill-[#C9A227] text-[#C9A227]" />);
      } else {
        stars.push(<Star key={i} size={size} className="text-zinc-700" />);
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
        <span className="text-xs text-zinc-400 font-medium">
          <span className="text-white font-bold">{rating.toFixed(1)}</span> ({count})
        </span>
      )}
      {showCount && count === 0 && (
        <span className="text-xs text-zinc-600">Sin calificar</span>
      )}
    </div>
  );
};