import './CityEventCard.css';

export default function CityEventCard({ event }) {
  const date = event.dates?.start?.localDate || '';
  const time = event.dates?.start?.localTime || '';
  const venue = event._embedded?.venues?.[0];

  return (
    <div className="city-card">
      {event.images?.[0] && (
        <img src={event.images[0].url} alt={event.name} />
      )}
      <h3>{event.name}</h3>
      <p>{date} {time}</p>
      <p>{venue?.country?.name}</p>
      <p>{venue?.city?.name}</p>
      <p>{venue?.name}</p>
    </div>
  );
}
