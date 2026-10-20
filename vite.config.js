import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Résumé variants (src/variants/*.json) are served by the same app under a path
// prefix. Link previews and crawlers read the static HTML, not the rendered app,
// so after the build each variant gets its own copy of index.html with its own
// title and description, marked noindex.
const BASE_TITLE = 'Kevin McCalley — Senior Full-Stack / Product Engineer'
const BASE_ROLE = 'Senior Full-Stack / Product Engineer'
const BASE_URL = 'https://kevinmccalley.com'
const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

function variantHtml(html, variant) {
  const { title, description, shortDescription } = variant.meta
  const role = title.replace('Kevin McCalley — ', '')
  return html
    .replace(/(<meta name="description" content=")[^"]*/, `$1${escapeAttr(description)}`)
    .replace(/(<meta (?:property="og|name="twitter):description" content=")[^"]*/g, `$1${escapeAttr(shortDescription)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${BASE_URL}${variant.path}`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title.replace(/&/g, '&amp;')} — Résumé</title>\n    <meta name="robots" content="noindex" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, (ld) =>
      ld.replace(/"description": "[^"]*"/, `"description": ${JSON.stringify(description)}`).replaceAll(BASE_ROLE, role))
    .replaceAll(BASE_TITLE, escapeAttr(title))
}

function resumeVariants() {
  let outDir
  return {
    name: 'resume-variants',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const html = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      for (const id of ['frontend']) {
        const variant = JSON.parse(readFileSync(resolve(__dirname, `src/variants/${id}.json`), 'utf8'))
        mkdirSync(resolve(outDir, id), { recursive: true })
        writeFileSync(resolve(outDir, id, 'index.html'), variantHtml(html, variant))
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), resumeVariants()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    testTimeout: 15000,
  },
})
