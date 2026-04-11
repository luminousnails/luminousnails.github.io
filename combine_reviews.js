// combine_reviews.js
// Imports Google Takeout zips into dated snapshots, merges all Google snapshots
// into a persistent master file, then rebuilds the site reviews.json.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const readline = require('readline/promises');

const outputFile = path.join(__dirname, 'reviews.json');
const googleBaseDir = path.join(__dirname, 'data', 'google');
const googleMasterFile = path.join(googleBaseDir, 'master-reviews.json');
const hodaTypoFixesFile = path.join(googleBaseDir, 'hoda-typo-fixes.json');
const facebookReviewsPath = path.join(__dirname, 'data', 'facebook', 'reviews.json');
const SNAPSHOT_DIR_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const LEGACY_SNAPSHOT_ID = '0000-00-00-legacy-root';
const HODA_TARGET = 'hoda';
const HODA_CONTEXT_WORDS = new Set([
  'visit',
  'visiting',
  'visited',
  'see',
  'seeing',
  'saw',
  'recommend',
  'recommended',
  'recommending',
  'with',
  'from'
]);
const HODA_FOLLOWING_WORDS = new Set([
  'is',
  'was',
  'did',
  'does',
  'has'
]);
const HODA_FUZZY_EXCLUSIONS = new Set([
  'hannah',
  'hilda',
  'holly'
]);

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
    googleTakeoutZip: null,
    reviewHodaCandidates: false,
    acceptHodaCandidates: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--google-takeout-zip') {
      options.googleTakeoutZip = argv[index + 1] || null;
      index += 1;
    } else if (arg.startsWith('--google-takeout-zip=')) {
      options.googleTakeoutZip = arg.slice('--google-takeout-zip='.length);
    } else if (arg === '--review-hoda-candidates') {
      options.reviewHodaCandidates = true;
    } else if (arg === '--accept-hoda-candidates') {
      options.acceptHodaCandidates = (argv[index + 1] || '')
        .split(',')
        .map(value => Number.parseInt(value.trim(), 10))
        .filter(Number.isInteger);
      index += 1;
    } else if (arg.startsWith('--accept-hoda-candidates=')) {
      options.acceptHodaCandidates = arg
        .slice('--accept-hoda-candidates='.length)
        .split(',')
        .map(value => Number.parseInt(value.trim(), 10))
        .filter(Number.isInteger);
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node combine_reviews.js [--google-takeout-zip /path/to/takeout.zip] [--review-hoda-candidates] [--accept-hoda-candidates 1,2]');
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

function loadHodaTypoFixes() {
  if (!fs.existsSync(hodaTypoFixesFile)) {
    return { replacements: {} };
  }

  const fixes = JSON.parse(fs.readFileSync(hodaTypoFixesFile, 'utf8'));
  return {
    replacements: fixes.replacements || {}
  };
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeHodaNameTypos(text, typoFixes) {
  let normalizedText = text || '';

  for (const [from, to] of Object.entries(typoFixes.replacements)) {
    const pattern = new RegExp(`\\b${escapeRegex(from)}\\b`, 'g');
    normalizedText = normalizedText.replace(pattern, to);
  }

  return normalizedText;
}

function levenshteinDistance(left, right) {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }

  for (let col = 0; col < cols; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const substitutionCost = left[row - 1] === right[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + substitutionCost
      );
    }
  }

  return matrix[left.length][right.length];
}

function findHodaTypoCandidates(text) {
  const candidates = [];
  const matches = [...(text || '').matchAll(/\b[A-Za-z][A-Za-z'-]*\b/g)];

  for (let index = 0; index < matches.length; index += 1) {
    const word = matches[index][0];
    const lowerWord = word.toLowerCase();

    if (lowerWord === HODA_TARGET || HODA_FUZZY_EXCLUSIONS.has(lowerWord)) {
      continue;
    }

    if (levenshteinDistance(lowerWord, HODA_TARGET) !== 1) {
      continue;
    }

    const previousWord = matches[index - 1]?.[0]?.toLowerCase() || '';
    const nextWord = matches[index + 1]?.[0]?.toLowerCase() || '';
    const isLikelyContext = HODA_CONTEXT_WORDS.has(previousWord) || HODA_FOLLOWING_WORDS.has(nextWord);

    if (!isLikelyContext) {
      continue;
    }

    candidates.push(word);
  }

  return [...new Set(candidates)];
}

function buildHodaCandidateSuggestion(word) {
  if (word.toLowerCase() === 'hodas') {
    return "Hoda's";
  }

  return 'Hoda';
}

function buildHodaCandidateSnippet(text, candidateWord) {
  const index = text.indexOf(candidateWord);
  if (index === -1) {
    return text.slice(0, 80);
  }

  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + candidateWord.length + 30);
  return text.slice(start, end);
}

function normalizeGoogleReview(review, context, typoFixes) {
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
    text: normalizeHodaNameTypos(review.comment || '', typoFixes),
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

function normalizeFacebookReview(review, typoFixes) {
  return {
    name: review.name || 'Anonymous',
    rating: review.rating || 5,
    text: normalizeHodaNameTypos(review.text || '', typoFixes),
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
  const typoFixes = loadHodaTypoFixes();
  const fuzzyCandidates = [];

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
        }, typoFixes);

        if (!normalizedReview || !normalizedReview.originalId) {
          continue;
        }

        const hodaCandidates = findHodaTypoCandidates(normalizedReview.text);
        if (hodaCandidates.length > 0) {
          for (const candidateWord of hodaCandidates) {
            fuzzyCandidates.push({
              candidateWord,
              suggestedReplacement: buildHodaCandidateSuggestion(candidateWord),
              name: normalizedReview.name,
              date: normalizedReview.date,
              originalId: normalizedReview.originalId,
              sourceFile: normalizedReview.lastSeenFile,
              snippet: buildHodaCandidateSnippet(normalizedReview.text, candidateWord)
            });
          }
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
  if (fuzzyCandidates.length > 0) {
    console.log('Potential Hoda-name typo candidates:');
    for (const candidate of fuzzyCandidates) {
      console.log(`- ${candidate.candidateWord} -> ${candidate.suggestedReplacement} | ${candidate.name} | ${candidate.date} | ${candidate.sourceFile}`);
    }
  }

  return { masterOutput, fuzzyCandidates };
}

function loadGoogleMasterReviews() {
  if (!fs.existsSync(googleMasterFile)) {
    return mergeGoogleReviews().masterOutput;
  }

  return JSON.parse(fs.readFileSync(googleMasterFile, 'utf8'));
}

function buildSiteReviews() {
  const googleMaster = loadGoogleMasterReviews();
  const typoFixes = loadHodaTypoFixes();
  let allReviews = [...googleMaster.reviews];

  if (fs.existsSync(facebookReviewsPath)) {
    const facebookData = JSON.parse(fs.readFileSync(facebookReviewsPath, 'utf8'));
    if (Array.isArray(facebookData.reviews)) {
      const filteredFacebookReviews = facebookData.reviews.filter(review =>
        review.rating >= 4 && review.name && review.text
      );
      allReviews = allReviews.concat(filteredFacebookReviews.map(review => normalizeFacebookReview(review, typoFixes)));
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

function buildCandidateMenu(fuzzyCandidates, typoFixes) {
  const groupedCandidates = new Map();

  for (const candidate of fuzzyCandidates) {
    if (typoFixes.replacements[candidate.candidateWord]) {
      continue;
    }

    if (!groupedCandidates.has(candidate.candidateWord)) {
      groupedCandidates.set(candidate.candidateWord, {
        candidateWord: candidate.candidateWord,
        suggestedReplacement: candidate.suggestedReplacement,
        count: 0,
        examples: []
      });
    }

    const group = groupedCandidates.get(candidate.candidateWord);
    group.count += 1;
    if (group.examples.length < 2) {
      group.examples.push(candidate);
    }
  }

  return [...groupedCandidates.values()].sort((a, b) => a.candidateWord.localeCompare(b.candidateWord));
}

async function reviewHodaCandidates(fuzzyCandidates, preselectedIndexes = []) {
  const typoFixes = loadHodaTypoFixes();
  const candidateMenu = buildCandidateMenu(fuzzyCandidates, typoFixes);

  if (candidateMenu.length === 0) {
    console.log('No new Hoda typo candidates to review.');
    return false;
  }

  console.log('Review Hoda typo candidates:');
  candidateMenu.forEach((candidate, index) => {
    console.log(`[${index + 1}] ${candidate.candidateWord} -> ${candidate.suggestedReplacement} (${candidate.count} match${candidate.count === 1 ? '' : 'es'})`);
    for (const example of candidate.examples) {
      console.log(`    ${example.name} | ${example.date} | ${example.snippet}`);
    }
  });

  let selectedIndexes = [...new Set(
    preselectedIndexes
      .filter(Number.isInteger)
      .filter(value => value >= 1 && value <= candidateMenu.length)
  )];

  if (selectedIndexes.length === 0) {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      throw new Error('The --review-hoda-candidates mode requires an interactive terminal, or pass --accept-hoda-candidates.');
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      const answer = await rl.question('Enter candidate numbers to add to hoda-typo-fixes.json (comma-separated), or press Enter to skip: ');
      selectedIndexes = [...new Set(
        answer
          .split(',')
          .map(value => Number.parseInt(value.trim(), 10))
          .filter(Number.isInteger)
          .filter(value => value >= 1 && value <= candidateMenu.length)
      )];
    } finally {
      rl.close();
    }
  }

  if (selectedIndexes.length === 0) {
    console.log('No Hoda typo candidates were added.');
    return false;
  }

  for (const selectedIndex of selectedIndexes) {
    const candidate = candidateMenu[selectedIndex - 1];
    typoFixes.replacements[candidate.candidateWord] = candidate.suggestedReplacement;
  }

  fs.writeFileSync(hodaTypoFixesFile, JSON.stringify(typoFixes, null, 2), 'utf8');
  console.log(`Updated ${path.relative(__dirname, hodaTypoFixesFile)} with ${selectedIndexes.length} replacement${selectedIndexes.length === 1 ? '' : 's'}.`);
  return true;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.googleTakeoutZip) {
    importGoogleTakeoutZip(options.googleTakeoutZip);
  }

  let mergeResult = mergeGoogleReviews();

  if (options.reviewHodaCandidates || options.acceptHodaCandidates.length > 0) {
    const updatedFixes = await reviewHodaCandidates(mergeResult.fuzzyCandidates, options.acceptHodaCandidates);
    if (updatedFixes) {
      mergeResult = mergeGoogleReviews();
    }
  }

  buildSiteReviews();
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
