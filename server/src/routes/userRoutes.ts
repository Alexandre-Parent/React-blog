import express from 'express'
import controller from '../controllers/userController'
import extractFirebaseInfos from '../middleware/extratFirebaseInfo'

const router = express.Router()

router.get('/validate', extractFirebaseInfos, controller.validate)
router.get('/:userID', controller.read)
router.post('/create', extractFirebaseInfos, controller.create)
router.post('/login', extractFirebaseInfos, controller.login)
router.get('/', controller.readAll)

export default router