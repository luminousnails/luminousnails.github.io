
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

### Step 2: Download Your Data

1. Google will email you when your export is ready (usually within a few hours)
2. Download the `.zip` file from the link in the email

## Combining Google TakeOut Reviews

To import a Google TakeOut zip and generate an updated, sorted `reviews.json` file:

1. **Install Node.js**: Make sure you have Node.js installed on your computer.
2. **Open terminal**: Open a terminal in this project directory.
3. **Run the import + combine script**:

   ```sh
   node combine_reviews.js --google-takeout-zip /path/to/takeout.zip
   ```

This will:

1. Inspect the zip directly with `unzip`
2. Extract only the Google review JSON files we need
3. Save them into a dated snapshot folder under `data/google/` such as `data/google/2026-04-10/`
4. Prefer the primary Google Business Profile account if Google includes duplicate account copies of the same location
5. Merge all local Google snapshots into `data/google/master-reviews.json` using each review's stable Google review ID
6. Generate or update the root `reviews.json`, sorted by `createTime` (newest first)

The script keeps older Google snapshots in place. If a review appears in multiple snapshots, the newest snapshot version for that same Google review ID wins. If a review disappears from a newer Takeout, the older locally stored version is still kept in the merged Google master file.

If you already imported the latest zip and just want to rebuild `reviews.json`, you can still run:

```sh
node combine_reviews.js
```

That rebuilds `data/google/master-reviews.json` from all local Google snapshots and then regenerates the root `reviews.json`.

### Updating Reviews

You can repeat these steps any time you want to update your reviews:

1. Download a fresh export from Google TakeOut
2. Run `node combine_reviews.js --google-takeout-zip /path/to/new-takeout.zip`

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
