import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import USER_AGENTS from './user.agents.js';

puppeteer.use(StealthPlugin());

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function scrapeAmazon(query) {
  const url = `https://www.amazon.co.za/s?k=${encodeURIComponent(query)}`;
  console.log("Query:", query);
  console.log("Navigating to:", url);

  for (let attempt = 1; attempt <= 3; attempt++) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--single-process',
          '--no-zygote'
        ],
        timeout: 0,
        protocolTimeout: 120000
      });

      const page = await browser.newPage();

      // block heavy resources
      await page.setRequestInterception(true);
      page.on('request', req => {
        if (['image','stylesheet','font'].includes(req.resourceType())) return req.abort();
        req.continue();
      });

      // random UA + headers
      const ua = USER_AGENTS[Math.floor(Math.random()*USER_AGENTS.length)];
      await page.setUserAgent(ua);
      await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-ZA,en;q=0.9' });

      await sleep(500 + Math.random()*1000);

      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'languages', { get: () => ['en-ZA','en'] });
        Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3] });
      });

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForSelector('div[data-component-type="s-search-result"]', { timeout: 60000 });

      const products = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div[data-component-type="s-search-result"]'))
          .slice(0,5)
          .map(card => {
            const title = card.querySelector('h2')?.innerText.trim() || 'No title';
            const whole = card.querySelector('span.a-price-whole')?.innerText.replace(/[^\d]/g,'')||'';
            const frac = card.querySelector('span.a-price-fraction')?.innerText.replace(/[^\d]/g,'')||'';
            const price = whole ? (frac?`${whole}.${frac}`:whole) : 'No price';
            const img = card.querySelector('img.s-image')?.src||'';
            const rel = card.querySelector('a.a-link-normal.s-no-outline')?.href||'';
            return { title, price:`R ${price}`, image:img, link:rel };
          });
      });

      if (!products.length) {
        throw new Error('No Amazon products found');
      }

      await browser.close();
      return products;

    } catch (err) {
      console.warn(`Amazon attempt ${attempt} failed: ${err.message}`);
      if (browser) await browser.close();
      if (attempt === 3) {
        throw new Error(`Amazon scraper error after 3 attempts: ${err.message}`);
      }
      await sleep(2000 * attempt);
    }
  }
}

export default scrapeAmazon;
