import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { getBoards, getBoardById, addBoard, updateBoard, removeBoard } from './board.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

// BOARD
router.get('/', log, getBoards)
router.get('/:id', log, getBoardById)
router.post('/', log, requireAuth, addBoard)
router.put('/:id', requireAuth, updateBoard)
router.delete('/:id', requireAuth, removeBoard)

// GROUP  - should be params or query?
// router.get('/boardId/group/:id', log, getGroupById)

// router.get('/group/:boardId/:groupId', log, getGroupById) // is there a difference?

// router.post('/boardId/group/', log, addGroup)
// router.post('/boardId/group/:id', log, duplicateGroup)
// router.put('/boardId/group/:id', updateGroup)
// router.delete('/boardId/group/:id', removeGroup)

// // PULSE
// router.get('/pulse/:boardId/:groupId/:pulseId', log, getGroupById) // is there a difference?


// router.get('/boardId/group/groupId/pulse/:id', log, getPulseById)
// router.post('/boardId/group/groupId/pulse/', log, addPulse)
// router.put('/boardId/group/groupId/pulse/:id', updatePulse)
// router.delete('/boardId/group/groupId/pulse/:id', removePulse)

// router.post('/:id/msg', requireAuth, addBoardMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeBoardMsg)

export const boardRoutes = router