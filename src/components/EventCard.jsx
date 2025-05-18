import './EventCard.css'
import { Link } from 'react-router-dom'
import { Heart, HeartIcon } from 'lucide-react'

export default function EventCard({ event, isWishlisted, onToggleWishlist, clickable = true, showWishlist = false }) {
  return (
    <div className="event-card">
      {event.images?.[0] && (
        <img src={event.images[0].url} alt={event.name} className="event-image" />
      )}
      <div className="event-info">
        <h2 className="event-name">{event.name}</h2>
        <p className="event-location">
          {event._embedded?.venues?.[0]?.city?.name}, {event._embedded?.venues?.[0]?.country?.name}
        </p>
        <p className="event-date">{event.dates?.start?.localDate}</p>

        {showWishlist && (
          <button
            onClick={() => onToggleWishlist(event.id)}
            className="wishlist-button"
            aria-label="Legg til i ønskeliste"
          >
            {isWishlisted ? <Heart fill="black" stroke="black" /> : <HeartIcon stroke="black" />}
          </button>
        )}

        {clickable && (
          <Link to={`/event/${event.id}`}>
            <button className="event-button">Les mer</button>
          </Link>
        )}
      </div>
    </div>
  )
}
