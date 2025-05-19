import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sanity, urlFor } from '../lib/sanityClient';

export default function SanityEventDetails() {
  const { id } = useParams();
  const [sanityEvent, setSanityEvent] = useState(null);
  const [tmEvent, setTmEvent] = useState(null);
  const [usersWithWishlist, setUsersWithWishlist] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const event = await sanity.fetch(
          `*[_type == "event" && apiId == $id][0]`, { id }
        );
        setSanityEvent(event);

        const tmRes = await fetch(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${import.meta.env.VITE_TM_API_KEY}`);
        const tmData = await tmRes.json();
        setTmEvent(tmData);

        const users = await sanity.fetch(
          `*[_type == "user" && $id in wishlist[]->apiId]{
            _id,
            name,
            image
          }`, { id }
        );
        setUsersWithWishlist(users);
      } catch (err) {
        console.error('Feil ved henting av data:', err);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (!sanityEvent || !tmEvent) return <p>Laster inn...</p>;

  const venue = tmEvent._embedded?.venues?.[0];
  const genre = tmEvent.classifications?.[0]?.genre?.name;

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{sanityEvent.title}</h1>

      <p><strong>Dato:</strong> {tmEvent.dates?.start?.localDate}</p>
      <p><strong>Sted:</strong> {venue?.name}, {venue?.city?.name}, {venue?.country?.name}</p>
      <p><strong>Sjanger:</strong> {genre}</p>

      <section>
        <h2>Hvem har dette i ønskeliste</h2>
        {usersWithWishlist.length === 0 ? (
          <p>Ingen brukere har lagt dette til i ønskelisten enda </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {usersWithWishlist.map(user => (
              <div key={user._id} style={{ width: 150, textAlign: 'center' }}>
                {user.image && (
                  <img src={urlFor(user.image).width(100).url()} alt={user.name} style={{ borderRadius: '50%' }} />
                )}
                <p>{user.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
