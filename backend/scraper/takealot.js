import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import USER_AGENTS from './user.agents.js';

puppeteer.use(StealthPlugin());

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function scrapeTakealot(query) {
  const searchUrl = `https://www.takealot.com/all?qsearch=${encodeURIComponent(query)}`;
  console.log("Query:", query);
  console.log("Navigating to:", searchUrl);

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

      // 1. Block images, fonts, stylesheets
      await page.setRequestInterception(true);
      page.on('request', req => {
        const t = req.resourceType();
        if (['image', 'stylesheet', 'font'].includes(t)) return req.abort();
        req.continue();
      });

      // 2. Random UA + headers
      const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
      await page.setUserAgent(ua);
      await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-ZA,en;q=0.9' });

      // 3. Random small delay
      await sleep(500 + Math.random() * 1000);

      // 4. Navigate
      await page.goto(searchUrl, {
        waitUntil: 'networkidle2',
        timeout: 120000
      });

      // 5. Close popup if present
      try {
        await page.waitForSelector('.ab-close-button', { timeout: 5000 });
        await page.click('.ab-close-button');
        await sleep(1000);
      } catch {}

      // 6. Ensure shell loaded
      await page.waitForSelector('#shopfront-app', { timeout: 30000 });

      // 7. Primary selector, then fallback
      try {
        await page.waitForSelector('[data-ref="product-card"]', { timeout: 60000 });
      } catch {
        console.warn('Primary selector failed, trying fallback .product-card');
        await page.waitForSelector('.product-card', { timeout: 30000 });
      }

      // 8. Extract
      const products = await page.evaluate(() => {
        const sel = document.querySelectorAll('[data-ref="product-card"]')?.length
          ? '[data-ref="product-card"]'
          : '.product-card';
        return Array.from(document.querySelectorAll(sel))
          .slice(0, 5)
          .map(card => {
            const title = card.querySelector('h4')?.innerText.trim() || 'No title';
            const price = card.querySelector('[data-ref="price"] .currency')?.innerText.trim() || 'No price';
            const image = card.querySelector('img[data-ref="product-image"]')?.src || '';
            const path = card.querySelector('a')?.getAttribute('href') || '';
            const link = path ? `https://www.takealot.com${path}` : '';
            return { title, price, image, link };
          });
      });

      if (!products.length) {
        throw new Error('No products found');
      }

      await browser.close();
      return products;

    } catch (err) {
      console.warn(`Attempt ${attempt} failed: ${err.message}`);
      if (browser) {
        try {
          const [pg] = await browser.pages();
          const html = await pg.content();
          fs.writeFileSync(`/tmp/takealot_error_${attempt}.html`, html);
          await pg.screenshot({ path: `/tmp/takealot_error_${attempt}.png`, fullPage: true });
          console.log(`Saved artifacts for attempt ${attempt}`);
        } catch (e) {
          console.error('Failed to save artifacts:', e.message);
        }
        await browser.close();
      }
      if (attempt === 3) {
        throw new Error(`Takealot scraper error after 3 attempts: ${err.message}`);
      }
      // exponential backoff
      await sleep(2000 * attempt);
    }
  }
}

export default scrapeTakealot;
