import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function scrapeAmazon(query) {
  const url = `https://www.amazon.co.za/s?k=${encodeURIComponent(query)}`;
  console.log("Query:", query);
  console.log("Navigating to:", url);

  let browser;
  for (let i = 0; i < 3; i++) {
    try {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium', // Path to system-installed Chromium
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
        throw err;
      }
    }
  }

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113 Safari/537.36"
    );

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'languages', { get: () => ['en-ZA', 'en'] });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('div[data-component-type="s-search-result"]', { timeout: 30000 });

    const products = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div[data-component-type="s-search-result"]')).slice(0, 5);

      return cards.map((card) => {
        const title = card.querySelector('h2')?.innerText.trim() || "No title";
        const whole = card.querySelector('span.a-price-whole')?.innerText.replace(/[^\d]/g, "") || "";
        const fraction = card.querySelector('span.a-price-fraction')?.innerText.replace(/[^\d]/g, "") || "";

        const price = whole
          ? fraction
            ? `${whole}.${fraction}`
            : whole
          : "No price";

        const image = card.querySelector('img.s-image')?.src || "";
        const anchor = card.querySelector('a.a-link-normal.s-no-outline');
        const relativeLink = anchor?.getAttribute('href') || "";
        const link = relativeLink ? `https://www.amazon.co.za${relativeLink}` : "";

        return { title, price: `R ${price}`, image, link };
      });
    });

    if (!products.length) {
      throw new Error("No Amazon products found");
    }

    return products;

  } catch (error) {
    console.error("Amazon scrape failed:", error.message);
    throw new Error(`Amazon scraper error: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
}

export default scrapeAmazon;
