import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'

const app = express()
app.use(cors())

const API_KEY = 'np0rW3NzhZlG0wDIqJHFkXiW1GmKs3kh'

app.get('/events', async (req, res) => {
  const keyword = req.query.keyword || ''
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&size=10&keyword=${encodeURIComponent(keyword)}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Noe gikk galt ved henting av data.' })
  }
})

app.listen(3001, () => {
  console.log('🎫 Proxy-server kjører på http://localhost:3001')
})
