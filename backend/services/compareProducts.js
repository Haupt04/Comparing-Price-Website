import scrapeAmazon from '../scraper/amazon.js';
import scrapeTakealot from '../scraper/takealot.js';
import stringSimilarity from 'string-similarity';

export async function compareProducts(query) {
  try {
    
    const [amazonResults, takealotResults] = await Promise.all([
      scrapeAmazon(query),
      scrapeTakealot(query),
    ]);

     const matches = takealotResults.map((takealotProduct) => {
    let bestMatch = null;
    let bestScore = 0;

    for (const amazonProduct of amazonResults) {
      const score = stringSimilarity.compareTwoStrings(
        takealotProduct.title.toLowerCase(),
        amazonProduct.title.toLowerCase()
      );

      if (score > bestScore) {
        bestScore = score;
        bestMatch = amazonProduct;
      }
    }

    return {
      similarity: parseFloat((bestScore * 100).toFixed(2)),
      takealot: {
        title: takealotProduct.title,
        price: takealotProduct.price,
        image: takealotProduct.image,
        link: takealotProduct.link,
      },
      amazon: bestMatch
        ? {
            title: bestMatch.title,
            price: bestMatch.price,
            image: bestMatch.image,
            link: bestMatch.link,
          }
        : null,
    };
  });

  return matches
    .filter(m => m.amazon !== null) // Remove unmatched items
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 4); // Top 4 matches

  } catch (error) {
    console.error(" Comparison failed:", error.message);
  }
}
