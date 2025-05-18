import './Home.css';
import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';

const festivalNavn = ['Findings', 'NEON', 'Skeikampen', 'Tons of Rock'];
const cityOptions = ['Oslo', 'London', 'Paris', 'Berlin'];

export default function Home() {
  const [festivals, setFestivals] = useState([]);
  const [cityEvents, setCityEvents] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Oslo');
  const [loadingFestivals, setLoadingFestivals] = useState(true);
  const [loadingCity, setLoadingCity] = useState(true);

  useEffect(() => {
    const fetchFestival = async (name) => {
      try {
        const url = `http://localhost:3001/events?keyword=${encodeURIComponent(name)}&countryCode=NO`;
        const response = await fetch(url);
        const data = await response.json();
        const events = data._embedded?.events || [];
        const match = events.find(e => e.name.toLowerCase().includes(name.toLowerCase()));
        return match || events[0] || null;
      } catch (err) {
        console.error(`❌ Klarte ikke å hente ${name}:`, err);
        return null;
      }
    };

    Promise.all(festivalNavn.map(fetchFestival)).then((results) => {
      setFestivals(results.filter(Boolean));
      setLoadingFestivals(false);
    });
  }, []);

  useEffect(() => {
    const fetchCityEvents = async () => {
      setLoadingCity(true);
      try {
        const url = `http://localhost:3001/events?city=${encodeURIComponent(selectedCity)}&size=20`;
        const response = await fetch(url);
        const data = await response.json();
        const events = data._embedded?.events || [];
        const uniqueEvents = Array.from(new Map(events.map(e => [e.name, e])).values());
        setCityEvents(uniqueEvents.slice(0, 10));
      } catch (err) {
        console.error('❌ Klarte ikke å hente by-arrangementer:', err);
        setCityEvents([]);
      } finally {
        setLoadingCity(false);
      }
    };

    fetchCityEvents();
  }, [selectedCity]);

  return (
    <main className="home-container">
      <h1 className="home-title">Sommerens festivaler!</h1>

      {loadingFestivals ? (
        <p>Laster inn festivaler...</p>
      ) : (
        <>
          {festivals.length < 4 && (
            <p style={{ color: 'orange' }}>
              Fant ikke alle festivalene. Her er de som er tilgjengelig.
            </p>
          )}
          <div className="festival-grid">
            {festivals.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isWishlisted={false}
                onToggleWishlist={() => {}}
                showDetails={true}
              />
            ))}
          </div>
        </>
      )}

      <section className="city-events">
        <h2>I {selectedCity} kan du oppleve:</h2>
        <div className="city-buttons">
          {cityOptions.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={selectedCity === city ? 'active' : ''}
            >
              {city}
            </button>
          ))}
        </div>

        {loadingCity ? (
          <p>Laster inn arrangementer i {selectedCity}...</p>
        ) : (
          <div className="festival-grid">
            {cityEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isWishlisted={false}
                onToggleWishlist={() => {}}
                showDetails={false}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
