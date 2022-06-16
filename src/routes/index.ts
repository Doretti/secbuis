import express, { Router } from 'express'
import auth from './auth.route'
import users from './users.route'

const router: Router = express.Router()

router.use(auth)
router.use(users)

export default router