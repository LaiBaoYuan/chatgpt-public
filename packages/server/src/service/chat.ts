import { Router } from 'express'
import { v4 } from 'uuid'
import { sse } from '../client'
import dayjs from 'dayjs'

const router = Router()

router.get('/get/:id', async (req, res) => {
  let rooms = req.session.rooms!
  let room = rooms.find((v) => v.id === req.params.id)
  res.send(room?.conversations)
})

router.post('/send/:id', async (req, res) => {
  let rooms = req.session.rooms!
  let room = rooms.find((v) => v.id === req.params.id)
  if (room) {
    let newMsg: MsgItem = {
      send_id: v4(),
      send_content: req.body.send_content,
      receive_id: '',
      receive_content: '',
      time_stamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      error: false,
      isEdit: false,
      loading: false
    }
    const existIndex = room.conversations.findIndex(
      (v) => req.body.send_id && v.send_id === req.body.send_id
    )
    if (existIndex === -1) {
      room.conversations.push(newMsg)
    } else {
      room.conversations.splice(
        existIndex,
        room.conversations.length - existIndex,
        newMsg
      )
    }
    res.send(newMsg)
    !newMsg.error && sse.sendMsg(newMsg, req)
  } else {
    res.status(500).send('会话不存在')
  }
})

router.get('/cancel', async (req, res) => {
  sse.cancel(req)
  res.sendStatus(200)
})

export default router
