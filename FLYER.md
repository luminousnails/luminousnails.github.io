# Luminous Nails Flyer Art Direction

This document describes the current Luminous Nails flyer exactly as it exists in the repo today. It is a visual specification, not a maintenance log.

The flyer is a single-page A5 portrait price list designed to work in two contexts:

- as a printable salon handout
- as a portrait social media image

The current canonical flyer source is `flyer/luminous-nails-pricelist.svg`. The committed rendered outputs are `flyer/luminous-nails-pricelist.pdf`, `flyer/luminous-nails-pricelist.png`, and `flyer/luminous-nails-pricelist.jpg`.

## Format

- Size: A5 portrait
- Orientation: vertical
- Page count: one page
- Primary use: service and pricing communication
- Secondary use: polished brand-supporting promotional image for social posting

The design is intentionally compact, elegant, and editorial rather than promotional or campaign-driven.

## Design Intent

The flyer is built around price-list clarity. The visual language is soft, premium, and restrained. It should feel like a luxury service menu, not a discount flyer or a template-based social graphic.

The hierarchy is:

1. Brand recognition via the logo
2. Immediate understanding that this is professional nail care
3. Fast scanning of services and prices
4. Clear contact and QR actions

Every decorative choice is subordinate to legibility and structure.

## Composition

The page uses a centered card-on-background composition.

- An outer warm ivory page creates softness without reducing contrast.
- Inside that, a lighter framed panel establishes the printable composition area.
- The internal layout is divided into four vertical zones:
  - logo zone
  - descriptor zone
  - services zone
  - footer action zone

These four zones are separated by a deliberately even vertical rhythm. The same spacing logic is used from the top inner padding through to the bottom padding, so the page reads as a disciplined editorial layout rather than a stack of unrelated boxes.

## Layout

### Overall Structure

The flyer uses a single centered column for branding and footer content, with a two-column service grid in the middle.

- Top: centered logo
- Beneath logo: one-line descriptor
- Middle: two equal-width service cards
- Bottom: one full-width footer card containing three aligned zones
  - Instagram QR card on the left
  - appointment/contact stack in the middle
  - website QR card on the right

The service section is the dominant mass on the page. The header is intentionally compact and the footer is supportive rather than oversized.

### Grid Logic

- The two service cards are balanced left and right with a narrow central gutter.
- The footer uses a three-part composition with equal visual weight at the left and right edges and a centered contact stack between them.
- The QR cards sit inside the footer with matched outer insets.
- The QR artwork inside each QR card is inset evenly so left/right padding reads the same as top/bottom padding.

## Branding

The flyer is logo-led.

- The business name is not repeated as separate headline text because it is already contained within the logo.
- The flyer does not include a separate `PRICE LIST` heading because the format already communicates that function.

This keeps the header cleaner and avoids redundant verbal noise.

## Imagery

The flyer uses one primary image element only:

- the high-resolution Luminous Nails logo asset

Current logo source:

- `flyer/logo-full.png`

The logo sits centered near the top and establishes both brand recognition and the soft blush accent palette used elsewhere in the piece.

There is no hero photography, collage, or secondary beauty imagery in the current flyer. That restraint is intentional. It preserves clarity and keeps attention on the services and prices.

## Typography

The flyer typography follows the website’s brand direction while adapting it for print legibility.

### Typeface Roles

- Script display style:
  - used for service category headings
  - used for the `By appointment` line
  - visually aligned with the website’s `Allura` direction
- Sans-serif body style:
  - used for descriptor copy
  - used for service names
  - used for prices
  - used for QR labels
  - used for phone number and suburb line

### Typographic Hierarchy

- The logo is the dominant brand mark.
- Script category headings introduce each service block with softness and personality.
- Service names are set in clean, readable sans-serif copy.
- Prices are right-aligned and slightly emphasized through color and weight, not through boxes or aggressive highlighting.
- The phone number is the strongest footer text element.

### Typographic Tone

The tone is feminine and polished without becoming ornate or hard to scan. Script is used as a controlled accent, not as a body-text system.

## Colour

The palette is restrained and brand-consistent.

### Primary Colours

- Soft ivory / warm off-white background
- Near-black body text
- Dark gold accent
- Soft blush accent derived from the logo artwork

### Functional Colour Use

- Near-black is reserved for primary reading content and the phone number.
- Dark gold is used for section headings, subtle emphasis, and small structural accents.
- Blush is present mainly through the logo and overall warmth rather than through obvious decorative graphics.

### Colour Strategy

The design avoids large solid accent fields, heavy ornament, and dark blocks behind text. Contrast comes from typographic hierarchy and spatial control, not from loud colour contrast.

## Services Section

The services area is the visual and informational core of the flyer.

### Structure

The services are arranged into two bordered cards:

- Left card:
  - Acrylic
  - Builder Organic Gel
- Right card:
  - Manicure
  - Other Services

This grouping creates a stable, symmetrical middle mass while still allowing varied list lengths.

### Card Treatment

- Rounded corners
- Fine soft-gold/neutral border
- Warm off-white fill
- No heavy header bars
- No decorative flourishes inside the cards

The cards are intentionally light and understated so the pricing information remains the focus.

### Internal Rhythm

- Category headings sit relatively high within the cards
- Each category is separated by a light rule
- Service rows are compact but readable
- The bottom rows clear the card borders cleanly

The internal spacing has been tuned so the cards feel optically balanced rather than mathematically sparse.

### Price Treatment

Prices are:

- right-aligned
- separated from service names by a clear gutter
- colored in dark gold
- slightly stronger in weight than the service names

Prices are not boxed, shaded, or over-decorated. The intention is a subtle “scan target” effect rather than a loud emphasis device.

## Header

The header consists of:

- centered logo
- centered descriptor line below it

Current descriptor line:

- `Professional Nail Care • Sunshine Coast & Brisbane`

The descriptor is intentionally modest in scale and tonal weight. It functions as a positioning statement, not a headline.

There is no divider line between the descriptor and the service grid.

## Footer

The footer is a single rounded panel spanning the width of the composition area.

### Footer Zones

- Left: Instagram QR card
- Center: appointment/contact stack
- Right: website QR card

### QR Cards

Each QR card contains:

- a small uppercase platform heading
- the QR code itself
- a minimal text label beneath

Current labels:

- Instagram: `@luminous.nails`
- Website: `luminous-nails.com.au`

The QR cards do not include instructional copy such as `Scan to follow` or `Scan to browse`. That text was removed because it was redundant and visually wasteful.

The QR cards also do not use internal ornament. Their role is functional and architectural.

### Center Contact Stack

The center footer stack contains:

- `By appointment`
- `0439 929 210`
- `Palmview • Strathpine`

The `By appointment` line uses the script display style. The phone number is centered and bold. The suburb line is smaller and quieter.

This stack is vertically centered against the QR cards so the footer reads as a single aligned band.

### Footer Styling

- no top gold rule
- soft panel fill
- light border
- no extra decoration

The footer is meant to feel calm, useful, and structurally clean.

## Spacing And Alignment

The flyer depends heavily on spacing discipline.

### Page Rhythm

The vertical spacing between major zones is even:

- top inner padding to logo
- logo to descriptor
- descriptor to service cards
- service cards to footer
- footer to bottom inner padding

That even rhythm is a defining part of the current composition.

### Horizontal Discipline

- Service cards align to the same overall composition margins.
- Footer card aligns to the same inner composition width.
- QR cards are inset symmetrically within the footer.
- Internal QR padding is equalized so the code blocks do not feel horizontally compressed.

### Alignment Strategy

The flyer uses a mix of:

- centered alignment for brand and footer structure
- flush-left alignment for service names
- flush-right alignment for prices

That contrast makes the information scan efficiently without losing softness.

## Tone And Aesthetic Positioning

The flyer sits in a premium salon aesthetic space:

- soft rather than flashy
- editorial rather than promotional
- feminine rather than ornate
- structured rather than decorative

It should feel competent, calm, and refined. It should not feel loud, trendy, cluttered, or algorithmically templated.

## Source Of Truth For Content

The flyer’s service content must come from `index.html`, specifically the `#services` section.

Use these existing structural hooks:

- services section: `#services`
- category wrapper: `.service-category`
- category title: `.service-category-title`
- service row: `.service-item`
- service name: `.service-name`
- service price: `.service-price`

When services or pricing change, update the flyer from the live website markup rather than maintaining a second manual price list in this document.

The flyer intentionally does not reproduce the full price list here. `index.html` is the canonical source for:

- category names
- service names
- service order
- prices

## Source Of Truth For Contact And Brand Data

Use repo sources for flyer-visible business information:

- Phone number: from `index.html`
- Instagram URL: from `index.html`
- Website domain: from `CNAME`
- Visual brand direction: from `styles.css` and `DESIGN.md`

The flyer intentionally abbreviates location display to suburb-only labels:

- `Palmview`
- `Strathpine`

The full street addresses remain website content, not flyer copy.

## Current Asset Set

- Canonical source:
  - `flyer/luminous-nails-pricelist.svg`
- Canonical exports:
  - `flyer/luminous-nails-pricelist.pdf`
  - `flyer/luminous-nails-pricelist.png`
  - `flyer/luminous-nails-pricelist.jpg`
- Primary logo asset:
  - `flyer/logo-full.png`

The SVG should remain the canonical working source unless the flyer is deliberately re-authored into a different approved master format later.

The current exports were refreshed after the May 2026 Acrylic price update, with no visual design changes.
