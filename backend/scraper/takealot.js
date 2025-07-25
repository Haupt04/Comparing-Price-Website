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

  for (let i = 0; i < 3; i++) {
    try {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: path,
        headless: chromium.headless,
      });
      break;
    } catch (err) {
      if (err.code === 'ETXTBSY') {
        console.warn("Chromium binary busy, retrying...");
        await sleep(500);
      } else {
        throw err;
      }
    }
  }

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36'
    );

    // Add bot evasion tweaks
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'languages', { get: () => ['en-ZA', 'en'] });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
    });

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
        break;
      } catch (err) {
        if (attempt === 1) {
          await page.screenshot({ path: '/tmp/takealot_error.png' });
          throw new Error(`Navigation failed: ${err.message}`);
        }
        await sleep(2000);
      }
    }

    try {
      await page.waitForSelector('.ab-close-button', { timeout: 5000 });
      await page.click('.ab-close-button');
      console.log('Popup closed');
    } catch {
      console.log('No popup to close');
    }

    await page.waitForSelector('[data-ref="product-card"]', { timeout: 30000 });

    const htmlPreview = await page.content();
    console.log('Takealot HTML Preview:\n', htmlPreview.slice(0, 1000));

    const products = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-ref="product-card"]')).slice(0, 5);
      return cards.map((card) => {
        const title = card.querySelector('h4')?.innerText.trim() || 'No title';
        const price = card.querySelector('[data-ref="price"] .currency')?.innerText.trim() || 'No price';
        const image = card.querySelector('img[data-ref="product-image"]')?.src || '';
        const linkPart = card.querySelector('a')?.getAttribute('href') || '';
        const link = linkPart ? `https://www.takealot.com${linkPart}` : '';
        return { title, price, image, link };
      });
    });

    if (!products.length) {
      await page.screenshot({ path: '/tmp/takealot_no_products.png' });
      throw new Error('No Takealot products found');
    }

    return products;

  } catch (err) {
    console.error('Takealot scrape failed:', err.message);
    throw new Error(`Takealot scraper error: ${err.message}`);
  } finally {
    if (browser) await browser.close();
  }
}

export default scrapeTakealot;
