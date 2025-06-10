// combine_reviews.js
// Combines all Google TakeOut review files in data/ into a single reviews.json, sorted by createTime (newest first)

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const outputFile = path.join(__dirname, 'reviews.json');

// Recursively find all review files in a directory
function findReviewFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findReviewFiles(filePath));
    } else if ((file.startsWith('reviews-') && file.endsWith('.json')) || file === 'reviews.json') {
      results.push(filePath);
    }
  }
  return results;
}

const googleDir = path.join(__dirname, 'data', 'google');
const reviewFiles = findReviewFiles(googleDir);

let allReviews = [];
for (const filePath of reviewFiles) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (Array.isArray(data.reviews)) {
    allReviews = allReviews.concat(
      data.reviews.filter(r => r.starRating === 'FOUR' || r.starRating === 'FIVE')
    );
  }
}

allReviews.sort((a, b) => {
  // Newest first
  return (b.createTime || '').localeCompare(a.createTime || '');
});

fs.writeFileSync(outputFile, JSON.stringify({ reviews: allReviews }, null, 2), 'utf8');
console.log(`Combined ${allReviews.length} reviews into ${outputFile}`);
