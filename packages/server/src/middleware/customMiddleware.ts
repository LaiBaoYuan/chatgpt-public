import { RequestHandler } from 'express'
export let chatMap = new Map()
const CustomMiddleware: RequestHandler = async (req, res, next) => {
  if (req.session && req.sessionID) {
    if (!chatMap.has(req.sessionID)) {
      chatMap.set(req.sessionID, [])
      req.sessionStore.get(req.sessionID, (err, session) => {
        chatMap.set(
          req.sessionID,
          !err && session && session.rooms ? session.rooms : []
        )
      })
    }
    req.session.rooms = chatMap.get(req.sessionID)
    req.session.ip =
      (req.headers['x-real-ip'] as string) ||
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress
  }
  next()
}

export default CustomMiddleware
