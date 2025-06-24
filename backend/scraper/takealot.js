import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function scrapeTakealot(query) {
  console.log("Starting scraper");

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36"
  );

  const searchUrl = `https://www.takealot.com/all?qsearch=${encodeURIComponent(query)}`;
  console.log("Navigating to:", searchUrl);

  try {
    await page.goto(searchUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    try {
      await page.waitForSelector('.ab-close-button', { timeout: 10000 });
      await page.click('.ab-close-button');
      console.log("Popup closed.");
    } catch {
      console.log("No popup detected.");
    }

    await page.waitForSelector('[data-ref="product-card"]', { timeout: 20000 });

    const products = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-ref="product-card"]')).slice(0, 5);
      return cards.map(card => {
        const title = card.querySelector("h4")?.innerText || "No title";
        const price = card.querySelector('[data-ref="price"] .currency')?.innerText || "No price";
        const image = card.querySelector('img[data-ref="product-image"]')?.src || "";
        const linkPart = card.querySelector("a")?.getAttribute("href") || "";
        const link = linkPart ? `https://www.takealot.com${linkPart}` : "";

        return { title, price, image, link };
      });
    });

    await browser.close();

    if (!products.length) {
      throw new Error("No products found");
    }

    console.log("Scraped Products:", products);
    return products;

  } catch (err) {
    await page.screenshot({ path: 'error_screenshot.png' });
    await browser.close();
    console.error("Scrape failed:", err.message);
    throw new Error(`Failed to get Takealot Products: ${err.message}`);
  }
}

export default scrapeTakealot;
