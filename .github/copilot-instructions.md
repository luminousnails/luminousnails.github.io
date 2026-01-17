# GitHub Copilot Instructions for Luminous Nails Website

## Repository Overview

This is a static website for Luminous Nails, a nail salon business. The site is hosted on GitHub Pages and features:
- Service information and pricing
- Customer reviews from Google Business Profile and Facebook
- Interactive booking form
- Location information with embedded Google Maps
- Responsive design with dark mode support

## Project Structure

### Key Files
- `index.html` - Main website page with all sections (hero, about, services, reviews, contact)
- `script.js` - Client-side JavaScript for interactive features (mobile menu, form validation, reviews display, map integration)
- `styles.css` - All styling using CSS custom properties for theming
- `combine_reviews.js` - Node.js script to merge review files from multiple sources
- `reviews.json` - Generated file containing all processed reviews
- `data/google/` - Directory containing Google TakeOut review files (format: `reviews-*.json`)
- `data/facebook/` - Directory for Facebook reviews (optional)
- `images/` - Logo, hero image, and other visual assets (WebP format with @2x variants for retina displays)

### Documentation
- `README.md` - Instructions for updating reviews from Google TakeOut and managing map URLs
- `DESIGN.md` - Complete design system documentation including colors, typography, and layout

## Coding Conventions

### HTML
- Use semantic HTML5 elements (`<header>`, `<section>`, `<footer>`, etc.)
- Include proper ARIA attributes for accessibility (e.g., `aria-expanded` for mobile menu toggle)
- Ensure all images have descriptive `alt` attributes
- Use proper form labels associated with inputs

### CSS
- Use CSS custom properties (CSS variables) defined in `:root` for all colors and theme values
- Follow the existing naming convention: `--primary-color`, `--accent-color`, etc.
- Support both light and dark modes using `prefers-color-scheme` media query
- Use responsive design with mobile-first approach
- Media query breakpoint: `768px` for mobile/desktop transition
- Use CSS Grid for service categories and reviews: `repeat(auto-fit, minmax(300px, 1fr))`
- Include retina display support using `@media (-webkit-min-device-pixel-ratio: 2)`

### JavaScript
- Use vanilla JavaScript (no frameworks)
- Follow modern ES6+ syntax
- Use `document.addEventListener("DOMContentLoaded", ...)` to ensure DOM is ready
- Include proper error handling with `console.error()` for missing elements
- Use event delegation where appropriate
- Validate dates to ensure future bookings only
- Highlight required form fields when filled using `--valid-color`

### Node.js Scripts
- `combine_reviews.js` processes review files:
  - Reads from `data/google/` and `data/facebook/` directories
  - Filters only 4-5 star reviews
  - Normalizes different review formats to unified schema
  - Removes duplicates based on name + date
  - Sorts by date (newest first)
  - Outputs to `reviews.json` with metadata
- Run with: `node combine_reviews.js`

## Design System

### Colors
- **Primary:** `#000000` (black)
- **Secondary:** `#ffffff` (white)
- **Accent:** `#b8860b` (dark gold) - used for highlights, hover states, and CTAs
- **Required field:** `#dd5555` (red)
- **Valid field:** `#b8860b` (gold)
- Dark mode: Background `#1a1a1a`, text white

### Typography
- **Headings:** Alata (Google Font)
- **Hero/Decorative:** Allura (Google Font)
- **Body:** Arial, sans-serif

### Spacing & Layout
- Maximum content width: `900px` (`.container` class)
- Section padding: `50px` vertical
- Use box shadows for depth: `--box-shadow-light`, `--box-shadow-medium`, `--box-shadow-heavy`
- Animation speed: `0.15s` for transitions

## Review Management

### Data Format
Reviews must have this structure:
```json
{
  "name": "Customer Name",
  "rating": 5,
  "text": "Review text",
  "date": "ISO 8601 timestamp",
  "source": "google" | "facebook",
  "profilePic": null,
  "reply": {
    "text": "Reply text",
    "date": "ISO 8601 timestamp"
  },
  "originalId": "unique-id"
}
```

### Google Review Processing
- Google TakeOut files use star ratings as enum values: `ONE`, `TWO`, `THREE`, `FOUR`, `FIVE` (mapped to numeric 1-5)
- Only 4-5 star reviews are included
- Reviews come from `data.reviews` array in each file

### Updating Reviews
1. Download Google TakeOut export
2. Place review files in `data/google/`
3. Run `node combine_reviews.js`
4. Commit updated `reviews.json`

## Interactive Features

### Mobile Navigation
- Hamburger menu toggle at `768px` breakpoint
- Menu uses `active` class for visibility
- Prevents body scroll when menu is open
- Closes on outside click or nav link click

### Form Validation
- Validate preferred date is in the future
- Highlight required fields with gold border when filled
- Dynamically populate service dropdown from services section
- No backend - form uses `mailto:` action

### Reviews Display
- Initially show 6 reviews (REVIEWS_PER_PAGE constant in script.js)
- "Load more reviews" button to display additional batches of 6
- Long reviews can be expanded/collapsed with "Read more..."/"Read less..." links
- Display source badge (Google/Facebook)

### Interactive Map
- Clicking address updates embedded map
- Second click opens Google Maps in new tab
- Location dropdown changes both map and contact details

## Important Notes

### DO NOT
- Remove or modify existing functionality without explicit request
- Change the color scheme without updating CSS custom properties
- Add dependencies or frameworks - this is a vanilla HTML/CSS/JS site
- Modify the review data format - it must match the schema

### DO
- Maintain accessibility features (ARIA attributes, alt text, semantic HTML)
- Support both light and dark modes when adding new features
- Test responsive design at 768px breakpoint
- Use existing CSS custom properties for styling
- Follow the established naming conventions
- Keep code vanilla (no dependencies)

## Testing

### Manual Testing Checklist
- Test mobile menu toggle and navigation
- Verify form validation (date in future, required fields)
- Test review expansion and "Load more" functionality
- Verify map switching between locations
- Check responsive design at various viewport sizes
- Test both light and dark mode
- Verify retina image loading on high-DPI displays

### Cross-Browser
- Test in modern browsers (Chrome, Firefox, Safari, Edge)
- Ensure CSS Grid support (all modern browsers)

## Deployment

This is a GitHub Pages site:
- Deployed from the `main` branch
- Changes pushed to `main` are automatically deployed
- Custom domain: configured via `CNAME` file
- No build process required - static files served directly

## File Organization

### Images
- Use WebP format for better compression
- Provide @2x variants for retina displays
- Name pattern: `image-name.webp` and `image-name@2x.webp`
- Use CSS custom properties with media queries for retina image swapping:
  - Define image paths as CSS variables (e.g., `--logo-image`, `--logo-image-2x`)
  - Use `content` property on pseudo-elements with the CSS variable
  - Swap via `@media (-webkit-min-device-pixel-ratio: 2)` or `(min-resolution: 192dpi)`

### Data Files
- Keep source review files in `data/google/` and `data/facebook/`
- Never edit `reviews.json` manually - always regenerate with `combine_reviews.js`
- Review files follow pattern: `reviews-*.json`

## Common Tasks

### Adding a New Service
1. Add entry to services section in `index.html`
2. Services automatically populate booking form dropdown
3. Maintain grid layout structure

### Updating Contact Information
1. Edit contact section in `index.html`
2. Update map URLs in `script.js` `mapUrls` object
3. Follow README instructions for getting Google Maps embed URLs

### Styling Changes
1. Update CSS custom properties in `:root` for theme changes
2. Ensure changes work in both light and dark modes
3. Maintain responsive design principles
