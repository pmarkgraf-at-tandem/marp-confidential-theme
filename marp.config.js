// Registers `company`, `confidentiality` and `logo` front-matter directives for the confidential theme.

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

const logoDirective = (value) => {
    const path = String(value ?? '').trim()
    return path ? { logo: `url(${cssString(path)})` } : {}
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
