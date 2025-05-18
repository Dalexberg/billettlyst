import './CategoryPage.css'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Heart, HeartIcon } from 'lucide-react'
import EventCard from '../components/EventCard'


export default function CategoryPage() {
  const { slug } = useParams()
  const [events, setEvents] = useState([])
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3001/events?keyword=${slug}`)
        const data = await response.json()
        const allEvents = data._embedded?.events || []
        const uniqueEvents = Array.from(new Map(allEvents.map(e => [e.name, e])).values())
        setEvents(uniqueEvents)
      } catch (error) {
        console.error('Feil ved henting av events:', error)
      }
    }

    fetchEvents()
  }, [slug])

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <main className="category-container">
      <h1>{slug.charAt(0).toUpperCase() + slug.slice(1)}</h1>
      <div className="category-grid">
        {events.map(event => (
          <div className="category-card" key={event.id}>
            {event.images?.[0] && (
              <img src={event.images[0].url} alt={event.name} />
            )}
            <h2>{event.name}</h2>
            <button
              className="wishlist-button"
              onClick={() => toggleWishlist(event.id)}
              aria-label="Legg til i ønskeliste"
            >
              {wishlist.includes(event.id) ? (
                <Heart fill="black" stroke="black" />
              ) : (
                <HeartIcon stroke="black" />
              )}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
