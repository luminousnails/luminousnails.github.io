
# Luminous Nails Website

## Combining Google TakeOut Reviews

To combine all Google TakeOut review files into a single, sorted `reviews.json` file:

1. Place all downloaded Google review files in the `data/google/` directory (they should be named like `reviews-*.json`).
2. (Optional) If you add reviews from other sources (e.g., Facebook), place them in a similar subdirectory under `data/`.
3. Make sure you have Node.js installed.
4. Open a terminal in this project directory.
5. Run:

   ```sh
   node combine_reviews.js
   ```

This will generate or update the `reviews.json` file with all reviews, sorted by `createTime` (newest first).

You can repeat these steps any time you download new reviews from Google TakeOut or add new sources.
