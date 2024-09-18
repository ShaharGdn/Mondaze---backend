import {logger} from './logger.service.js'
import {Server} from 'socket.io'

var gIo = null

export function setupSocketAPI(http) {
    gIo = new Server(http, {
        cors: {
            origin: '*',
        }
    })

    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`)

        // When the client disconnects
        socket.on('disconnect', () => {
            logger.info(`Socket disconnected [id: ${socket.id}]`)
        })
        // pulse sockets
        socket.on('add-pulse', data => {
            console.log('Emitting add-pulse event:', data)
            socket.broadcast.emit('add-pulse', data)
        })
        socket.on('update-pulse', data => {
            console.log('Emitting update-pulse event:', data)
            socket.broadcast.emit('update-pulse', data)
        })
        socket.on('remove-pulse', data => {
            console.log('Emitting remove-pulse event:', data)
            socket.broadcast.emit('remove-pulse', data)
        })

        // group sockets
        socket.on('add-group', data => {
            console.log('Emitting add-group event:', data)
            socket.broadcast.emit('add-group', data)
        })
        socket.on('update-group', data => {
            console.log('Emitting update-group event:', data)
            socket.broadcast.emit('update-group', data)
        })
        socket.on('remove-group', data => {
            console.log('Emitting remove-group event:', data)
            socket.broadcast.emit('remove-group', data)
        })

        // board sockets
        socket.on('add-board', data => {
            console.log('Emitting add-board event:', data)
            socket.broadcast.emit('add-board', data)
        })
        socket.on('update-board', data => {
            console.log('Emitting update-board event:', data)
            socket.broadcast.emit('update-board', data)
        })
        socket.on('remove-board', data => {
            console.log('Emitting remove-board event:', data)
            socket.broadcast.emit('remove-board', data)
        })


        socket.on('set-user-socket', userId => {
            logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
            socket.userId = userId
        })
        socket.on('unset-user-socket', () => {
            logger.info(`Removing socket.userId for socket [id: ${socket.id}]`)
            delete socket.userId
        })
    })
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label.toString()).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
    userId = userId.toString()
    const socket = await _getUserSocket(userId)

    if (socket) {
        logger.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    }else {
        logger.info(`No active socket for user: ${userId}`)
        // _printSockets()
    }
}

// If possible, send to all sockets BUT not the current socket 
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
    userId = userId.toString()
    
    logger.info(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}

async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

export const socketService = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo, 
    // emit to a specific user (if currently active in system)
    emitToUser, 
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}
