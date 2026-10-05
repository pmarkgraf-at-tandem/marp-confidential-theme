# Marp Company Confidential Theme

A [Marp](https://marp.app/) theme that marks every slide as company confidential. A small strip at the bottom-left of each slide shows:

- the company name
- the confidentiality level
- a company logo

The page number stays at the bottom-right. The strip comes from the theme, not the per-slide `footer:` directive, so authors cannot accidentally overwrite the marking.

## Install from GitHub Packages

Point the `@pmarkgraf-at-tandem` scope at GitHub Packages. Use a personal access token with `read:packages` (never commit it):

```sh
# ~/.npmrc
@pmarkgraf-at-tandem:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

```sh
npm install --save-dev @pmarkgraf-at-tandem/marp-confidential-theme @marp-team/marp-cli
npx marp deck.md --config-file node_modules/@pmarkgraf-at-tandem/marp-confidential-theme/marp.config.js -o deck.html
```

## Publishing

Bump `version` in [package.json](package.json), then publish a GitHub release. The [publish workflow](.github/workflows/publish.yml) runs `npm publish` with the built-in `GITHUB_TOKEN`.

## Setup

```sh
npm install
```

## Usage

Select the theme in a deck's front matter and set the three values:

```markdown
---
marp: true
theme: confidential
paginate: true
company: Acme Corp
confidentiality: COMPANY CONFIDENTIAL
logo: ../assets/logo.svg
---

# My slide
```

| Directive         | Meaning                       | Default when omitted         |
| ----------------- | ----------------------------- | ---------------------------- |
| `company`         | Company name                  | `Unknown Company`            |
| `confidentiality` | Confidentiality level text    | `Unknown Confidentiality`    |
| `logo`            | Path or URL of the logo image | A question-mark emoji (❓)   |

A relative `logo` path is resolved relative to the output file, so keep the deck and its output folder at the same depth from the logo (for example `example/` and `dist/`). An absolute URL or a data URI works from anywhere.

### Level colours

Add a class to a slide to change the colour of the strip:

```markdown
<!-- _class: restricted -->
```

Available classes: `internal` (blue), `confidential` (amber), `restricted` (red). Without a class the strip is grey.

### Build

The directives need the Marp CLI, which loads [marp.config.js](marp.config.js) automatically.

```sh
npm run build   # example/deck.md -> dist/deck.html
npm run pdf     # example/deck.md -> dist/deck.pdf
```

For your own deck:

```sh
npx marp my-deck.md -o dist/my-deck.html
npx marp my-deck.md --allow-local-files -o dist/my-deck.pdf
```

`--allow-local-files` is needed for the logo to appear in PDF output.

### VS Code preview

[.vscode/settings.json](.vscode/settings.json) registers the theme for the Marp for VS Code preview. The preview probably ignores `marp.config.js`, so the directives may not apply there and the defaults show. In that case, set the CSS variables directly in the front matter, which works in every Marp environment:

```markdown
---
marp: true
theme: confidential
style: |
  section {
    --company: 'Acme Corp';
    --confidentiality: 'COMPANY CONFIDENTIAL';
    --logo: url('../assets/logo.svg');
  }
---
```

## Using the theme from another folder

A deck can live anywhere. Point the Marp CLI at this project's config file, which loads the theme and the directives:

```sh
/path/to/marp-company-confidential/node_modules/.bin/marp deck.md \
  --config-file /path/to/marp-company-confidential/marp.config.js \
  -o deck.html
```

The deck's front matter still needs `theme: confidential` plus the `company`, `confidentiality` and `logo` directives.

- **Config discovery:** Marp looks for `marp.config.js` in the current folder and its parents. A deck inside this project needs no `--config-file`.
- **Theme location:** `themeSet: 'themes'` resolves relative to the config file, not the folder you run from. Keep `marp.config.js` and `themes/` together.
- **Logo path:** a relative `logo` is resolved relative to the output file, not the deck. For decks outside this project, use an absolute `file://` URL, an `https://` URL or a data URI.
- **PDF:** add `--allow-local-files` so a local logo appears.
- **Do not combine `--theme` with `--config-file`:** the build warns "Not found additional theme CSS files" and the theme name is hashed. Use the config alone.
- **Do not use `--theme` without the config:** the footer renders, but the directives are ignored and every deck shows the defaults.
- **No config and no `--theme`:** Marp silently falls back to its default theme.

## Project layout

| Path                                           | Purpose                                                  |
| ---------------------------------------------- | -------------------------------------------------------- |
| [themes/confidential.css](themes/confidential.css) | The theme: footer strip, defaults and level colours      |
| [marp.config.js](marp.config.js)               | Registers the `company`, `confidentiality`, `logo` directives |
| [assets/logo.svg](assets/logo.svg)             | Placeholder logo                                         |
| [example/deck.md](example/deck.md)             | Example deck with all directives set                     |
| [example/defaults.md](example/defaults.md)     | Example deck showing the default values                  |
| [PLAN.md](PLAN.md)                             | Design notes and open items                              |

## Out of scope

Access control, watermarking and PowerPoint master-slide fidelity.
