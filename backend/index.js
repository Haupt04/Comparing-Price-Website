import express from 'express'
import cors from 'cors'
import scarpeTakealot from './scraper/takealot.js';
import compareRoute from './routes/compare.js'


const app = express();
app.use(cors())

app.use("/api/compare", compareRoute)



app.listen(3001, () => console.log("Server is running on port 3001"))