import { logger } from '../../services/logger.service.js'
import { boardService } from './board.service.js'

export async function getBoards(req, res) {
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

export async function getBoardById(req, res) {
	try {
		const boardId = req.params.id
		const board = await boardService.getBoardById(boardId)
		res.json(board)
	} catch (err) {
		logger.error('Failed to get board', err)
		res.status(400).send({ err: 'Failed to get board' })
	}
}

export async function addBoard(req, res) {
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

export async function updateBoard(req, res) {
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

export async function removeBoard(req, res) {
	try {
		const boardId = req.params.id
		const removedId = await boardService.removeBoard(boardId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove board', err)
		res.status(400).send({ err: 'Failed to remove board' })
	}
}

// export async function addBoardMsg(req, res) {
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

// export async function removeBoardMsg(req, res) {
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
