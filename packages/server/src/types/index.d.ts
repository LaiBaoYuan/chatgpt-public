export {}
declare module 'express-session' {
  interface SessionData {
    rooms: RoomItem[]
    ip: string
  }
}