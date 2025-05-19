import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './EventPage.css';
import ArtistCard from '../components/ArtistCard';
import EventCard from '../components/EventCard';

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_TM_API_KEY;

    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`
        );
        const data = await response.json();
        setEvent(data);

        const attractionId = data._embedded?.attractions?.[0]?.id;
        if (attractionId) {
          const res = await fetch(
            `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=${attractionId}&apikey=${API_KEY}&size=6`
          );
          const relData = await res.json();
          const filtered = relData._embedded?.events?.filter(e => e.id !== id) || [];
          setRelatedEvents(filtered);
        }
      } catch (error) {
        console.error("Feil", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Laster inn</p>;
  if (!event) return <p>Fant ikke arrangementet.</p>;

  const venue = event._embedded?.venues?.[0];

  return (
    <main className="event-page">
      <h1>{event.name}</h1>

      <section>
        <h2>Sjanger:</h2>
        <div className="genres">
          {event.classifications?.map((cls, idx) => (
            <span key={idx}>{cls.genre?.name || 'Ukjent'}</span>
          ))}
        </div>
      </section>

      <section>
        <h2>Følg oss på sosiale medier:</h2>
      </section>

      <section>
        <h2>Festivalpass:</h2>
        <div className="ticket-grid">
          {[event, ...relatedEvents].map((e) => (
            <div className="ticket-card" key={e.id}>
              {e.images?.[0] && <img src={e.images[0].url} alt={e.name} />}
              <h3>{e.name}</h3>
              <div className="event-details-row">
                <p>{e._embedded?.venues?.[0]?.name}</p>
                <p>{e.dates?.start?.localDate}</p>
              </div>
              <div className="ticket-buttons">
                <button disabled>Kjøp</button>
                <button disabled>Legg til i ønskeliste</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {event._embedded?.attractions && (
        <section>
          <h2>Artister</h2>
          <div className="artist-list">
            {event._embedded.attractions.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={{
                  name: artist.name,
                  image: artist.images?.[0]?.url,
                  role: artist.classifications?.[0]?.segment?.name || 'Artist'
                }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
