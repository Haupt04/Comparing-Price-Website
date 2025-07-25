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
        args: [...chromium.args, '--no-sandbox'],
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
        console.error("Browser launch failed:", err.message);
        throw err;
      }
    }
  }

  try {
    const page = await browser.newPage();

    const html = await page.content();
    console.log("HTML Snapshot:", html.slice(0, 1000));

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36'
    );

    // Use networkidle2 for better dynamic content loading
    await page.goto(searchUrl, {
      waitUntil: 'networkidle2',
      timeout: 120000,
    });

    // Try to close any popup if it exists
    try {
      await page.waitForSelector('.ab-close-button', { timeout: 5000 });
      await page.click('.ab-close-button');
      console.log('Popup closed');
      // Wait a moment after closing popup
      await page.waitForTimeout(1000);
    } catch {
      console.log('No popup to close');
    }

    // Wait for product cards - increase timeout
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

    await browser.close();

    if (!products.length) {
      throw new Error('No Takealot products found');
    }

    return products;

  } catch (err) {
    if (browser) {
      // Save page HTML and screenshot on error for debugging
      try {
        const page = (await browser.pages())[0];
        const html = await page.content();
        fs.writeFileSync('/tmp/takealot_error.html', html);
        await page.screenshot({ path: '/tmp/takealot_error.png', fullPage: true });
      } catch (e) {
        console.error("Failed to save error artifacts:", e.message);
      }
      await browser.close();
    }
    console.error('Takealot scrape failed:', err.message);
    throw new Error(`Takealot scraper error: ${err.message}`);
  }
}

export default scrapeTakealot;
