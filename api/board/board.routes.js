import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
// import { getBoards, getBoardById, addBoard, updateBoard, removeBoard, getGroupById } from './board.controller.js'
import { boardController } from './board.controller.js'

const router = express.Router()
// We can add a middleware for the entire router:
// router.use(requireAuth)

// BOARD
router.get('/', log, boardController.getBoards)
router.get('/:id', log, boardController.getBoardById)
router.post('/', log, requireAuth, boardController.addBoard)
router.put('/:id', requireAuth, boardController.updateBoard)
router.delete('/:id', requireAuth, boardController.removeBoard)

// GROUP 
router.get('/group/:boardId/:groupId', log, boardController.getGroupById)
router.post('/group/:boardId', requireAuth, boardController.addGroup)
router.post('/group/:boardId/duplicate/', requireAuth, boardController.duplicateGroup)
router.put('/group/:boardId', requireAuth, boardController.updateGroup)
router.delete('/group/:boardId/:groupId', requireAuth, boardController.removeGroup)

// // PULSE

// router.get('/boardId/group/groupId/pulse/:id', log, getPulseById)
// router.post('/boardId/group/groupId/pulse/', log, addPulse)
// router.put('/boardId/group/groupId/pulse/:id', updatePulse)
// router.delete('/boardId/group/groupId/pulse/:id', removePulse)

// router.post('/:id/msg', requireAuth, addBoardMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeBoardMsg)

export const boardRoutes = router