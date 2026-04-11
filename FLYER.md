# Luminous Nails Flyer Specification

## Purpose And Scope

This document is the canonical local specification for the Luminous Nails printable flyer.

- Format: single-sided A5 portrait flyer
- Purpose: salon price list first, usable both as a printable handout and as a social media image
- Primary outputs:
  - self-contained SVG source in `flyer/`
  - print PDF export
  - high-resolution portrait image for social posting
- Maintenance rule: any task that changes flyer-visible services, prices, contact details, QR targets, or major visual direction must update this document in the same task
- Working rule: while creating or refining the flyer, record decisions here as they are made instead of reconstructing them afterward
- Asset storage rule: the latest approved exported PDF and image must be saved in the tracked `flyer/` subfolder using the canonical filenames defined below

This document is intended to support two workflows:

1. Rebuild the flyer from the canonical local SVG source.
2. Audit whether the existing flyer still matches the website and current business information.

## Source Of Truth Mapping

### Website Content Sources

- `index.html`
  - Service categories, service names, and prices
  - Phone number
  - Email address
  - Physical addresses
  - Instagram URL
  - Canonical flyer price-list content source; do not duplicate the live service list elsewhere in this repo unless a task explicitly requires a snapshot
- `CNAME`
  - Canonical public website domain: `www.luminous-nails.com.au`

### Brand Direction Sources

- `styles.css`
  - Primary color: `#000000`
  - Secondary/background color: `#ffffff`
  - Accent color: `#b8860b`
  - Heading font direction: `Alata`
  - Script/accent font direction: `Allura`
- `DESIGN.md`
  - Overall style: clean, elegant, high-contrast black/white with gold accents
  - Layout mood: premium, spacious, readable, editorial rather than loud promotional

### Flyer-Specific Decisions

These are approved flyer decisions that are not directly stored elsewhere in the repo:

- The flyer is single-sided A5 portrait.
- The flyer should be mostly typography-led, similar in information density to the user-provided example.
- The logo is the primary image element. Do not add a large hero photo unless the flyer is intentionally redesigned later.
- The flyer should use a white or soft ivory base with black typography, restrained dark-gold rules/dividers, and subtle blush accents drawn from the logo.
- The footer/action area uses two QR codes:
  - Left QR: Instagram
  - Right QR: website homepage
- The footer includes:
  - `By Appointment`
  - phone number
  - both suburb labels
- The flyer does not show trading hours because no verified trading-hours block exists in the repo.
- The website QR should target the homepage, not an inferred booking URL, unless a dedicated flyer booking URL is later provided and approved.
- The flyer should remain clean and legible when reused as a portrait image on social media.
- The current approved implementation is the local SVG in `flyer/`, not the older Canva draft.

## Final Flyer Brief

### Design Intent

Create an elegant price-list flyer that feels premium and professional, not generic or template-heavy. Use the sample image only for information structure inspiration, not as a style clone.

The price list is the main content. Branding, QR codes, and contact details should support the pricing information rather than compete with it. The finished design must still read clearly when exported as an image for social media.

### Layout

- Page size: A5 portrait
- Page count: 1
- Composition:
  - Top header band with logo, business name, and short descriptor
  - Middle body with service categories and prices in a compact but readable two-column grid
  - Bottom action band with two QR codes and centered contact details
- Reading order:
  1. Logo and business name
  2. Service categories and prices
  3. Call-to-action and QR options
  4. Contact details and locations

### Visual Direction

- Background: white or soft ivory
- Primary text: black or near-black
- Accent: dark gold `#b8860b`
- Optional secondary accent: soft blush inspired by the existing logo artwork
- Decorative elements: minimal linework, separators, or understated ornament only
- Avoid:
  - loud gradients
  - dense backgrounds behind pricing
  - oversized script headings
  - stock-photo-heavy layouts

### Typography Direction

- The live website typography direction still comes from `Alata` and `Allura`, but the current flyer implementation uses `Allura`-style rendered heading assets for the business name, section headings, and `By appointment` line.
- Body copy and prices remain sans-serif for readability.
- Body copy and price rows must prioritize print readability over stylistic flourishes.
- Price alignment should be visually clean and easy to scan.

### Header Content

- Preferred image treatment: use the highest-resolution approved Luminous Nails logo asset available in the repo as the primary header treatment.
- Current source asset: `flyer/logo-full.png`
- Do not repeat `Luminous Nails` as separate title text when the logo already contains the business name.
- Do not add a separate `PRICE LIST` label; the flyer is already functioning as a price list and the extra heading is redundant.
- Descriptor line: `Professional Nail Care • Sunshine Coast & Brisbane`

### Footer / Action Area

- Left QR target: Instagram profile
- Right QR target: website homepage
- Keep QR captions minimal. Do not add redundant `Scan to follow` or `Scan to browse` text under the QR codes.
- Center block content:
  - `By Appointment`
  - `0439 929 210`
  - `Palmview`
  - `Strathpine`

### Print Intent

- Output must be suitable for print as a single-page PDF.
- The design must remain legible at actual A5 physical size.
- The design must also remain readable as a portrait social media image.
- All service names and prices must fit without truncation or overflow.

## Exact Flyer Content

### Business Identity

- Business name: `Luminous Nails`
- Descriptor: `Professional Nail Care | Sunshine Coast & Brisbane`

### Services And Prices

- Canonical source: [index.html](/Users/david/.codex/worktrees/e9b0/luminousnails.github.io/index.html)
- The flyer must use the current service categories, service names, ordering, and prices from the `#services` section in `index.html`.
- Do not maintain a second hardcoded price list in `FLYER.md`; this document should define how to use the canonical source, not drift from it.
- Prefer the existing structural selectors in `index.html`:
  - services section: `#services`
  - category wrapper: `.service-category`
  - category title: `.service-category-title`
  - service row: `.service-item`
  - service name: `.service-name`
  - service price: `.service-price`
- Avoid duplicating content in parallel metadata. Only introduce a `data-*` attribute if a future markup change makes the class-based structure ambiguous or unstable.
- When rebuilding or updating the flyer:
  - extract the live service/category content from `index.html`
  - preserve the website ordering unless the flyer is intentionally redesigned
  - verify that every rendered flyer item maps directly to a current `index.html` entry
- Preferred extraction procedure:
  1. Select the services section via `#services`.
  2. Iterate categories using `.service-category` in DOM order.
  3. For each category, read the title from `.service-category-title`.
  4. Within each category, iterate `.service-item` in DOM order.
  5. For each item, read:
     - name from `.service-name`
     - price from `.service-price`
  6. Trim whitespace, but do not normalize wording, punctuation, diacritics, or price formatting unless the website content itself has been changed.
- Fallback rules if the HTML structure drifts:
  - First preference is to preserve or restore a clear class-based structure around categories, names, and prices.
  - If future layout changes make the class selectors ambiguous, add narrowly scoped `data-*` attributes only to the missing or unstable nodes rather than duplicating metadata across the whole section.
  - Never infer flyer pricing from the booking form `<select>`, screenshots, or prior versions of `FLYER.md`.
  - If the service markup is being reworked, keep the flyer extraction path explicit in the same task, whether that is via classes or a minimal `data-*` fallback.
- If a future task requires a historical pricing snapshot, record it in the change log with a date instead of replacing the canonical-source rule above.

### Contact And QR Targets

- Phone display: `0439 929 210`
- Email on website only, not required on flyer: `info@luminous-nails.com.au`
- Appointment note: `By Appointment`
- Instagram display label: `@luminous.nails`
- Instagram URL / QR target: `https://www.instagram.com/luminous.nails/`
- Website display label: `luminous-nails.com.au`
- Website URL / QR target: `https://www.luminous-nails.com.au/`

### Exported Repo Assets

- Export folder: [flyer/README.md](/Users/david/.codex/worktrees/e9b0/luminousnails.github.io/flyer/README.md)
- Canonical source file:
  - `flyer/luminous-nails-pricelist.svg`
- Canonical tracked export filenames:
  - `flyer/luminous-nails-pricelist.pdf`
  - `flyer/luminous-nails-pricelist.png`
- These filenames should always contain the latest approved flyer exports committed to git.
- The SVG should remain self-contained for visible artwork such as the logo, QR codes, and rendered heading treatments so Safari and export tools render the same content.

### Locations

- Flyer display format: suburb only
- `Palmview`
- `Strathpine`
- The website remains the source of truth for the full physical addresses, but the flyer intentionally abbreviates them to suburb labels.

## Reproduction Workflow

### Preparation

1. Review `index.html`, `styles.css`, `DESIGN.md`, and this document.
2. Confirm the current service list, prices, phone number, addresses, Instagram URL, and website domain.
3. Confirm the class structure around the service section still clearly exposes categories, item names, and prices for extraction.
4. If any flyer-visible content differs from the website, update this document before or during flyer work.

### Local SVG Workflow

1. Use [flyer/luminous-nails-pricelist.svg](/Users/david/.codex/worktrees/e9b0/luminousnails.github.io/flyer/luminous-nails-pricelist.svg) as the canonical current flyer source.
2. Keep the SVG self-contained for visible artwork that must render consistently across Safari, PNG, and PDF exports.
3. If a heading needs the exact website font treatment and the renderer cannot load the font directly, regenerate the small helper PNGs in `flyer/` from the bundled font files in `flyer/fonts/` and then re-embed them into the SVG.
4. Render updated exports from the SVG using `rsvg-convert`:
   - PNG: `rsvg-convert -w 1748 -h 2480 flyer/luminous-nails-pricelist.svg -o flyer/luminous-nails-pricelist.png`
   - PDF: `rsvg-convert -f pdf -w 1748 -h 2480 flyer/luminous-nails-pricelist.svg -o flyer/luminous-nails-pricelist.pdf`
5. Verify the rendered PNG visually before considering the update complete, because that catches layout drift faster than inspecting raw SVG alone.

### Canva Generation

Use Canva only if the flyer is being intentionally rebuilt there or a later task makes Canva the approved canonical source again.

1. Use the Canva plugin `generate-design` tool with `design_type` set to `flyer`.
2. Use a prompt that explicitly requests:
   - A5 portrait printable salon price list
   - price list as the dominant content block
   - elegant editorial composition
   - white or ivory background
   - black typography
   - restrained dark-gold accents
   - subtle blush decorative elements inspired by the logo
   - logo-led branding rather than photo-led branding
   - two QR spaces at the bottom
   - suburb-only location labels: Palmview and Strathpine
   - suitable for both print PDF export and social media image export
   - service categories, names, order, and prices taken from the current `#services` section in `index.html`
3. Select the strongest concept that matches this document’s structure rather than the most decorative concept.

### Review Criteria For Candidate Selection

Prefer candidates that:

- feel premium and calm
- keep the price list readable
- make the pricing the dominant focus
- leave enough space for the full service inventory
- support two bottom QR blocks without crowding
- look credible as both a printed salon handout and a social media image

Reject candidates that:

- use oversized imagery
- reduce the service list to marketing headlines
- hide prices in tiny type
- introduce off-brand colors or loud patterns

### Refinement

After generation, refine the selected flyer so it exactly matches this document:

- use the current service names and prices from `index.html` verbatim
- keep the logo prominent at the top
- keep the flyer single-page A5 portrait
- ensure the footer includes both QR destinations and the center contact block
- ensure locations are shown as `Palmview` and `Strathpine`, not full street addresses
- remove any auto-generated filler copy that is not part of the approved flyer content

### Export

1. Export the final design as a print PDF.
2. Export the final design as a high-resolution image suitable for portrait social posting.
3. Save the exports into the repo using these exact filenames:
   - `flyer/luminous-nails-pricelist.pdf`
   - `flyer/luminous-nails-pricelist.png`
4. Replace the prior canonical files rather than inventing versioned names unless a task explicitly asks to archive snapshots.
5. Confirm that all text remains sharp and all elements remain within the printable page bounds.
6. Confirm the social image remains readable without excessive zooming.
7. Add the exported files to git in the same task.
8. Record any material design change back into this document and append a change-log entry.

### Current Implementation

- Current canonical source file:
  - [luminous-nails-pricelist.svg](/Users/david/.codex/worktrees/e9b0/luminousnails.github.io/flyer/luminous-nails-pricelist.svg)
- Current canonical exports:
  - [luminous-nails-pricelist.png](/Users/david/.codex/worktrees/e9b0/luminousnails.github.io/flyer/luminous-nails-pricelist.png)
  - [luminous-nails-pricelist.pdf](/Users/david/.codex/worktrees/e9b0/luminousnails.github.io/flyer/luminous-nails-pricelist.pdf)
- Current implementation note:
  - The repo exports are currently rendered from the local SVG source in `flyer/`.
  - The SVG embeds the logo, QR codes, and rendered heading artwork directly so Safari, PNG export, and PDF export stay aligned.
  - The current header is logo-led only, with the descriptor beneath it and no duplicated `Luminous Nails` or `PRICE LIST` text.
- The current logo embed uses the higher-resolution `flyer/logo-full.png` asset rather than the smaller `logo-light` source.
- The QR cards show only the platform label and handle/domain, without redundant scan captions.
- The current layout uses an even outer padding system around the service cards and footer panel, with reduced center gap between the two service columns.
- The current layout removes the divider rule between the descriptor line and the service cards.
- The current service rows keep prices as text-only elements with a consistent right-aligned gutter, rather than boxed or filled treatments.
- Prices use a restrained dark-gold emphasis through color and slightly stronger weight only.
- The service cards use a tightened internal vertical rhythm so the category headings sit higher in the cards and the lower rows clear the borders more evenly.
- The top gold rules above the first `Acrylic` and `Manicure` headings have been removed.
- The current vertical layout uses one shared spacing step for the inner frame top padding, logo-to-descriptor gap, descriptor-to-service gap, service-to-footer gap, and bottom padding.
- The current footer removes the top gold rule, enlarges both QR cards within the footer panel, and vertically centers the `By Appointment` contact stack against them.
- The current QR cards use a centered title band so `INSTAGRAM` and `WEBSITE` have even whitespace above and below their headings.
- The current footer uses matched QR-card insets, so the cards sit on the same horizontal padding value as their vertical padding inside the footer panel.
- The current QR artwork inside each card uses an equal internal inset, so the left and right QR padding matches the top and bottom padding visually.
  - The older Canva draft is historical reference only and is not the current canonical flyer source.

## Maintenance Workflow

### When This Document Must Be Updated

Update `FLYER.md` in the same task whenever any of the following changes:

- service categories
- service names
- service prices
- phone number
- email, if it becomes flyer-visible
- flyer location labels
- underlying physical addresses, if those changes should alter the suburb labels used on the flyer
- Instagram handle or URL
- website URL or preferred QR destination
- flyer format, orientation, or page count
- logo usage
- major color or typography direction
- footer structure or call-to-action content
- the service-section class structure or any narrowly scoped extraction hooks used to derive flyer pricing content
- the canonical exported PDF or image files in `flyer/`

### Update Order

When a flyer-related change happens, use this order:

1. Update the website content if the source data changed.
2. Preserve or update the class-based extraction structure in `index.html` if the service markup changed. Add a minimal `data-*` hook only if a core extraction node cannot be expressed cleanly with classes.
3. Update this document so the flyer spec stays current.
4. Update the canonical flyer source to match. At present this is `flyer/luminous-nails-pricelist.svg`; only update Canva as well if Canva is intentionally being kept in sync.
5. Replace the tracked latest export files in `flyer/`.
6. Record the revision in the change log below.

### Incremental Documentation Rule

Do not wait until the end of a multi-step flyer task to document decisions. Update this file after meaningful design choices, including:

- format/orientation decisions
- QR destination changes
- footer content changes
- visual direction changes
- wording changes
- final export decisions

## Verification Checklist

Before considering the flyer task complete, verify all of the following:

- Every service category matches the website.
- Every service name matches the website.
- Every price matches the website.
- The flyer service order matches the `#services` section in `index.html`, unless a documented redesign explicitly changes the ordering.
- The class structure still accurately exposes the intended service categories, names, and prices for extraction.
- The phone number matches the website.
- The flyer location labels are intentionally suburb-only and still correspond to the website locations.
- The Instagram target is correct.
- The website QR target is correct.
- The flyer remains single-page A5 portrait.
- No text is cut off, wrapped awkwardly, or unreadably small.
- The design still looks on-brand relative to `styles.css` and `DESIGN.md`.
- The exported social image is readable with the price list as the dominant content.
- The latest approved PDF and PNG exist in `flyer/` using the canonical filenames.
- This document reflects the actual current flyer, not only the original intent.

## Change Log

### 2026-04-11

- Created the initial flyer specification.
- Approved flyer format as single-sided A5 portrait.
- Set flyer direction to logo-led, typography-first, with black, white, dark-gold, and subtle blush accents.
- Set bottom action area to use Instagram QR on the left and website homepage QR on the right.
- Set footer copy to `By Appointment`, phone number, and both locations.
- Chose not to include trading hours because no verified hours block exists in the repo.
- Recorded that the website QR should target `https://www.luminous-nails.com.au/` unless a dedicated flyer booking URL is later approved.
- Refined the brief so the flyer must also work as a social media image.
- Changed flyer location display from full street addresses to suburb-only labels: `Palmview` and `Strathpine`.
- Clarified that the price list is the primary focus of the design.
- Removed the duplicated service-price snapshot from this document and made `index.html` the explicit canonical source for flyer pricing content.
- Added a documented extraction contract for the services markup so future flyer regeneration has a stable canonical source.
- Refined the extraction rule to prefer existing class names and only add narrowly scoped `data-*` attributes if a future markup change makes a core data node ambiguous.
- Added a tracked export convention so the latest approved PDF and PNG should live in the `flyer/` subfolder with stable filenames.
- Removed the `-latest` suffix from the canonical export filenames because the repo is using fixed current-artifact names rather than an archive-by-default workflow.
- Generated a Canva flyer draft using the approved brief, inserted real Instagram and website QR codes, and saved local PNG/PDF artifacts under `flyer/`.
- Recorded the current Canva design ID and links in this document.
- Rebuilt the repo PNG/PDF exports from a controlled local SVG source to replace the weak intermediate Canva preview layout.
- Refined the flyer to remove the double-arc flourishes, tighten the footer spacing, keep the QR cards fully inside the footer panel, and restore the real logo.
- Switched the main title and footer accent to website-derived heading treatments and embedded the visible SVG artwork directly so the SVG, PNG, and PDF render consistently.
- Removed the stray rule behind the logo, switched the service headings to the same cursive treatment family, and rebalanced horizontal and vertical spacing so the service cards and footer use more even padding.
- Simplified the header to the logo alone, removed the redundant `PRICE LIST` and duplicated business-name text, and improved the vertical spacing in the center footer stack.
- Switched the flyer to the higher-resolution logo asset and removed redundant QR scan captions while keeping the footer spacing balanced.
- Rebalanced the vertical layout by adding proper top padding above the logo, lowering the footer panel, and opening up the center contact stack so the head and foot spacing feel more even.
- Removed the divider rule beneath the descriptor line, replaced the descriptor bar separator with a dot separator, and normalized the header, service area, and footer to a single repeated vertical spacing value inside the page frame.
- Rebalanced the QR-card title bands so the `INSTAGRAM` and `WEBSITE` headings have even whitespace above and below.
- Replaced the boxed price treatment with a subtler text-only dark-gold emphasis, kept a clearer gutter between names and prices, tightened the left-card vertical rhythm so it no longer clips the border, and removed the top gold rules above `Acrylic` and `Manicure`.
- Rebalanced both service cards upward internally so the top whitespace above the headings is reduced and the bottom rows have more even clearance.
- Removed the footer gold rule above `By Appointment`, scaled the QR cards up inside the footer, and re-centered the middle contact stack to match the QR blocks vertically.
- Matched the QR-card horizontal inset to the footer’s vertical inset so the footer cards now use the same side and top padding value.
- Reduced the QR artwork size slightly so each QR card now has a more even internal padding on all sides.
