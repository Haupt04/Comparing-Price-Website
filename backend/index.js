import express from 'express'
import cors from 'cors'


const app = express();

app.use(cors())

app.get("/", (req, res) => {
    res.send("Backend is running")
})

app.get("/api/compare", (req, res) => {
    const { query } = req.query
    if (!query) return res.status(400).json({error: "Missing Error"});

    res.json({ message : `This will compare prices for ${query}`})
})


app.listen(3001, () => console.log("Server is running on port 3001"))