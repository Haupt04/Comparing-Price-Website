import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function scrapeTakealot(query) {
  const searchUrl = `https://www.takealot.com/all?qsearch=${encodeURIComponent(query)}`;
  console.log("Query:", query);
  console.log("Navigating to:", searchUrl);

  let browser;
  for (let i = 0; i < 3; i++) {
    try {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--single-process',
          '--no-zygote'
        ],
        defaultViewport: null,
      });
      break;
    } catch (err) {
      if (err.code === 'ETXTBSY') {
        console.warn("Chromium binary busy, retrying...");
        await sleep(500);
      } else {
        console.error("Browser launch failed:", err.message);
        throw err;
      }
    }
  }

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36'
    );

    await page.goto(searchUrl, {
      waitUntil: 'networkidle2',
      timeout: 120000,
    });

    // Close popup if it exists
    try {
      await page.waitForSelector('.ab-close-button', { timeout: 5000 });
      await page.click('.ab-close-button');
      await page.waitForTimeout(1000);
    } catch {
      console.log('No popup to close');
    }

    await page.waitForSelector('[data-ref="product-card"]', { timeout: 120000 });

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
