import './Home.css';
import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import CityEventCard from '../components/CityEventCard';

const festivalIDs = [
  'Z698xZb_Z16v7eGkFy', // Findings
  'Z698xZb_Z17q33_',    // NEON
  'Z698xZb_Z17qfao',    // Skeikampen
  'Z698xZb_Z17q3qg'     // Tons of Rock
];

const cityOptions = ['Oslo', 'London', 'Paris', 'Berlin'];

const cityToCountryCode = {
  Oslo: 'NO',
  London: 'GB',
  Paris: 'FR',
  Berlin: 'DE'
};

export default function Home() {
  const [festivals, setFestivals] = useState([]);
  const [cityEvents, setCityEvents] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Oslo');
  const [loadingFestivals, setLoadingFestivals] = useState(true);
  const [loadingCity, setLoadingCity] = useState(true);

  useEffect(() => {
    const fetchFestival = async (id) => {
      try {
        const response = await fetch(`http://localhost:3001/event/${id}`);
        const data = await response.json();
        console.log(`✅ Fant festival med ID ${id}: ${data.name}`);
        return data;
      } catch (err) {
        console.error(`❌ Klarte ikke å hente festival med ID ${id}:`, err);
        return null;
      }
    };

    Promise.all(festivalIDs.map(fetchFestival)).then((results) => {
      setFestivals(results.filter(Boolean));
      setLoadingFestivals(false);
    });
  }, []);

  useEffect(() => {
    const fetchCityEvents = async () => {
      setLoadingCity(true);
      try {
        const API_KEY = import.meta.env.VITE_TM_API_KEY;
        const countryCode = cityToCountryCode[selectedCity] || 'NO';
        const url = `http://localhost:3001/events?city=${encodeURIComponent(selectedCity)}&countryCode=${countryCode}&size=20`;

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
            <p style={{ color: 'red' }}>
              Fant ikke riktige festivaler
            </p>
          )}
          <div className="festival-grid">
            {festivals.map((event, index) => (
              <EventCard
                key={event.id || `${event.name}-${index}`}
                event={event}
                isWishlisted={false}
                onToggleWishlist={() => {}}
                showDetails={true}
                hideMeta={true}
              />
            ))}
          </div>
        </>
      )}

      <section className="city-events">
        <h2 className="section-title">Hva skjer i verdens storbyer!</h2>
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

        <h2 className="section-title">Hva skjer i {selectedCity}</h2>

        {loadingCity ? (
          <p>Laster inn arrangementer i {selectedCity}...</p>
        ) : (
          <div className="festival-grid">
            {cityEvents.map((event, index) => (
              <CityEventCard
                key={event.id || `${event.name}-${index}`}
                event={event}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
