
# Luminous Nails Website

## Downloading Reviews from Google TakeOut

To get the latest reviews for your Google Business Profile:

### Step 1: Request Your Data from Google TakeOut

1. Go to [Google TakeOut](https://takeout.google.com/)
2. Sign in with your Google Business Profile account
3. Click "Deselect all" to uncheck everything
4. Find and select **"My Business"** (this contains your Google Business Profile data)
5. Click "Next step"
6. Choose your export options:
   - **File type**: `.zip` (recommended)
   - **File size**: `2 GB` (or smaller if you prefer)
   - **Delivery method**: "Send download link via email" (recommended)
7. Click "Create export"

### Step 2: Download and Extract Your Data

1. Google will email you when your export is ready (usually within a few hours)
2. Download the `.zip` file from the link in the email
3. Extract the `.zip` file to a temporary location
4. Navigate to the extracted folder and find: `Takeout/My Business/Your Business Name/`

### Step 3: Locate Review Files

Inside your business folder, you'll find review files named like:

- `reviews-ABHRLXUgZrOzYgQR3VZKiTe4hHDPDDULTgoejQ.json`
- `reviews-ABHRLXUNxGK6quVlsTH0Z_0zurQHi2ERCKL3GB.json`
- etc.

Each file contains a batch of reviews from Google.

## Combining Google TakeOut Reviews

To combine all Google TakeOut review files into a single, sorted `reviews.json` file:

1. **Copy review files**: Place all downloaded Google review files in the `data/google/` directory (they should be named like `reviews-*.json`).
2. **Add other sources** (Optional): If you add reviews from other sources (e.g., Facebook), place them in a similar subdirectory under `data/`.
3. **Install Node.js**: Make sure you have Node.js installed on your computer.
4. **Open terminal**: Open a terminal in this project directory.
5. **Run the combine script**:

   ```sh
   node combine_reviews.js
   ```

This will generate or update the `reviews.json` file with all reviews, sorted by `createTime` (newest first).

### Updating Reviews

You can repeat these steps any time you want to update your reviews:

1. Download a fresh export from Google TakeOut (following Steps 1-3 above)
2. Replace the files in `data/google/` with the new ones
3. Run `node combine_reviews.js` again

**Tip**: Set a reminder to update your reviews monthly or quarterly to keep your website current with the latest customer feedback!

## Getting an embeddable Google Maps URL for a salon location

Follow these steps to retrieve the `mapUrl` for a specific location (for example, Strathpine) so it matches the embedded format already used for Palmview in `script.js`:

1. Open [Google Maps](https://maps.google.com/) in a browser while signed into the Google account that manages the salon's Business Profiles.
2. In the search bar, enter the exact business name and address for the location (e.g. **"Luminous Nails Strathpine"**) and press **Enter**.
3. In the information panel that appears for the business, click the **Share** button.
4. In the share dialog, choose the **Embed a map** tab.
5. Pick a size ("Medium" works well for our iframe) and copy the HTML `<iframe>` code that Google provides.
6. Extract just the value of the `src` attribute from that snippet. It will look similar to the Palmview entry (`https://www.google.com/maps/embed?...`).
7. Paste that URL into the Strathpine entry inside the `mapUrls` object in `script.js`, keeping the rest of the iframe markup unchanged.

If Google ever regenerates the embed code, simply repeat the steps above to keep the on-site map pointing at the latest Google Business Profile listing for that location.
