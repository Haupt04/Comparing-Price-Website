import express from 'express'
import cors from 'cors'
import compareRoute from './routes/compare.js'
import emailRoute from './routes/emailRoute.js'
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/compare", compareRoute)
app.use("/api/email", emailRoute)

if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"))
    })
}

app._router.stack.forEach(middleware => {
  if (middleware.route) { // routes registered directly on the app
    console.log(middleware.route.path);
  } else if (middleware.name === 'router') { // router middleware 
    middleware.handle.stack.forEach(handler => {
      if (handler.route) console.log(handler.route.path);
    });
  }
});

// Error Handling
app.use((err, req, res, next) => {
    res.status(500).json({message: process.env.NODE_ENV === "production" ? "Internal Server Error": err.message})
})

app.listen(3001, () => console.log("Server is running on port 3001"))