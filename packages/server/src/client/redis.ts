import { createClient } from 'redis'
import connectRedis from 'connect-redis'
import SessionMiddleware from 'express-session'

export const client = createClient({
  url: `redis://${process.env.DOMAIN || 'redis'}:6379`,
  password: process.env.REDIS_PASSWORD || ''
})
client.on('error', (err) => console.log('Redis Client Error', err))
client.connect()

let store = new connectRedis({
  client,
  prefix: 'chat:'
})

export default SessionMiddleware({
  store,
  name: 'session_id',
  secret: '12ms9adaix0a2kasada',
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/backend-api',
    domain: process.env.DOMAIN || 'localhost',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true
  }
})
