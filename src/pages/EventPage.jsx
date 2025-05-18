import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './EventPage.css';
import ArtistCard from '../components/ArtistCard';

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const API_KEY = import.meta.env.VITE_TM_API_KEY;
      const url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Feil ved henting av event:", error);
        setEvent(null);
      }

      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Laster inn detaljer...</p>;
  if (!event) return <p>Fant ikke arrangementet.</p>;

  return (
    <main className="event-page">
      <h1>{event.name}</h1>

      <section>
        <h2>Sjanger:</h2>
        <div className="genres">
          {event.classifications?.map((cls, idx) => (
            <span key={idx}>
              {cls.genre?.name || 'Ukjent'}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2>Følg oss på sosiale medier:</h2>
      </section>

      <section>
        <h2>Festivalpass:</h2>
        <div className="ticket-grid">
          <div className="ticket-card">
            {event.images?.[0] && (
              <img src={event.images[0].url} alt={event.name} />
            )}
            <h3>{event.name}</h3>
            <p>{event._embedded?.venues?.[0]?.name}</p>
            <p>{event.dates?.start?.localDate}</p>
            <div className="ticket-buttons">
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                <button>Kjøp</button>
              </a>
              <button>Legg til i ønskeliste</button>
            </div>
          </div>
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
