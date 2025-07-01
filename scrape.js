const puppeteer = require('puppeteer');
require('dotenv').config();

async function scrapeTeams() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  await page.goto(`${process.env.HE_BASE_URL}/login/`, { waitUntil: 'networkidle2' });

  await page.type('input[name="username"]', process.env.HE_USERNAME);
  await page.type('input[name="password"]', process.env.HE_PASSWORD);
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  await page.goto(`${process.env.HE_BASE_URL}${process.env.HE_TEAM_PAGE}`, {
    waitUntil: 'networkidle2'
  });

  await page.waitForSelector('.participant-card', { timeout: 15000 });

  const teams = await page.evaluate(() => {
    const cards = document.querySelectorAll('.participant-card');

    return Array.from(cards).map(el => {
      const teamName = el.querySelector('h3')?.innerText || 'Unknown Team';
      const memberName = el.querySelector('.participant-name')?.innerText || 'Unknown';
      const skills = el.querySelector('.participant-skills')?.innerText || '';

      return {
        team_name: teamName.trim(),
        members: [{
          name: memberName.trim(),
          skills: skills.trim()
        }]
      };
    });
  });

  await browser.close();
  return teams;
}

module.exports = scrapeTeams;
