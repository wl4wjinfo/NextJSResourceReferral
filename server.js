const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')
const fs = require('fs')

// Load environment variables from .env.production in production
if (process.env.NODE_ENV === 'production') {
  try {
    const envPath = path.join(__dirname, '.env.production')
    if (fs.existsSync(envPath)) {
      const envConfig = require('dotenv').parse(fs.readFileSync(envPath))
      for (const k in envConfig) {
        process.env[k] = envConfig[k]
      }
      console.log('Successfully loaded environment variables')
    } else {
      console.warn('No .env.production file found')
    }
  } catch (err) {
    console.error('Error loading environment variables:', err)
  }
}

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'
const port = process.env.PORT || 3000

// Verify required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SITE_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'JWT_SECRET',
  'NEO4J_URI',
  'NEO4J_USERNAME',
  'NEO4J_PASSWORD'
]

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set`)
  }
})

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
