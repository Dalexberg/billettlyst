import { useEffect, useState } from 'react';

export default function TicketmasterEventCard({ apiId }) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events/${apiId}.json?apikey=${import.meta.env.VITE_TM_API_KEY}`
        );
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error('Klarte ikke å hente event fra Ticketmaster:', err);
      }
    };

    fetchEvent();
  }, [apiId]);

  if (!event) return null;

  const venue = event._embedded?.venues?.[0];

  return (
    <div className="tm-event-card">
      <img src={event.images?.[0]?.url} alt={event.name} style={{ width: '100%', maxWidth: 250 }} />
      <h4>{event.name}</h4>
      <p>{event.dates?.start?.localDate}</p>
      <p>{venue?.city?.name}, {venue?.country?.name}</p>
    </div>
  );
}
