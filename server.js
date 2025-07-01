const express = require('express');
const scrapeTeams = require('./scrape');
require('dotenv').config();

const app = express();

app.get('/api/teams', async (req, res) => {
  try {
    const teams = await scrapeTeams();
    res.json(teams);
  } catch (err) {
    console.error('[Scraper Error]', err.message);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
