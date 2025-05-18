const API_KEY = import.meta.env.VITE_TM_API_KEY
console.log("API-nøkkel:", API_KEY)  

export async function fetchEvents(keyword = '') {
  const API_KEY = import.meta.env.VITE_TM_API_KEY
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&size=5&keyword=${encodeURIComponent(keyword)}`
  const response = await fetch(url)
  const data = await response.json()

  return data._embedded?.events || [] // 🔁 returner liste
}
