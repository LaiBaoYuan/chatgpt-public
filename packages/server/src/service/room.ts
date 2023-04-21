import { Router } from 'express'
import { v4 } from 'uuid'

const router = Router()

router.post('/getRooms', async (req, res) => {
  res.send(req.session.rooms)
})

router.post('/addRoom', async (req, res) => {
  let newRoom = {
    id: v4(),
    title: '新会话',
    conversations: []
  }
  req.session.rooms!.unshift(newRoom)
  req.session.save()
  res.send(newRoom)
})

router.delete('/deleteRoom/:id', async (req, res) => {
  let rooms = req.session.rooms!
  let index = rooms.findIndex((v) => v.id === req.params.id)
  if (index !== -1) {
    rooms.splice(index, 1)
  }
  req.session.save()
  res.sendStatus(200)
})

router.delete('/clearRooms', async (req, res) => {
  let rooms = req.session.rooms!
  rooms.splice(0, rooms.length)
  req.session.save()
  res.sendStatus(200)
})

export default router
