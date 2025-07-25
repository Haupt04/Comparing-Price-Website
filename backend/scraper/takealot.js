import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';

puppeteer.use(StealthPlugin());

async function scrapeTakealot(query) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36'
  );

  const searchUrl = `https://www.takealot.com/all?qsearch=${encodeURIComponent(query)}`;
  console.log('Navigating to:', searchUrl);

  try {
    await page.goto(searchUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

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

    await browser.close();

    if (!products.length) {
      throw new Error('No Takealot products found');
    }

    return products;

  } catch (err) {
    await browser.close();
    console.error('Takealot scrape failed:', err.message);
    throw new Error(`Takealot scraper error: ${err.message}`);
  }
}

export default scrapeTakealot;
