import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 3

export const boardService = {
    query,
    getBoardById,
    addBoard,
    updateBoard,
    removeBoard,

    // getGroupById,
    // addGroup,
    // duplicateGroup,
    // updateGroup,
    // removeGroup,

    // getPulseById,
    // addPulse,
    // updatePulse,
    // removePulse,

    // addBoardMsg,
    // removeBoardMsg,
}

async function query(filterBy = { txt: '' }) {
    try {
        const criteria = { title: { $regex: filterBy.txt, $options: 'i' } }
        const collection = await dbService.getCollection('board')
        const boards = await collection.find(criteria).toArray()
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getBoardById(boardId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(boardId) }
        const collection = await dbService.getCollection('board')

        const board = await collection.findOne(criteria)
        // board.activities.createdAt = board._id.getTimestamp() // later for activities
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function addBoard(board) {
    // should we recreate boardToSave here also? 
    try {
        const collection = await dbService.getCollection('board')
        await collection.insertOne(board)
        return board
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function updateBoard(board) {
    const boardToSave = {
        title: board.title,
        isStarred: board.isStarred,
        archivedAt: board.archivedAt,
        folder: board.folder,
        style: board.style,
        members: board.members,
        groups: board.groups,
        cmpsOrder: board.cmpsOrder
    }

    try {
        const criteria = { _id: ObjectId.createFromHexString(board._id) }
        const collection = await dbService.getCollection('board')
        await collection.updateOne(criteria, { $set: boardToSave })
        return board
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

async function removeBoard(boardId) {
    // const { loggedinUser } = asyncLocalStorage.getStore()
    try {
        const criteria = { _id: ObjectId.createFromHexString(boardId) }
        const collection = await dbService.getCollection('board')
        await collection.deleteOne(criteria)
        return boardId
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

// async function addBoardMsg(boardId, msg) {
// 	try {
//         const criteria = { _id: ObjectId.createFromHexString(boardId) }
//         msg.id = makeId()

// 		const collection = await dbService.getCollection('board')
// 		await collection.updateOne(criteria, { $push: { msgs: msg } })

// 		return msg
// 	} catch (err) {
// 		logger.error(`cannot add board msg ${boardId}`, err)
// 		throw err
// 	}
// }

// async function removeBoardMsg(boardId, msgId) {
// 	try {
//         const criteria = { _id: ObjectId.createFromHexString(boardId) }

// 		const collection = await dbService.getCollection('board')
// 		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId }}})

// 		return msgId
// 	} catch (err) {
// 		logger.error(`cannot add board msg ${boardId}`, err)
// 		throw err
// 	}
// }

function _buildCriteria(filterBy) {
    const criteria = {
        vendor: { $regex: filterBy.txt, $options: 'i' },
        speed: { $gte: filterBy.minSpeed },
    }

    return criteria
}

function _buildSort(filterBy) {
    if (!filterBy.sortField) return {}
    return { [filterBy.sortField]: filterBy.sortDir }
}