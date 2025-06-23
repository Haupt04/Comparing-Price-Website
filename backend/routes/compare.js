import express from "express"
import scarpeTakealot from "../scraper/takealot.js"

const router = express.Router()


router.get("/", async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Missing query param"});

    try {
        const [takealotResults, amazonResults] = await Promise.all({
            scarpeTakealot(query),
            // Scarape Amazon here
        });

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