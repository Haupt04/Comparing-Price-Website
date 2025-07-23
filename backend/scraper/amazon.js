import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function scrapeAmazon(query) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();

  const url = `https://www.amazon.co.za/s?k=${encodeURIComponent(query)}`;
  console.log("Navigating to:", url);

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113 Safari/537.36"
  );

  try {
    await page.goto(url, {
      waitUntil: 'networkidle0', 
      timeout: 60000,
    });

    const html = await page.content();
    console.log("Amazon HTML Preview:\n", html.slice(0, 1000)); 

    await page.waitForSelector('span.a-price-whole', { timeout: 30000 });

    const products = await page.evaluate(() => {
      const cards = Array.from(
        document.querySelectorAll('div[data-component-type="s-search-result"]')
      ).slice(0, 5); 

      return cards.map((card) => {
        const title = card.querySelector('h2')?.innerText.trim() || "No title";

        const whole = card
          .querySelector('span.a-price-whole')
          ?.innerText.replace(/[^\d]/g, "") || "";

        const fraction = card
          .querySelector('span.a-price-fraction')
          ?.innerText.replace(/[^\d]/g, "") || "";

        const price = whole
          ? fraction
            ? `${whole}.${fraction}`
            : whole
          : "No price";

        const image = card.querySelector('img.s-image')?.src || "";

        const anchor = card.querySelector('a.a-link-normal.s-no-outline');
        const relativeLink = anchor?.getAttribute('href') || "";
        const link = relativeLink
          ? `https://www.amazon.co.za${relativeLink}`
          : "";

        return { title, price: `R ${price}`, image, link };
      });
    });

    await browser.close();

    if (!products.length) {
      throw new Error("No Amazon products found");
    }

    return products;

  } catch (error) {
    await browser.close();
    console.error("Amazon scrape failed:", error.message);
    throw new Error(`Amazon scraper error: ${error.message}`);
  }
}

export default scrapeAmazon;
