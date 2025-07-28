import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function scrapeTakealot(query) {
  const searchUrl = `https://www.takealot.com/all?qsearch=${encodeURIComponent(query)}`;
  console.log("Query:", query);
  console.log("Navigating to:", searchUrl);

  let browser;
  for (let attempt = 1; attempt <= 3; attempt++) {
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
        ]
      });

      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36'
      );
      await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-ZA,en;q=0.9' });

      // give the page a moment to settle
      await sleep(500 + Math.random() * 500);

      // load the page
      await page.goto(searchUrl, {
        waitUntil: 'networkidle2',
        timeout: 120000
      });

      // close any popup
      try {
        await page.waitForSelector('.ab-close-button', { timeout: 5000 });
        await page.click('.ab-close-button');
        await sleep(1000);
      } catch { /* no popup */ }

      // ensure the app shell has loaded
      await page.waitForSelector('#shopfront-app', { timeout: 30000 });
      // then wait for product cards
      await page.waitForSelector('[data-ref="product-card"]', { timeout: 60000 });

      // extract up to 5 products
      const products = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[data-ref="product-card"]'))
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

      if (products.length === 0) {
        throw new Error('No Takealot products found (empty result set)');
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
          console.log(`Saved error artifacts for attempt ${attempt}`);
        } catch (e) {
          console.error('Failed to save artifacts:', e.message);
        }
        await browser.close();
      }

      if (attempt === 3) {
        throw new Error(`Takealot scraper error after 3 attempts: ${err.message}`);
      }

      // back off before retry
      await sleep(3000);
    }
  }
}

export default scrapeTakealot;
