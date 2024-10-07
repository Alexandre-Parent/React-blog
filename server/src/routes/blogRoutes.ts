import express from 'express'
import controller from '../controllers/blogController'

const router = express.Router()

router.get('/read/:blogID', controller.read)
router.post('/create', controller.create)
router.post('/query',  controller.query)
router.patch('/update/:blogID',  controller.update) 
router.delete('/:blogID',  controller.deleteBlog)
router.get('/', controller.readAll)

export default router