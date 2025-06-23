import puppeteer from "puppeteer"

async function scarpeTakealot(query) {
    const browser = await puppeteer.launch({headless: "new"})
    const page = await browser.newPage();
    const searchUrl = `https://www.takealot.com/all?qsearch=${encodeURIComponent(query)}`;

    await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36"
    );

    try {
        await page.goto(url, { waitUntil: "networkidle2" });

        await page.waitForSelector("h1");

        const data = await page.evaluate(() => {
            const title = document.querySelector("h1")?.innerText.trim() || "No title";
            const price = document.querySelector("span.currency")?.innerText.trim() || "No price found";
            const image = document.querySelector('img[data-ref="main-gallery-photo-0"]')?.src || "";

            return {title, price, image}
        });

        await browser.close()
        return product
        
    } catch (error) {
        await browser.close()
        throw new Error("Failed to get Takealot Product ", error.message)
    }
}

export default scarpeTakealot;