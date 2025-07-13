import { NextFunction, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { z } from 'zod'
import crypto from 'crypto'

// Rate limiting configurations
export const rateLimiters = {
  // General API rate limit
  general: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Strict rate limit for auth endpoints
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true,
  }),

  // Rate limit for data mutations
  mutations: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per minute
    message: 'Too many write operations, please slow down.',
  }),

  // Rate limit for file uploads
  uploads: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 uploads per hour
    message: 'Upload limit exceeded, please try again later.',
  }),
}

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https://*.supabase.co', 'wss://*.supabase.co'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
})

// Input sanitization middleware
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Recursively sanitize object
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      // Remove null bytes
      obj = obj.replace(/\0/g, '')
      // Trim whitespace
      obj = obj.trim()
      // Prevent script injection
      obj = obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      return obj
    } else if (Array.isArray(obj)) {
      return obj.map(sanitize)
    } else if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitize(obj[key])
        }
      }
      return sanitized
    }
    return obj
  }

  if (req.body) {
    req.body = sanitize(req.body)
  }
  if (req.query) {
    req.query = sanitize(req.query)
  }
  if (req.params) {
    req.params = sanitize(req.params)
  }

  next()
}

// API key validation middleware
export function validateAPIKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' })
  }

  // Validate API key format (example: expecting a specific format)
  const apiKeySchema = z.string().regex(/^[A-Za-z0-9]{32}$/)
  const validation = apiKeySchema.safeParse(apiKey)

  if (!validation.success) {
    return res.status(401).json({ error: 'Invalid API key format' })
  }

  // TODO: Verify API key against database
  // const isValid = await verifyAPIKey(apiKey)
  // if (!isValid) {
  //   return res.status(401).json({ error: 'Invalid API key' })
  // }

  next()
}

// Request signing validation
export function validateRequestSignature(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['x-signature'] as string
    const timestamp = req.headers['x-timestamp'] as string

    if (!signature || !timestamp) {
      return res.status(401).json({ error: 'Missing signature headers' })
    }

    // Check timestamp to prevent replay attacks (5 minute window)
    const requestTime = parseInt(timestamp)
    const currentTime = Date.now()
    if (Math.abs(currentTime - requestTime) > 5 * 60 * 1000) {
      return res.status(401).json({ error: 'Request expired' })
    }

    // Verify signature
    const payload = JSON.stringify(req.body) + timestamp
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' })
    }

    next()
  }
}

// SQL injection prevention (for raw queries if needed)
export function preventSQLInjection(input: string): string {
  // Basic SQL injection prevention
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove multi-line comments
    .replace(/\*\//g, '')
    .replace(/xp_/gi, '') // Remove extended stored procedures
    .replace(/sp_/gi, '') // Remove system stored procedures
}

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours
}

// File upload validation
export function validateFileUpload(
  allowedTypes: string[],
  maxSize: number // in bytes
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Check file type
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
      })
    }

    // Check file size
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB` 
      })
    }

    // Additional security checks
    // Check for double extensions
    const filename = req.file.originalname
    const extensions = filename.split('.')
    if (extensions.length > 2) {
      return res.status(400).json({ error: 'Invalid filename' })
    }

    next()
  }
}

// IP whitelist/blacklist
export function ipFilter(whitelist: string[] = [], blacklist: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.socket.remoteAddress || ''

    // Check blacklist first
    if (blacklist.length > 0 && blacklist.includes(clientIp)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Check whitelist if provided
    if (whitelist.length > 0 && !whitelist.includes(clientIp)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    next()
  }
}