# AGENTS.md

## Repo Overview

- This repository is a small static marketing site for Luminous Nails.
- There is no build system, framework, package manifest, or test suite in the repo.
- The site is served directly from root files such as `index.html`, `styles.css`, `script.js`, `reviews.json`, and `images/`.
- `CNAME` indicates GitHub Pages style hosting with a custom domain.

## File Map

- `index.html`: Main single-page site content and structure.
- `styles.css`: All site styling, variables, responsive layout, and dark-mode rules.
- `script.js`: Client-side behavior for mobile nav, booking form helpers, map switching, full-screen image view, and reviews rendering.
- `combine_reviews.js`: Node script that aggregates review exports from `data/` into root `reviews.json`.
- `data/google/` and `data/facebook/`: Source review files. Treat these as input data, not presentation files.
- `DESIGN.md`: Existing visual/design notes for the site.
- `FLYER.md`: Canonical flyer specification, reproduction guide, and maintenance record for the printable A5 flyer and social image.
- `flyer/`: Tracked export folder for the latest approved flyer PDF and social image.
- `README.md`: Review import/update workflow and map URL update instructions.

## Working Style

- Keep changes minimal and targeted. This repo is simple and tightly coupled.
- Prefer editing existing files over introducing new tooling or abstractions.
- Do not add frameworks, bundlers, formatters, or dependencies unless explicitly requested.
- Preserve the existing visual language unless the task is a deliberate redesign.

## Important Couplings

- The booking form service dropdown is populated by parsing the service cards in `#services` from `index.html`.
- If you change service names or structure in `index.html`, verify the `<select id="service">` still populates correctly.
- The location dropdown, map link addresses, and `mapUrls` / `directMapUrls` in `script.js` must stay in sync.
- Reviews shown on the site come from root `reviews.json`, which is generated data.
- `combine_reviews.js` expects Google review files under `data/google/` and optional Facebook data under `data/facebook/reviews.json`.
- The current flyer implementation is documented in `FLYER.md` and must stay in sync with flyer-visible services, prices, contact details, suburb labels, QR targets, and major visual direction.
- The flyer is intended to work as both a printable A5 handout and a social media image.
- The latest approved flyer PDF and PNG should be committed in the `flyer/` subfolder using the canonical filenames documented in `FLYER.md`.

## Common Tasks

### Content or pricing changes

- Usually edit `index.html`.
- If the change affects service names, verify the booking form still lists the updated names.
- If the change is visible on the flyer, update `FLYER.md` in the same task.

### Style or layout changes

- Edit `styles.css`.
- Check both desktop and mobile layouts.
- Check light mode and dark mode because the stylesheet defines both.

### Interactive behavior changes

- Edit `script.js`.
- Be careful with DOM selectors because the JavaScript relies on current class and id names.

### Review updates

- Place new review export files in `data/google/` or the dated subfolders already used in the repo.
- Run `node combine_reviews.js` from the repo root to regenerate `reviews.json`.
- Do not hand-edit `reviews.json` unless the task explicitly calls for a one-off data correction.

### Flyer updates

- Read `FLYER.md` before creating, editing, or regenerating the flyer.
- Any change to flyer-visible services, prices, phone, suburb labels, website, Instagram, QR targets, or major visual direction must update both the canonical flyer source and `FLYER.md` in the same task.
- While creating or refining the flyer, record design decisions incrementally in `FLYER.md` instead of reconstructing them afterward.
- When the flyer is exported, replace the tracked latest PDF and PNG in `flyer/` and commit them in the same task.

## Verification

- For static site changes, use a simple local server such as `python3 -m http.server 8000` from repo root and verify in a browser.
- At minimum, manually verify header/nav on mobile width, service list rendering, booking form dropdown behavior, both map locations, and review loading if review logic or `reviews.json` changed.

## Git Notes

- Check `git status --short` before editing. This repo may already contain user changes.
- Do not overwrite unrelated local modifications.
- If creating or working on a branch whose name includes a ticket number, prefix the thread title with that ticket number, for example `#1234: Foo bar`.

## Agent Guidance

- Read `README.md`, `DESIGN.md`, and `FLYER.md` before making broader structural changes or any flyer-related changes.
- Prefer repo-specific instructions over generic web-project habits.
- If a request would require adding tooling, large refactors, or changing the content workflow, call that out before proceeding.
