# Luminous Nails Web Design Overview

This document summarizes the design and styling approach used for the **Luminous Nails** website as observed in the project files. The goal is to capture the overall look and feel so that a similar design can be reproduced or extended.

## 1. Color Scheme

The site relies heavily on CSS custom properties defined in `styles.css`:

- **Primary Color:** `#000000` (black)
- **Secondary Color:** `#ffffff` (white)
- **Accent Color:** `#b8860b` (dark gold)
- **Text Color:** `#000000` (black) on light mode
- **Background Color:** `#ffffff` (white) on light mode
- **Footer Background:** `#000000`
- **Footer Text:** `#ffffff`
- Special colors for form validation such as `--required-color: #dd5555` and `--valid-color: #b8860b`.
- **Review Date Color:** `--review-date-color` defines the grey used for timestamps.
- **Disabled Option Background:** `--option-disabled-bg` gives disabled dropdown options a subtle background.

A dark color scheme is provided using the `prefers-color-scheme: dark` media query. In this mode the text becomes white on a dark background (`#1a1a1a`), while keeping the same accent color.

## 2. Typography

Two font families are imported from Google Fonts:

- **Alata** for headings (`--heading-font`).
- **Allura** for hero headings and decorative text (`--hero-font`).

Body text falls back to Arial and a sans-serif stack. Headings are configured to change color on hover using the accent color.

## 3. Layout and Structure

The HTML structure is organized with semantic sections:

1. **Header** – Contains the logo and a navigation menu. On smaller screens a hamburger toggle reveals the mobile menu.
2. **Hero Section** – A large banner image with a short tagline and a call-to-action button.
3. **About Section** – Includes a short bio and an image that can be enlarged to full screen when clicked.
4. **Services Section** – Uses a responsive CSS grid to display service categories and pricing.
5. **Reviews Section** – Displays client feedback loaded from `reviews.json` in a responsive grid. Long reviews can be expanded and users can load more entries with a **Read more…** button.
6. **Contact Section** – Provides contact details, a map and a booking form.
7. **Footer** – Displays copyright information and social media icons.

The `.container` class centers content with a maximum width of 900 px. Most sections use generous padding around 50 px vertically. Box shadows are used throughout (`--box-shadow-light`, `--box-shadow-medium`, `--box-shadow-heavy`) to add depth to cards and form fields.

## 4. Responsiveness

- The navigation switches to a mobile menu below 768 px width. A button with three lines turns into an “X” when active.
- Service categories and reviews are displayed in a grid that adapts to available width (`grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`).
- Form elements resize for small screens to maintain usability.
- The reviews section initially shows six items on mobile, with an optional button to load more.

## 5. Imagery and Media

- The logo and degree certificate are provided in WebP format with high‑resolution variants for retina displays (`@2x` images). CSS uses the `content` property to swap these images on high‑density screens.
- A large hero image is included with a welcoming tagline. Images open in a full screen overlay when clicked (for example, the degree certificate thumbnail).
- Multiple favicon sizes (`favicon.ico`, `favicon@32x32.png`, etc.) ensure crisp icons across devices.

## 6. Interactive Elements

JavaScript (`script.js`) provides the following behaviors:

- Mobile navigation toggle and closing when clicking outside the menu.
- Dynamic population of the service dropdown in the booking form.
- Form field highlighting when required fields are filled.
- Validation of the preferred date field to ensure future bookings.
- Full‑screen image viewer for the degree certificate.
- Interactive map: clicking an address link or changing the location dropdown updates the embedded Google Map and can open Google Maps in a new tab on a second click.
- Reviews are fetched from `reviews.json`, generated via `combine_reviews.js`. The list supports expanding long comments and loading more results dynamically.

## 7. Accessibility Notes

- Navigation toggle uses `aria-expanded` to communicate state.
- Images and iframes include descriptive `alt` and `title` attributes.
- The form labels are properly associated with inputs, and required fields use standard HTML validation.

## 8. Overall Style

The design focuses on a clean, elegant appearance with high contrast between black and white, accented by gold highlights. Subtle animations (`--animation-speed: 0.15s`) are used for hover effects and menu transitions. Rounded corners and shadows soften the interface, while large headings and ample white space give the content room to breathe.

---

This overview is intended as a quick reference for reproducing the site style or for onboarding future contributors who need to understand the existing visual direction.
