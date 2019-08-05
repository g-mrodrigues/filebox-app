const routes = require('express').Router()
const multer = require('multer')

const multerConfig = require('./config/multer')
const auth = require('./auth')

const AuthController = require('./controllers/AuthController')
const UserController = require('./controllers/UserController')
const PostController = require('./controllers/PostController')

routes.get('/', (req, res) => {
  return res.json({ status: 'alive' })
})

routes.post('/user/login', AuthController.login)

routes.post('/user/create', UserController.create)

routes.get('/user/logout', auth, AuthController.logout)

routes.get('/posts', auth, PostController.getPosts)

routes.get('/posts/:id', auth, PostController.getPost)

routes.delete('/posts/:id', auth, PostController.remove)

routes.post('/posts',
  auth,
  multer(multerConfig).single('file'),
  PostController.store
)

module.exports = routes
