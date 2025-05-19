import './CategoryPage.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Heart, HeartIcon } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();
  const [attractions, setAttractions] = useState([]);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState(slug);

  const [filterDate, setFilterDate] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterCity, setFilterCity] = useState('');

  useEffect(() => {
    fetchSuggestions(slug);
  }, [slug]);

  const fetchSuggestions = async (keyword) => {
    try {
      const response = await fetch(`http://localhost:3001/suggest?keyword=${keyword}`);
      const data = await response.json();
      setAttractions(data._embedded?.attractions || []);
      setEvents(data._embedded?.events || []);
      setVenues(data._embedded?.venues || []);
    } catch (error) {
      console.error('Feil', error);
    }
  };

  const fetchWithFilters = async () => {
  try {
    const query = new URLSearchParams({
      keyword: searchQuery || slug,
      ...(filterDate && { startDateTime: `${filterDate}T00:00:00Z` }),
      ...(filterCountry && { countryCode: filterCountry }),
      ...(filterCity && { city: filterCity }),
      size: 20,
    });

    const response = await fetch(`http://localhost:3001/events?${query.toString()}`);
    const data = await response.json();

    setAttractions([]);
    setVenues([]);
    setEvents(data._embedded?.events || []);
  } catch (error) {
    console.error('Feil:', error);
    setEvents([]);
  }
};


  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const renderCard = (item, type = 'generic') => {
    const isWishlisted = wishlist.includes(item.id);
    const venue = item._embedded?.venues?.[0];

    return (
      <div className="category-card" key={item.id}>
        {item.images?.[0]?.url && (
          <img src={item.images[0].url} alt={item.name} />
        )}
        <h2>{item.name}</h2>

        {type === 'event' && venue && (
          <div className="event-meta">
            <p>{item.dates?.start?.localDate}</p>
            <p>{item.dates?.start?.localTime}</p>
            <p>{venue.country?.name}</p>
            <p>{venue.city?.name}</p>
            <p>{venue.name}</p>
          </div>
        )}

        {type === 'venue' && (
          <div className="venue-meta">
            <p>{item.city?.name}</p>
            <p>{item.country?.name}</p>
          </div>
        )}

        <button
          className="wishlist-button"
          onClick={() => toggleWishlist(item.id)}
          aria-label="Legg til i ønskeliste"
        >
          {isWishlisted ? (
            <Heart fill="black" stroke="black" />
          ) : (
            <HeartIcon stroke="black" />
          )}
        </button>
      </div>
    );
  };

  return (
    <main className="category-container">
      <h2>Filtrert søk</h2>
      <div className="filter-controls">
        <label>
          Dato:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>
        <label>
          Land:
          <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}>
            <option value="">Velg et land</option>
            <option value="NO">Norge</option>
            <option value="SE">Sverige</option>
            <option value="DE">Tyskland</option>
          </select>
        </label>
        <label>
          By:
          <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
            <option value="">Velg en by</option>
            <option value="Oslo">Oslo</option>
            <option value="Bergen">Bergen</option>
            <option value="Stockholm">Stockholm</option>
            <option value="Berlin">Berlin</option>
          </select>
        </label>
        <button onClick={fetchWithFilters}>Filtrer</button>
      </div>

      <h2>Søk</h2>
      <div className="search-bar">
        <label>
          Søk etter event, attraksjon eller spillested:
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
        <button onClick={() => fetchSuggestions(searchQuery)}>Søk</button>
      </div>

      <section>
        <h2>Attraksjoner</h2>
        <div className="category-grid">
          {attractions.map(item => renderCard(item, 'attraction'))}
        </div>
      </section>

      <section>
        <h2>Arrangementer</h2>
        <div className="category-grid">
          {events.map(item => renderCard(item, 'event'))}
        </div>
      </section>

      <section>
        <h2>Spillesteder</h2>
        <div className="category-grid">
          {venues.map(item => renderCard(item, 'venue'))}
        </div>
      </section>
    </main>
  );
}
