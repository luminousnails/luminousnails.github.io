// combine_reviews.js
// Imports Google Takeout zips into dated snapshots, merges all Google snapshots
// into a persistent master file, then rebuilds the site reviews.json.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const outputFile = path.join(__dirname, 'reviews.json');
const googleBaseDir = path.join(__dirname, 'data', 'google');
const googleMasterFile = path.join(googleBaseDir, 'master-reviews.json');
const facebookReviewsPath = path.join(__dirname, 'data', 'facebook', 'reviews.json');
const SNAPSHOT_DIR_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const LEGACY_SNAPSHOT_ID = '0000-00-00-legacy-root';

function listReviewFiles(dir, options = {}) {
  const { includeRootReviewsJson = true } = options;

  return fs.readdirSync(dir)
    .filter(file => {
      if (file === path.basename(googleMasterFile)) {
        return false;
      }

      if (file.startsWith('reviews-') && file.endsWith('.json')) {
        return true;
      }

      return includeRootReviewsJson && file === 'reviews.json';
    })
    .map(file => path.join(dir, file))
    .sort();
}

function listSnapshotDirs() {
  return fs.readdirSync(googleBaseDir)
    .filter(name => SNAPSHOT_DIR_PATTERN.test(name))
    .map(name => ({
      id: name,
      dir: path.join(googleBaseDir, name)
    }))
    .filter(entry => fs.statSync(entry.dir).isDirectory())
    .sort((a, b) => a.id.localeCompare(b.id));
}

function collectGoogleSources() {
  const sources = [];
  const legacyFiles = listReviewFiles(googleBaseDir, { includeRootReviewsJson: true });

  if (legacyFiles.length > 0) {
    sources.push({
      snapshotId: LEGACY_SNAPSHOT_ID,
      displayName: 'legacy-root',
      files: legacyFiles
    });
  }

  for (const snapshot of listSnapshotDirs()) {
    const files = listReviewFiles(snapshot.dir, { includeRootReviewsJson: true });
    if (files.length > 0) {
      sources.push({
        snapshotId: snapshot.id,
        displayName: snapshot.id,
        files
      });
    }
  }

  return sources;
}

function parseArgs(argv) {
  const options = {
    googleTakeoutZip: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--google-takeout-zip') {
      options.googleTakeoutZip = argv[index + 1] || null;
      index += 1;
    } else if (arg.startsWith('--google-takeout-zip=')) {
      options.googleTakeoutZip = arg.slice('--google-takeout-zip='.length);
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node combine_reviews.js [--google-takeout-zip /path/to/takeout.zip]');
      process.exit(0);
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function runUnzip(args, options = {}) {
  return execFileSync('unzip', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  });
}

function listZipEntries(zipPath) {
  const output = runUnzip(['-Z1', zipPath]);
  return output.split('\n').map(line => line.trim()).filter(Boolean);
}

function deriveSnapshotDate(zipPath, entries) {
  const zipName = path.basename(zipPath);
  const zipMatch = zipName.match(/(\d{4})(\d{2})(\d{2})T/);
  if (zipMatch) {
    return `${zipMatch[1]}-${zipMatch[2]}-${zipMatch[3]}`;
  }

  for (const entry of entries) {
    const entryMatch = entry.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (entryMatch) {
      return `${entryMatch[1]}-${entryMatch[2]}-${entryMatch[3]}`;
    }
  }

  return new Date().toISOString().slice(0, 10);
}

function choosePrimaryGoogleAccount(reviewEntries) {
  const accountStats = new Map();

  for (const entry of reviewEntries) {
    if (!accountStats.has(entry.accountId)) {
      accountStats.set(entry.accountId, {
        accountId: entry.accountId,
        locations: new Set(),
        reviewFiles: 0
      });
    }

    const stats = accountStats.get(entry.accountId);
    stats.locations.add(entry.locationId);
    stats.reviewFiles += 1;
  }

  return [...accountStats.values()].sort((a, b) => {
    if (b.locations.size !== a.locations.size) {
      return b.locations.size - a.locations.size;
    }

    if (b.reviewFiles !== a.reviewFiles) {
      return b.reviewFiles - a.reviewFiles;
    }

    return b.accountId.localeCompare(a.accountId);
  })[0] || null;
}

function buildImportedFilename(entry, duplicateBasenames) {
  if (entry.baseName === 'reviews.json') {
    return `reviews-location-${entry.locationId}.json`;
  }

  if (duplicateBasenames.has(entry.baseName)) {
    return `reviews-location-${entry.locationId}-${entry.baseName.slice('reviews-'.length)}`;
  }

  return entry.baseName;
}

function importGoogleTakeoutZip(zipPath) {
  const absoluteZipPath = path.resolve(zipPath);

  if (!fs.existsSync(absoluteZipPath)) {
    throw new Error(`Google Takeout zip not found: ${absoluteZipPath}`);
  }

  const zipEntries = listZipEntries(absoluteZipPath);
  const reviewEntries = zipEntries
    .map(entry => {
      const match = entry.match(/^Takeout\/Google Business Profile\/account-(\d+)\/location-(\d+)\/(reviews(?:-[^/]+)?\.json)$/);
      if (!match) {
        return null;
      }

      return {
        zipEntry: entry,
        accountId: match[1],
        locationId: match[2],
        baseName: match[3]
      };
    })
    .filter(Boolean);

  if (reviewEntries.length === 0) {
    throw new Error('No Google review JSON files found in the provided Takeout zip.');
  }

  const primaryAccount = choosePrimaryGoogleAccount(reviewEntries);
  if (!primaryAccount) {
    throw new Error('Could not determine the primary Google Business Profile account in the Takeout zip.');
  }

  const selectedEntries = reviewEntries.filter(entry => entry.accountId === primaryAccount.accountId);
  const duplicateBasenames = new Set(
    [...selectedEntries.reduce((counts, entry) => {
      counts.set(entry.baseName, (counts.get(entry.baseName) || 0) + 1);
      return counts;
    }, new Map()).entries()]
      .filter(([, count]) => count > 1)
      .map(([baseName]) => baseName)
  );

  const snapshotDate = deriveSnapshotDate(absoluteZipPath, zipEntries);
  const snapshotDir = path.join(googleBaseDir, snapshotDate);
  fs.mkdirSync(snapshotDir, { recursive: true });

  for (const entry of selectedEntries) {
    const importedName = buildImportedFilename(entry, duplicateBasenames);
    const importedPath = path.join(snapshotDir, importedName);
    const contents = runUnzip(['-p', absoluteZipPath, entry.zipEntry], {
      encoding: 'buffer'
    });
    fs.writeFileSync(importedPath, contents);
  }

  console.log(`Imported ${selectedEntries.length} Google review files from ${path.basename(absoluteZipPath)} into ${path.relative(__dirname, snapshotDir)}`);
  console.log(`Primary Google account: ${primaryAccount.accountId} (${primaryAccount.locations.size} locations)`);

  return snapshotDir;
}

function normalizeGoogleReview(review, context) {
  const starRatingMap = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5
  };

  const rating = starRatingMap[review.starRating];
  if (!rating || rating < 4) {
    return null;
  }

  return {
    name: review.reviewer?.displayName || 'Anonymous',
    rating,
    text: review.comment || '',
    date: review.createTime || review.updateTime || '',
    source: 'google',
    profilePic: null,
    reply: review.reviewReply ? {
      text: review.reviewReply.comment || '',
      date: review.reviewReply.updateTime || ''
    } : null,
    originalId: review.name || '',
    reviewUpdatedAt: review.updateTime || review.createTime || '',
    lastSeenSnapshot: context.snapshotId,
    lastSeenFile: context.sourceFile
  };
}

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

function compareSnapshotIds(left, right) {
  return left.localeCompare(right);
}

function shouldReplaceGoogleReview(currentReview, candidateReview) {
  const snapshotComparison = compareSnapshotIds(currentReview.lastSeenSnapshot, candidateReview.lastSeenSnapshot);
  if (snapshotComparison !== 0) {
    return snapshotComparison < 0;
  }

  const reviewTimeComparison = (currentReview.reviewUpdatedAt || '').localeCompare(candidateReview.reviewUpdatedAt || '');
  if (reviewTimeComparison !== 0) {
    return reviewTimeComparison < 0;
  }

  return (currentReview.lastSeenFile || '').localeCompare(candidateReview.lastSeenFile || '') < 0;
}

function mergeGoogleReviews() {
  const mergedById = new Map();
  const sources = collectGoogleSources();

  for (const source of sources) {
    for (const filePath of source.files) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!Array.isArray(data.reviews)) {
        continue;
      }

      for (const rawReview of data.reviews) {
        const normalizedReview = normalizeGoogleReview(rawReview, {
          snapshotId: source.snapshotId,
          sourceFile: path.relative(__dirname, filePath)
        });

        if (!normalizedReview || !normalizedReview.originalId) {
          continue;
        }

        const existingReview = mergedById.get(normalizedReview.originalId);
        if (!existingReview || shouldReplaceGoogleReview(existingReview, normalizedReview)) {
          mergedById.set(normalizedReview.originalId, normalizedReview);
        }
      }
    }
  }

  const mergedReviews = [...mergedById.values()].sort((a, b) => {
    return (b.date || '').localeCompare(a.date || '');
  });

  const masterOutput = {
    reviews: mergedReviews,
    metadata: {
      totalReviews: mergedReviews.length,
      sourceSnapshots: sources.map(source => source.displayName),
      sourceSnapshotCount: sources.length,
      lastUpdated: new Date().toISOString()
    }
  };

  fs.writeFileSync(googleMasterFile, JSON.stringify(masterOutput, null, 2), 'utf8');
  console.log(`Merged ${mergedReviews.length} Google reviews into ${path.relative(__dirname, googleMasterFile)}`);

  return masterOutput;
}

function loadGoogleMasterReviews() {
  if (!fs.existsSync(googleMasterFile)) {
    return mergeGoogleReviews();
  }

  return JSON.parse(fs.readFileSync(googleMasterFile, 'utf8'));
}

function buildSiteReviews() {
  const googleMaster = loadGoogleMasterReviews();
  let allReviews = [...googleMaster.reviews];

  if (fs.existsSync(facebookReviewsPath)) {
    const facebookData = JSON.parse(fs.readFileSync(facebookReviewsPath, 'utf8'));
    if (Array.isArray(facebookData.reviews)) {
      const filteredFacebookReviews = facebookData.reviews.filter(review =>
        review.rating >= 4 && review.name && review.text
      );
      allReviews = allReviews.concat(filteredFacebookReviews.map(normalizeFacebookReview));
    }
  }

  const uniqueReviews = [];
  const seenReviewIds = new Set();

  for (const review of allReviews) {
    const reviewKey = review.originalId || `${review.source}-${review.name}-${review.date}`;
    if (!seenReviewIds.has(reviewKey)) {
      seenReviewIds.add(reviewKey);
      uniqueReviews.push(review);
    }
  }

  uniqueReviews.sort((a, b) => {
    return (b.date || '').localeCompare(a.date || '');
  });

  const output = {
    reviews: uniqueReviews,
    metadata: {
      totalReviews: uniqueReviews.length,
      sources: {
        google: googleMaster.reviews.length,
        facebook: uniqueReviews.filter(review => review.source === 'facebook').length
      },
      googleSourceFile: path.relative(__dirname, googleMasterFile),
      averageRating: uniqueReviews.length > 0
        ? (uniqueReviews.reduce((sum, review) => sum + review.rating, 0) / uniqueReviews.length).toFixed(1)
        : 0,
      lastUpdated: new Date().toISOString()
    }
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Combined ${uniqueReviews.length} reviews into ${outputFile}`);
  console.log(`Google source file: ${output.metadata.googleSourceFile}`);
  console.log(`Average rating: ${output.metadata.averageRating}/5`);

  return output;
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.googleTakeoutZip) {
    importGoogleTakeoutZip(options.googleTakeoutZip);
  }

  mergeGoogleReviews();
  buildSiteReviews();
}

main();
