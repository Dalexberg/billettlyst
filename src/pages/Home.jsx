import { useEffect, useState } from 'react'
import { fetchEvents } from '../api/ticketmaster'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents().then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  return (
    <main>
      <h1>Billettlyst</h1>
      <p>Velkommen til billettjenesten!</p>

      {loading ? (
        <p>Laster inn arrangementer...</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.name}</strong><br />
              {event.dates?.start?.localDate}<br />
              {event._embedded?.venues?.[0]?.name}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}