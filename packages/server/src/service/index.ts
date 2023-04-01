import { Router } from 'express'
import { sse } from '../client'
import { v4 } from 'uuid'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

const router = Router()

router.post('/conversations', async (req, res) => {
  res.send(req.session.conversations)
})

router.post('/add', async (req, res) => {
  req.session.conversations!.unshift({
    id: v4(),
    title: '新会话',
    conversations: []
  })
  req.session.save()
  res.send(req.session.conversations)
})

router.delete('/clear', async (req, res) => {
  let consversations = req.session.conversations!
  consversations.splice(0, consversations.length)
  req.session.save()
  res.send(consversations)
})

router.delete('/:id', async (req, res) => {
  let consversations = req.session.conversations!
  let index = consversations.findIndex((v) => v.id === req.params.id)
  if (index !== -1) {
    consversations.splice(index, 1)
  }
  req.session.save()
  res.send(consversations)
})

router.post('/send/:id', async (req, res) => {
  let consversations = req.session.conversations!
  let room = consversations.find((v) => v.id === req.params.id)
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
    res.send(room.conversations)
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
