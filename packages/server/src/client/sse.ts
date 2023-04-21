import SSE from 'express-sse'
import { Request, Response } from 'express'
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import proxy from 'https-proxy-agent'
import nodeFetch from 'node-fetch'
import dayjs from 'dayjs'

/**
 * ChatGPTAPI构造
 */
const api = new ChatGPTAPI({
  apiKey: process.env.API_KEY!,
  fetch: (url, option) =>
    nodeFetch(
      url as any,
      { agent: proxy('http://localhost:7890'), ...option } as any
    ) as any
})

/**
 * ChatGPTUnofficialProxyAPI构造
 */
// const api = new ChatGPTUnofficialProxyAPI({
//   accessToken: process.env.ACCESS_TOKEN!,
//   fetch: (url, option) =>
//     nodeFetch(
//       url as any,
//       { agent: proxy('http://clash:7890'), ...option } as any
//     ) as any
// })
export interface ClientType {
  id: string
  sse: SSE
  controller?: AbortController
  currentMsgId?: string
}

export const sseInstance = class {
  private _clients: ClientType[]

  constructor() {
    this._clients = []
  }

  get clients() {
    return this._clients
  }

  init(req: Request, res: Response) {
    if (!this.clients.find((v) => v.id === req.sessionID)) {
      const sse = new SSE()
      sse.init(req, res)
      this.clients.push({
        id: req.sessionID,
        sse
      })
      console.log(
        `Client\`${req.sessionID}\`在${dayjs().format(
          'YYYY年MM月DD日HH时mm分ss秒'
        )}中进入网站.`
      )
      req.on('close', () => {
        console.log(
          `Client\`${req.sessionID}\`在${dayjs().format(
            'YYYY年MM月DD日HH时mm分ss秒'
          )}中离开网站.`
        )
        this.clients.splice(
          this.clients.findIndex((v) => v.id === req.sessionID),
          1
        )
      })
    }
  }

  sendToClient(
    clientId: string,
    data: any,
    event?: string | undefined,
    id?: string | number | undefined
  ) {
    const client = this.clients.find((c) => c.id === clientId)
    if (client) {
      client.sse.send(data, event, id)
    }
  }

  async sendMsg(msg: MsgItem, req: Request) {
    const client = this.clients.find((c) => c.id === req.sessionID)
    try {
      let tempStr = ''
      if (client) {
        client.controller = new AbortController()
        client.currentMsgId = msg.send_id
        await api.sendMessage(msg.send_content, {
          messageId: msg.send_id,
          // conversationId: req.body.conversationId, # 使用ChatGPTUnofficialProxyAPI构造函数来创建api必须打开此注释
          parentMessageId: req.body.receive_id,
          abortSignal: client.controller.signal,
          onProgress: (res) => {
            let sendStr = res.text.slice(tempStr.length)
            this.sendToClient(
              req.sessionID,
              sendStr,
              'message',
              `${msg.send_id}.${res.conversationId}.${res.id}`
            )
            tempStr = res.text
            msg.conversationId = res.conversationId
            msg.receive_content += sendStr
            msg.receive_id = res.id
          }
        })
        msg.loading = false
        req.session.save()
        client.controller = undefined
        client.currentMsgId = undefined
        this.sendToClient(req.sessionID, 'complete', 'complete', msg.send_id)
      }
    } catch (error) {
      console.error(error)
      msg.error = true
      msg.loading = false
      req.session.save()
      client!.controller = undefined
      client!.currentMsgId = undefined
      this.sendToClient(req.sessionID, msg.error, 'error', msg.send_id)
    }
  }

  cancel(req: Request) {
    const client = this.clients.find((c) => c.id === req.sessionID)
    if (client && client.controller && client.currentMsgId) {
      client.controller.abort()
      this.sendToClient(req.sessionID, 'cancel', 'cancel', client.currentMsgId)
      client.controller = undefined
      client.currentMsgId = undefined
    }
  }
}
