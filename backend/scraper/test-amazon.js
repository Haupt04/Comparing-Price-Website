// test-amazon.js
import scrapeAmazon from './amazon.js';

scrapeAmazon("funko pop batman")
  .then(products => {
    console.log("Amazon Products:");
    products.forEach((p, i) => console.log(`${i+1}. ${p.title} — ${p.price}`));
  })
  .catch(err => console.error("Error:", err.message));
