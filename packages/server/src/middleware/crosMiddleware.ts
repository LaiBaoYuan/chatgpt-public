import { RequestHandler } from 'express'
const CrosMiddleware: RequestHandler = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', req.get('Origin') || '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, OPTIONS, DELETE, PUT'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since, Authorization'
  )
  if (req.method == 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
}

export default CrosMiddleware
