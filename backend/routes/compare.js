import express from "express"
import scrapeTakealot from "../scraper/takealot.js"
import scrapeAmazon from "../scraper/amazon.js"
const router = express.Router()


router.get("/", async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Missing query param"});

    try {
        const [takealotResults, amazonResults] = await Promise.all([
            scrapeTakealot(query),
            scrapeAmazon(query)
        ]);

        res.json({
            query,
            results: [...takealotResults, ...amazonResults]
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to fetch comparison data"})
    }
})


export default router