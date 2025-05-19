import './VenueCard.css';
import { Heart, HeartIcon } from 'lucide-react';

export default function VenueCard({ venue, isWishlisted, onToggleWishlist }) {
  return (
    <div className="category-card">
      <h2>{venue.name}</h2>
      <p>{venue.city?.name}, {venue.country?.name}</p>
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
