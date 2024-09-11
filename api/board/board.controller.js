import { logger } from '../../services/logger.service.js'
import { boardService } from './board.service.js'

export const boardController = {
	// BOARDS
	getBoards,
	// BOARD
	getBoardById,
	addBoard,
	updateBoard,
	removeBoard,
	// GROUP
	getGroupById,
	addGroup,
	duplicateGroup,
	updateGroup,
	removeGroup,
	// PULSE
	getPulseById,
	addPulse,
	updatePulse,
	removePulse,

}

/// BOARDS ///
async function getBoards(req, res) {
	try {
		const filterBy = {
			txt: req.query.txt || '',
		}
		const boards = await boardService.query(filterBy)
		res.json(boards)
	} catch (err) {
		logger.error('Failed to get boards', err)
		res.status(400).send({ err: 'Failed to get boards' })
	}
}

/// BOARD ///
async function getBoardById(req, res) {
	try {
		const boardId = req.params.id
		const board = await boardService.getBoardById(boardId)
		res.json(board)
	} catch (err) {
		logger.error('Failed to get board', err)
		res.status(400).send({ err: 'Failed to get board' })
	}
}

async function addBoard(req, res) {
	const { loggedinUser, body: board } = req

	try {
		board.createdBy = loggedinUser
		const addedBoard = await boardService.addBoard(board)
		res.json(addedBoard)
	} catch (err) {
		logger.error('Failed to add board', err)
		res.status(400).send({ err: 'Failed to add board' })
	}
}

async function updateBoard(req, res) {
	const { loggedinUser, body: board } = req
	// const boardId = req.params.id // to check
	try {
		const updatedBoard = await boardService.updateBoard(board)
		res.json(updatedBoard)
	} catch (err) {
		logger.error('Failed to update board', err)
		res.status(400).send({ err: 'Failed to update board' })
	}
}

async function removeBoard(req, res) {
	try {
		const boardId = req.params.id
		const removedId = await boardService.removeBoard(boardId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove board', err)
		res.status(400).send({ err: 'Failed to remove board' })
	}
}

/// GROUP ///
async function getGroupById(req, res) {
	try {
		const { boardId, groupId } = req.params
		const group = await boardService.getGroupById(boardId, groupId)
		res.json(group)
	} catch (err) {
		logger.error('Failed to get group', err)
		res.status(400).send({ err: 'Failed to get group' })
	}
}

async function addGroup(req, res) {
	// const { loggedinUser } = req
	const boardId = req.params.boardId
	const pos = req.body.position
	try {
		const addedGroup = await boardService.addGroup(boardId, pos)
		res.json(addedGroup)
	} catch (err) {
		logger.error('Failed to add group', err)
		res.status(400).send({ err: 'Failed to add group' })
	}
}

async function duplicateGroup(req, res) {
	const { loggedinUser, body: group } = req
	const boardId = req.params.boardId
	try {
		const duplicatedGroup = await boardService.duplicateGroup(boardId, group)
		res.json(duplicatedGroup)
	} catch (err) {
		logger.error('Failed to duplicate group', err)
		res.status(400).send({ err: 'Failed to duplicate group' })
	}
}

async function updateGroup(req, res) {
	const { loggedinUser, body: group } = req
	const boardId = req.params.boardId
	try {
		const updatedGroup = await boardService.updateGroup(boardId, group)
		res.json(updatedGroup)
	} catch (err) {
		logger.error('Failed to update group', err)
		res.status(400).send({ err: 'Failed to update group' })
	}
}

async function removeGroup(req, res) {
	try {
		const { boardId, groupId } = req.params
		const removedGroupId = await boardService.removeGroup(boardId, groupId)
		res.send(removedGroupId)
	} catch (err) {
		logger.error('Failed to remove group', err)
		res.status(400).send({ err: 'Failed to remove group' })
	}
}

/// PULSE ///
async function getPulseById(req, res) {
	try {
		const { boardId, groupId, pulseId } = req.params
		const pulse = await boardService.getPulseById(boardId, groupId, pulseId)
		res.json(pulse)
	} catch (err) {
		logger.error('Failed to get pulse', err)
		res.status(400).send({ err: 'Failed to get pulse' })
	}
}

async function addPulse(req, res) {
	const { loggedinUser, body: pulse } = req
	const { boardId, groupId } = req.params
	try {
		const addedPulse = await boardService.addPulse(boardId, groupId, pulse)
		res.json(addedPulse)
	} catch (err) {
		logger.error('Failed to add pulse', err)
		res.status(400).send({ err: 'Failed to add pulse' })
	}
}

async function updatePulse(req, res) {
	const { loggedinUser, body: pulse } = req
	const { boardId, groupId } = req.params
	try {
		const updatedPulse = await boardService.updatePulse(boardId, groupId, pulse)
		res.json(updatedPulse)
	} catch (err) {
		logger.error('Failed to update pulse', err)
		res.status(400).send({ err: 'Failed to update pulse' })
	}
}

async function removePulse(req, res) {
	try {
		const { boardId, groupId, pulseId } = req.params
		const removedPulseId = await boardService.removePulse(boardId, groupId, pulseId)
		res.send(removedPulseId)
	} catch (err) {
		logger.error('Failed to remove pulse', err)
		res.status(400).send({ err: 'Failed to remove pulse' })
	}
}

// async function addBoardMsg(req, res) {
// 	const { loggedinUser } = req

// 	try {
// 		const boardId = req.params.id
// 		const msg = {
// 			txt: req.body.txt,
// 			by: loggedinUser,
// 		}
// 		const savedMsg = await boardService.addBoardMsg(boardId, msg)
// 		res.json(savedMsg)
// 	} catch (err) {
// 		logger.error('Failed to update board', err)
// 		res.status(400).send({ err: 'Failed to update board' })
// 	}
// }

// async function removeBoardMsg(req, res) {
// 	try {
// 		const boardId = req.params.id
// 		const { msgId } = req.params

// 		const removedId = await boardService.removeBoardMsg(boardId, msgId)
// 		res.send(removedId)
// 	} catch (err) {
// 		logger.error('Failed to remove board msg', err)
// 		res.status(400).send({ err: 'Failed to remove board msg' })
// 	}
// }
