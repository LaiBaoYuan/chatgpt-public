export {}
declare module 'express-session' {
  interface SessionData {
    conversations: RoomItem[]
    ip: string
  }
}