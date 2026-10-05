// Registers `company`, `confidentiality` and `logo` front-matter directives for the confidential theme.
const { readFileSync } = require('node:fs')
const { extname, resolve } = require('node:path')
const { fileURLToPath } = require('node:url')

// Values land in an inline `--<directive>` custom property, so they must be valid CSS values.
const cssString = (value) =>
    `"${String(value)
        .replace(/[\u0000-\u001f\u007f]+/g, ' ')
        .trim()
        .replace(/[\\"]/g, '\\$&')}"`

const stringDirective = (name) => (value) => {
    const text = String(value ?? '').trim()
    return text ? { [name]: cssString(text) } : {}
}

const mimeTypes = {
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
}

// Marp CLI does not expose the deck's path to the engine, so relative paths resolve against the working directory.
const inlineLocalLogo = (location) => {
    const file = location.startsWith('file:') ? fileURLToPath(location) : resolve(location)
    const mime = mimeTypes[extname(file).toLowerCase()]
    if (!mime) throw new Error(`unsupported image type "${extname(file)}"`)
    return `data:${mime};base64,${readFileSync(file).toString('base64')}`
}

// Remote URLs and data URIs pass through; local files are inlined so the output works from anywhere.
const logoSource = (location) => (/^(https?:|data:)/i.test(location) ? location : inlineLocalLogo(location))

const logoDirective = (value) => {
    const location = String(value ?? '').trim()
    if (!location) return {}

    try {
        return { logo: `url(${cssString(logoSource(location))})` }
    } catch (error) {
        console.warn(`[confidential theme] logo "${location}" not used: ${error.message}`)
        return {}
    }
}

const confidentialDirectives = (md) => {
    const { global } = md.marpit.customDirectives

    global.company = stringDirective('company')
    global.confidentiality = stringDirective('confidentiality')
    global.logo = logoDirective

    // Marpit's own apply rule snapshots directive names at construction, before this plugin runs.
    md.core.ruler.after('marpit_directives_apply', 'confidential_directives_apply', (state) => {
        for (const token of state.tokens) {
            const directives = token.meta?.marpitDirectives
            if (token.type !== 'marpit_slide_open' || !directives) continue

            const declarations = Object.keys(global)
                .filter((name) => directives[name])
                .map((name) => `--${name}:${directives[name]};`)
                .join('')

            if (declarations) token.attrSet('style', (token.attrGet('style') ?? '') + declarations)
        }
    })
}

module.exports = {
    engine: ({ marp }) => marp.use(confidentialDirectives),
    themeSet: 'themes',
}
