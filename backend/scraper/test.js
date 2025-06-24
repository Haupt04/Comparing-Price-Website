// test.js
import scrapeTakealot from './takealot.js';

scrapeTakealot("funko pop harley quinn")
  .then(products => {
    console.log("Top 5 Products for Search Results:");
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title} - ${p.price}`);
      console.log(`${p.link}`);
    });
  })
  .catch(err => console.error("Error:", err.message));
