import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

const API_KEY = 'np0rW3NzhZlG0wDIqJHFkXiW1GmKs3kh';

app.get('/events', async (req, res) => {
  const { keyword = '', city = '', countryCode = '', size = '10' } = req.query;

  const params = new URLSearchParams({
    apikey: API_KEY,
    keyword,
    city,
    countryCode,
    size
  });

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Klarte ikke å hente eventliste:', err);
    res.status(500).json({ error: 'Noe gikk galt ved henting av data.' });
  }
});

app.get('/event/:id', async (req, res) => {
  const { id } = req.params;
  const url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(`Klarte ikke å hente event med ID ${id}:`, err);
    res.status(500).json({ error: 'Feil ved henting av event.' });
  }
});

app.get('/suggest', async (req, res) => {
  const { keyword = '', date = '', countryCode = '', city = '' } = req.query;

  const params = new URLSearchParams({
    apikey: API_KEY,
    keyword
  });

  if (date) params.append('startDateTime', `${date}T00:00:00Z`);
  if (countryCode) params.append('countryCode', countryCode);
  if (city) params.append('city', city);

  const url = `https://app.ticketmaster.com/discovery/v2/suggest?${params.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('❌ Feil ved henting av forslag:', err);
    res.status(500).json({ error: 'Noe gikk galt ved henting av forslag.' });
  }
});

app.listen(3001, () => {
  console.log('✅ Proxy-server kjører på http://localhost:3001');
});
