import { userService } from './user.service.js'
import { logger } from '../../services/logger.service.js'
import { ObjectId } from 'mongodb'
import { socketService } from '../../services/socket.service.js'

export async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(400).send({ err: 'Failed to get users' })
    }
}

export async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(400).send({ err: 'Failed to get user' })
    }
}

export async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'User deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(400).send({ err: 'Failed to delete user' })
    }
}

export async function updateUser(req, res) {
    try {
        const user = req.body
        const userToUpdate = {
            _id: new ObjectId(user._id),
            fullname: user.fullname || '',
            imgUrl: user.imgUrl || "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png",
            updates: user.updates || []
        }
        const savedUser = await userService.update(userToUpdate)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(400).send({ err: 'Failed to update user' })
    }
}
