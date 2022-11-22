import { API_ADDRESS } from '../../../config/index.js'
import getCurrentDirectory from '../../../lib/get-current-directory.js'
import { readdir } from 'fs/promises'
import { join, normalize } from 'path'
import generateSitemaps from '../../../integrations/sitemap/index.js'

const __dirname = getCurrentDirectory(import.meta)

const loadSitemaps = async () =>
  await readdir(normalize(join(__dirname, '../../../clients'))).then(entries =>
    entries.filter(e => e.startsWith('sitemap')).map(f => `Sitemap: ${API_ADDRESS}/${f}`)
  )

let sitemaps
try {
  sitemaps = await loadSitemaps()
} catch (error) {
  console.error('Unable to load sitemaps', error)
  console.info('Trying to generate sitemaps...')
  await generateSitemaps()
  sitemaps = await loadSitemaps()
  console.info('Sitemaps successfully generated!')
}

const body = `
${sitemaps.join('\n')}

User-agent: *

Disallow: /about
Disallow: /login
Disallow: /privacy-policy
Disallow: /terms-of-use
Disallow: /disclaimer
Disallow: /http
Disallow: /graphql

Allow: /`

export default async ctx => {
  ctx.body = body.replace('\nSitemap', 'Sitemap').replace(/\n+/g, '\n')
}
