import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'

import { login, signup, logout } from './auth.controller.js'

const router = express.Router()

router.post('/login', log, login)
router.post('/signup', signup)
router.post('/logout',log, logout)

export const authRoutes = router