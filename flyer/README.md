# Flyer Export Folder

This folder stores the latest exported flyer assets that should be committed to git.

## Canonical Export Filenames

- `luminous-nails-pricelist.pdf`
- `luminous-nails-pricelist.png`
- `luminous-nails-pricelist.jpg`

These filenames should always point to the current approved flyer exports.

## Update Rule

Whenever the flyer is changed and exported:

1. Replace the files above with the new approved exports.
2. Commit the updated files to git in the same task.
3. Update `FLYER.md` with the export date and any notable design changes.

## Notes

- The PDF is the print version.
- The PNG is the social-media-ready portrait image version.
- `luminous-nails-pricelist.svg` is the current canonical local source used to render the repo exports.
- The SVG should stay self-contained for visible artwork so Safari, PNG, and PDF renders stay aligned.
- `instagram-qr.png`, `website-qr.png`, `logo-light.png`, the `category-*.png` heading assets, and the bundled fonts under `fonts/` are rebuild helpers for the current flyer source workflow.
- If historical snapshots are needed later, add dated copies alongside the canonical files instead of renaming the canonical files.
