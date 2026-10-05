# Plan: Marp "Company Confidential" theme

Goal: a Marp theme that shows company name, confidentiality level and a logo in a small footer strip on every slide.

Status: Phase 1 and Phase 2 are implemented and the package is published. No open items.

## Phase 1: theme and variable-driven footer (done)

- [themes/confidential.css](themes/confidential.css) extends `default`.
- `section` defines `--company`, `--confidentiality` and `--logo`, plus `--confidentiality-color`.
- `section::before` draws the strip bottom-left (about 12px). The logo is its background, with left padding reserved for it. The page number stays in `section::after`.
- Level classes (`.internal`, `.confidential`, `.restricted`) change only the strip colour.

## Phase 2: front-matter directives (done)

- [marp.config.js](marp.config.js) registers the global directives `company`, `confidentiality` and `logo`, and sets `themeSet` to `themes`.
- Directive values are escaped into CSS strings, then written as inline `--<name>` custom properties on each slide. This uses a core rule after `marpit_directives_apply`, because Marpit snapshots directive names at construction.
- Omitted values fall back to the theme defaults:
  - company: "Unknown Company"
  - confidentiality: "Unknown Confidentiality"
  - logo: a question-mark emoji drawn as an SVG image
- Local logo files are inlined as base64 data URIs at build time, so output works when moved and in PDF without `--allow-local-files`. Relative paths resolve against the working directory, because Marp CLI does not pass the deck path to the engine. Missing or unsupported files warn and fall back to the default logo.
- Only works with Marp CLI or another engine that loads the config. A `style:` block that sets `--company`, `--confidentiality` and `--logo` works everywhere.

## Supporting files (done)

- [assets/logo.svg](assets/logo.svg): placeholder logo.
- [example/deck.md](example/deck.md): all directives set. [example/defaults.md](example/defaults.md): none set.
- [package.json](package.json): `build` and `pdf` scripts.
- [.vscode/settings.json](.vscode/settings.json): `markdown.marp.themes` points at the theme.

## Verified

- HTML build, PDF build and PNG renders succeed.
- The footer appears on every slide, including `lead` and `restricted` slides, and the page number does not overlap it.
- Defaults render when the directives are omitted, including the question-mark logo in the PDF.
- Confirmed: the VS Code Marp preview ignores `marp.config.js` directives and shows the defaults. Use the `style:` block there.
- The package published to GitHub Packages installs and builds a deck from a clean project.

## Decisions

- The footer is theme-enforced via `::before`, not the per-slide `footer:` directive, so authors cannot overwrite the marking.
- Out of scope: access control, watermarking, PowerPoint master-slide fidelity.

## Open items

None.
