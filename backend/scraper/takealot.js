import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';
import fs from 'fs';

puppeteer.use(StealthPlugin());

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function scrapeTakealot(query) {
  const searchUrl = `https://www.takealot.com/all?qsearch=${encodeURIComponent(query)}`;
  console.log("Query:", query);
  console.log("Navigating to:", searchUrl);

  const path = await chromium.executablePath();
  console.log("Chromium path:", path);

  if (!fs.existsSync(path)) {
    throw new Error(`Chromium binary not found at ${path}`);
  }

  let browser;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      browser = await puppeteer.launch({
        args: [...chromium.args, '--no-sandbox'],
        defaultViewport: chromium.defaultViewport,
        executablePath: path,
        headless: chromium.headless,
      });

      const page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36'
      );
      await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-ZA,en;q=0.9' });

      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 120000 });

      // Try to close popup
      try {
        await page.waitForSelector('.ab-close-button', { timeout: 5000 });
        await page.click('.ab-close-button');
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch {
        console.log('No popup to close');
      }

      // Wait for content wrapper
      await page.waitForSelector('#shopfront-app', { timeout: 30000 });

      // Wait for product cards
      await page.waitForSelector('[data-ref="product-card"]', { timeout: 60000 });

      const products = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('[data-ref="product-card"]')).slice(0, 5);
        return cards.map(card => {
          const title = card.querySelector('h4')?.innerText.trim() || 'No title';
          const price = card.querySelector('[data-ref="price"] .currency')?.innerText.trim() || 'No price';
          const image = card.querySelector('img[data-ref="product-image"]')?.src || '';
          const linkPart = card.querySelector('a')?.getAttribute('href') || '';
          const link = linkPart ? `https://www.takealot.com${linkPart}` : '';
          return { title, price, image, link };
        });
      });

      if (!products.length) {
        throw new Error('No Takealot products found — maybe blocked?');
      }

      await browser.close();
      return products;

    } catch (err) {
      console.warn(`Attempt ${attempt + 1} failed: ${err.message}`);
      if (browser) {
        try {
          const pages = await browser.pages();
          const html = await pages[0].content();
          fs.writeFileSync(`/tmp/takealot_error_${attempt + 1}.html`, html);
          await pages[0].screenshot({ path: `/tmp/takealot_error_${attempt + 1}.png` });
        } catch (screenshotErr) {
          console.error("Screenshot failed:", screenshotErr.message);
        }
        await browser.close();
      }

      if (attempt === 2) {
        throw new Error(`Takealot scraper error: ${err.message}`);
      }

      console.log("Retrying...");
      await sleep(3000);
    }
  }
}

export default scrapeTakealot;
