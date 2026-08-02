import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import { extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const from = (path) => fileURLToPath(new URL(path, import.meta.url))

/**
 * In dev, Vite's SPA history fallback rewrites any extensionless path to the
 * root index.html — so /hackathon would serve the main page instead of the
 * hackathon entry. GitHub Pages redirects /hackathon to /hackathon/ in
 * production; this mirrors that locally so both environments behave the same.
 */
const directoryTrailingSlash = () => ({
  name: 'directory-trailing-slash',
  apply: 'serve',
  configureServer(server) {
    // Registered here (rather than in a returned post-hook) so it runs before
    // Vite's internal SPA fallback middleware gets the request.
    server.middlewares.use((req, res, next) => {
      const [pathname, query] = req.url.split('?')
      const isBareDirectory =
        pathname !== '/' && !pathname.endsWith('/') && !extname(pathname)

      if (isBareDirectory && existsSync(from(`.${pathname}/index.html`))) {
        res.writeHead(301, { Location: `${pathname}/${query ? `?${query}` : ''}` })
        res.end()
        return
      }
      next()
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), directoryTrailingSlash()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        // Each entry emits its own HTML file; hackathon/ lands at /hackathon.
        main: from('index.html'),
        hackathon: from('hackathon/index.html'),
      },
    },
  },
})
