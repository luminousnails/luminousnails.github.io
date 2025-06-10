// combine_reviews.js
// Combines all Google and Facebook review files in data/ into a single reviews.json, sorted by date (newest first)

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

// Function to normalize Google review to unified format
function normalizeGoogleReview(review) {
  const starRatingMap = {
    'ONE': 1,
    'TWO': 2,
    'THREE': 3,
    'FOUR': 4,
    'FIVE': 5
  };

  return {
    name: review.reviewer?.displayName || 'Anonymous',
    rating: starRatingMap[review.starRating] || 5,
    text: review.comment || '',
    date: review.createTime || review.updateTime || '',
    source: 'google',
    profilePic: null,
    reply: review.reviewReply ? {
      text: review.reviewReply.comment || '',
      date: review.reviewReply.updateTime || ''
    } : null,
    originalId: review.name || ''
  };
}

// Function to normalize Facebook review to unified format
function normalizeFacebookReview(review) {
  return {
    name: review.name || 'Anonymous',
    rating: review.rating || 5,
    text: review.text || '',
    date: review.date || '',
    source: 'facebook',
    profilePic: review.profilePic || null,
    reply: null,
    originalId: `facebook-${review.name}-${review.date}`
  };
}

// Process Google reviews
const googleDir = path.join(__dirname, 'data', 'google');
const googleReviewFiles = findReviewFiles(googleDir);

let allReviews = [];

for (const filePath of googleReviewFiles) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (Array.isArray(data.reviews)) {
    const filteredReviews = data.reviews.filter(r => r.starRating === 'FOUR' || r.starRating === 'FIVE');
    allReviews = allReviews.concat(filteredReviews.map(normalizeGoogleReview));
  }
}

// Process Facebook reviews
const facebookReviewsPath = path.join(__dirname, 'data', 'facebook', 'reviews.json');
if (fs.existsSync(facebookReviewsPath)) {
  const facebookData = JSON.parse(fs.readFileSync(facebookReviewsPath, 'utf8'));
  if (Array.isArray(facebookData.reviews)) {
    const filteredFacebookReviews = facebookData.reviews.filter(r => 
      r.rating >= 4 && r.name && r.text // Only include 4-5 star reviews with text and name
    );
    allReviews = allReviews.concat(filteredFacebookReviews.map(normalizeFacebookReview));
  }
}

// Remove duplicates based on content similarity (same name and similar date)
const uniqueReviews = [];
const seenReviews = new Set();

for (const review of allReviews) {
  const key = `${review.name.toLowerCase()}-${review.date.substring(0, 10)}`; // Use name + date (YYYY-MM-DD)
  if (!seenReviews.has(key)) {
    seenReviews.add(key);
    uniqueReviews.push(review);
  }
}

// Sort by date (newest first)
uniqueReviews.sort((a, b) => {
  return (b.date || '').localeCompare(a.date || '');
});

// Create output with metadata
const output = {
  reviews: uniqueReviews,
  metadata: {
    totalReviews: uniqueReviews.length,
    sources: {
      google: uniqueReviews.filter(r => r.source === 'google').length,
      facebook: uniqueReviews.filter(r => r.source === 'facebook').length
    },
    averageRating: uniqueReviews.length > 0 ? 
      (uniqueReviews.reduce((sum, r) => sum + r.rating, 0) / uniqueReviews.length).toFixed(1) : 0,
    lastUpdated: new Date().toISOString()
  }
};

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
console.log(`Combined ${uniqueReviews.length} unique reviews from Google (${output.metadata.sources.google}) and Facebook (${output.metadata.sources.facebook}) into ${outputFile}`);
console.log(`Average rating: ${output.metadata.averageRating}/5`);
