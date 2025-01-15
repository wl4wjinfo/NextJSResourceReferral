const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')
const fs = require('fs')

// Load environment variables from .env.production in production
if (process.env.NODE_ENV === 'production') {
  const envPath = path.join(__dirname, '.env.production')
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath })
  }
}

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'
const port = process.env.PORT || 3000

const app = next({ 
  dev,
  dir: __dirname,
  hostname,
  port,
  conf: {
    compress: true,
    generateEtags: true,
    poweredByHeader: false
  }
})

const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
