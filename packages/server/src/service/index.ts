import { Router } from 'express'
import chatRoute from './chat'
import roomRoute from './room'
const router = Router()
router.use('/chat', chatRoute)
router.use('/room', roomRoute)
export default router
