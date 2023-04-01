import Express from 'express'
import bodyParser from 'body-parser'
import service from '../service'
import { CrosMiddleware, CustomMiddleware } from '../middleware'
import SessionMiddleware from './redis'
import { sseInstance } from './sse'

export const sse = new sseInstance()

const server = Express()
server.use(bodyParser.json())
server.all('*', CrosMiddleware)
server.use(SessionMiddleware)
server.use(CustomMiddleware)
server.use('/backend-api/conversation', sse.init.bind(sse))
server.use('/backend-api', service)

export default server
export { client as redisClient } from './redis'
