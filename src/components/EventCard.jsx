import './EventCard.css';
import { Link } from 'react-router-dom';

export default function EventCard({
  event,
  showDetails = false,
  isWishlisted,
  onToggleWishlist,
  hideMeta = false
}) {
  const image = event.images?.[0]?.url;
  const venue = event._embedded?.venues?.[0];

  return (
    <div className="event-card">
      {image && <img src={image} alt={event.name} />}
      <h2>{event.name}</h2>

      {!hideMeta && (
        <div className="event-meta">
          <p>{event.dates?.start?.localDate} {event.dates?.start?.localTime}</p>
          <p>{venue?.city?.name}, {venue?.country?.name}</p>
        </div>
      )}

      {showDetails && (
        <Link to={`/event/${event.id}`}>
          <button className="festival-button">Les mer om {event.name}</button>
        </Link>
      )}
    </div>
  );
}
