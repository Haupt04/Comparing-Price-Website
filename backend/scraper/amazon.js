import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from "fs";

puppeteer.use(StealthPlugin());

async function scrapeAmazon(query) {
    console.log("Started scraper");

    const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: { width: 1280, height: 800 },
    })

    const page = await browser.newPage();

    const url = `https://www.amazon.co.za/s?k=${encodeURIComponent(query)}`;
    console.log("Navigating to ", url)

    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 Chrome/113 Safari/537.36"
    )

    try {
        await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
        });

        // Wait for product cards to appear
        await page.waitForSelector('div[data-component-type="s-search-result"]', { timeout: 20000 });
        

        fs.writeFileSync("amazon_debug.html", await page.content());
        await page.screenshot({ path: "amazon_debug.png", fullPage: true });

        const products = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div[data-component-type="s-search-result"]')).slice(0, 5);
        return cards.map(card => {
            const title = card.querySelector('h2')?.innerText.trim() || "No title";
            const whole = card.querySelector('span.a-price-whole')?.innerText.replace(/[^\d]/g, "") || "";
            const fraction = card.querySelector('span.a-price-fraction')?.innerText.replace(/[^\d]/g, "") || "";
            const price = whole ? (fraction ? `${whole}.${fraction}` : whole) : "No price";
            const image = card.querySelector('img.s-image')?.src || "";

            const anchor = card.querySelector('a.a-link-normal.s-no-outline');
            const relativeLink = anchor?.getAttribute('href') || "";
            const link = relativeLink ? `https://www.amazon.co.za${relativeLink}` : "";

            

            return { title, price: `R ${price}`, image, link };
        });
        });

        await browser.close();

        if (!products.length) throw new Error("No Amazon products found");
        console.log("✅ Amazon scraped products:", products);
        return products;

  } catch (error) {
        await page.screenshot({ path: 'amazon_error.png' });
        await browser.close();
        console.error("Amazon scrape failed:", error.message);
        throw new Error(`Amazon scraper error: ${error.message}`);
  }
}

export default scrapeAmazon;    
