const routes = require('express').Router()
const multer = require('multer')

const multerConfig = require('./config/multer')
const auth = require('./auth')

const AuthController = require('./controllers/AuthController')
const UserController = require('./controllers/UserController')
const FileController = require('./controllers/FileController')
const BoxController = require('./controllers/BoxController')

routes.get('/', (req, res) => {
  return res.json({ status: 'alive' })
})

routes.post('/login', AuthController.login)
routes.get('/logout', auth, AuthController.logout)

routes.get('/user/:id', UserController.getUser)
routes.post('/user', UserController.create)
routes.put('/user', UserController.update)
routes.delete('/user', UserController.delete)

routes.post('/box', auth, BoxController.store)
routes.get('/box', auth, BoxController.getBoxes)
routes.get('/box/:id', auth, BoxController.getBox)
routes.delete('/box/:id', auth, BoxController.remove)
routes.put('/box/:id', auth, BoxController.update)

routes.get('/file', auth, FileController.getFiles)
routes.get('/file/:fileId', auth, FileController.getFile)

routes.delete('/box/:id/file/:fileId', auth, FileController.remove)
routes.post('/box/:id/file',
  auth,
  multer(multerConfig).single('file'),
  FileController.store
)

module.exports = routes
