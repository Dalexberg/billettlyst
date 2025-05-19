import { Heart, HeartIcon } from 'lucide-react';

export default function AttractionCard({ attraction, isWishlisted, onToggleWishlist }) {
  const image = attraction.images?.[0]?.url;

  return (
    <div className="category-card">
      {image && <img src={image} alt={attraction.name} />}
      <h2>{attraction.name}</h2>
      <button
        className="wishlist-button"
        onClick={onToggleWishlist}
        aria-label="Legg til i ønskeliste"
      >
        {isWishlisted ? <Heart fill="black" stroke="black" /> : <HeartIcon stroke="black" />}
      </button>
    </div>
  );
}
