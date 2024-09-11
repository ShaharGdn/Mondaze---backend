import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { getRandomColor, makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

export const boardService = {
    // BOARDS
    query,
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
        logger.error('cannot get boards', err)
        throw err
    }
}

async function getBoardById(boardId) {
    try {
        const criteria = { _id: new ObjectId(boardId) }
        const collection = await dbService.getCollection('board')

        const board = await collection.findOne(criteria)
        // board.activities.createdAt = board._id.getTimestamp() // later for activities
        return board
    } catch (err) {
        logger.error(`Cannot get board by id: ${boardId}`, err)
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
        logger.error('Cannot add board', err)
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
        const criteria = { _id: _getFormattedId(board._id) }

        const collection = await dbService.getCollection('board')
        await collection.updateOne(criteria, { $set: boardToSave })
        return board
    } catch (err) {
        logger.error(`Cannot update board ${board._id}`, err)
        throw err
    }
}

async function removeBoard(boardId) {
    // const { loggedinUser } = asyncLocalStorage.getStore()
    try {
        const criteria = { _id: new ObjectId(boardId) }
        const collection = await dbService.getCollection('board')
        await collection.deleteOne(criteria)
        return boardId
    } catch (err) {
        logger.error(`Cannot remove board ${boardId}`, err)
        throw err
    }
}

// GROUP

async function getGroupById(boardId, groupId) {
    try {
        const board = await getBoardById(boardId)
        if (!board) {
            throw new Error(`Could not find board by id: ${boardId}`)
        }
        return board.groups.find(group => group.id === groupId)

    } catch (err) {
        logger.error(`Cannot get group by id: ${groupId}`, err)
        throw err
    }
}

async function addGroup(boardId, pos) {
    try {
        const board = await getBoardById(boardId)
        if (!board) {
            throw new Error(`Could not find board by id: ${boardId}`)
        }
        const newGroup = {
            id: makeId(),
            title: 'New Group',
            archivedAt: null,
            pulses: [],
            style: { color: getRandomColor() },
            type: board.type,
        }
        if (pos === 'start') board.groups.unshift(newGroup)
        else board.groups.push(newGroup)

        await updateBoard(board)
        return newGroup
    } catch (err) {
        logger.error('Cannot add group', err)
        throw err
    }
}

async function duplicateGroup(boardId, group) {
    try {
        const board = await getBoardById(boardId)
        if (!board) {
            throw new Error(`Could not find board by id: ${boardId}`)
        }
        const duplicatedPulses = group.pulses.map(pulse => pulse = { ...pulse, id: makeId() })
        const duplicatedGroup = { ...group, id: makeId(), pulses: duplicatedPulses }
        board.groups.push(duplicatedGroup)

        await updateBoard(board)
        return duplicatedGroup
    } catch (err) {
        logger.error('Cannot duplicate group', err)
        throw err
    }
}

async function updateGroup(boardId, updatedGroup) {
    try {
        const board = await getBoardById(boardId)
        if (!board) {
            throw new Error(`Could not find board by id: ${boardId}`)
        }
        const groupToSave = {
            id: updatedGroup.id,
            title: updatedGroup.title || '',
            archivedAt: updatedGroup.archivedAt || null,
            type: updatedGroup.type || board.type,
            pulses: updatedGroup.pulses || [],
            style: updatedGroup.style || { color: getRandomColor() }
        }
        const updatedGroups = board.groups.map(group => group.id === groupToSave.id ? groupToSave : group)
        const newBoard = { ...board, groups: updatedGroups }

        await updateBoard(newBoard)
        // const criteria = { _id: _getFormattedId(boardId) }
        // const collection = await dbService.getCollection('board')
        // await collection.updateOne(criteria, { $set: newBoard })
        return groupToSave
    } catch (err) {
        logger.error(`Cannot update group ${groupToSave.id}`, err)
        throw err
    }
}

async function removeGroup(boardId, groupId) {
    try {
        const board = await getBoardById(boardId)
        if (!board) {
            throw new Error(`Could not find board by id: ${boardId}`)
        }
        const updatedGroups = board.groups.filter(group => group.id !== groupId)
        const newBoard = { ...board, groups: updatedGroups }

        await updateBoard(newBoard)
        return groupId
    } catch (err) {
        logger.error(`Cannot remove group ${groupId}`, err)
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


function _getFormattedId(id) {
    return (typeof id === 'string') ? new ObjectId(id) : id

    const convertedId = (typeof id === 'string') ? id : id.$oid;
    return new ObjectId(convertedId);
}

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