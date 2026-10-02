# Plan: Marp "Company Confidential" theme

Goal: a Marp theme that shows company name, confidentiality level and a logo in a small footer strip on every slide.

## Phase 1: theme and variable-driven footer

1. `themes/confidential.css`: `/* @theme confidential */`, `@import 'default';`.
2. Defaults on `section`: `--company-name`, `--confidentiality` (quoted strings), `--company-logo` (`url(...)`).
3. `section::before` draws the strip: absolute, bottom-left, about 12px, muted colour. `content: var(--company-name) " | " var(--confidentiality)`. The logo is a background (no-repeat, left center, contain) with left padding. The page number stays in `section::after` (`paginate: true`).
4. Optional level classes (`.internal`, `.confidential`, `.restricted`) that only change colour or weight.
5. Authors set front matter: `marp: true`, `theme: confidential`, `paginate: true`, and a `style:` block that sets the three CSS variables on `section`.

## Phase 2 (optional, after phase 1): first-class directives

6. A `marp.config.js` plugin registers global custom directives (`company`, `confidentiality`, `logo`) via `marpit.customDirectives.global`, mapped to the CSS variables.
7. Register `themeSet` with the themes folder.
8. Caveat: only works with Marp CLI or a config-aware engine. Keep phase 1 as the fallback for the VS Code preview.

## Supporting files

9. `assets/logo.svg` placeholder. Prefer a data URI or inline SVG so PDF/PPTX export does not depend on local paths.
10. `example/deck.md` demo deck.
11. `package.json` with `@marp-team/marp-cli` and build/pdf scripts (`--theme-set themes`; `--allow-local-files` for PDF).
12. `.vscode/settings.json`: `markdown.marp.themes` -> `themes/confidential.css`.

## Verification

- `npx marp --theme-set themes example/deck.md -o dist/deck.html`: footer on every slide, including title and lead slides.
- PDF export with `--allow-local-files`: logo renders.
- With `paginate: true`, the page number does not overlap the strip.
- Changing the front-matter values updates the footer.
- The VS Code Marp preview loads the theme.

## Decisions

- Pure-CSS variables first (works in every Marp environment).
- The footer is theme-enforced via `::before`, not the per-slide `footer:` directive, so authors cannot overwrite the marking.
- Out of scope: access control, watermarking, PowerPoint master-slide fidelity.

## Open questions

1. Logo format: SVG (recommended) or PNG as a base64 data URI.
2. Fixed confidentiality vocabulary (Public / Internal / Confidential / Restricted) that needs distinct styling?
3. Enforce a default marking ("COMPANY CONFIDENTIAL") when the author omits it? Recommended: yes.
