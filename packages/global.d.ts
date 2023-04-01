declare var __DEV__: boolean

interface MsgItem {
  conversationId?: string
  send_id: string
  send_content: string
  receive_id: string
  receive_content: string
  time_stamp: string
  isEdit: boolean
  error: boolean | string
  loading: boolean
}

interface RoomItem {
  id: string
  title: string
  conversations: MsgItem[]
}

declare module 'express-sse' {
  import { EventEmitter } from 'events'

  interface SSEOptions {
    isSerialized?: boolean
    initialEvent?: string
  }
  class SSE<T = any> extends EventEmitter {
    constructor(initial?: T | T[], options?: SSEOptions)

    initial: T | T[]

    init(req: any, res: any): void

    updateInit(data: T | T[]): void

    dropInit(): void

    send(data: T, event?: string, id?: string | number): void

    serialize(data: T | T[]): void
  }

  export default SSE
}

declare class WxLogin {
  constructor(config: any)
}
