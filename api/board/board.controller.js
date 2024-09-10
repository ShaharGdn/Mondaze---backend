import { logger } from '../../services/logger.service.js'
import { boardService } from './board.service.js'

export const boardController = {
	getBoards,
	getBoardById,
	addBoard,
	updateBoard,
	removeBoard,

	getGroupById,
	addGroup,

}

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
	console.log('boardId:',boardId)
	const pos = req.body.position
	try {
		const addedGroup = await boardService.addGroup(boardId, pos)
		res.json(addedGroup)
	} catch (err) {
		logger.error('Failed to add group', err)
		res.status(400).send({ err: 'Failed to add group' })
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
