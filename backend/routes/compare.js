import express from "express";
import { compareProducts } from "../services/compareProducts.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing query param" });

  console.log("Query:", query);

  try {
   const matches = await compareProducts(query);
   res.json({query, matches});
  } catch (error) {
    console.error(" Error comparing products:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;