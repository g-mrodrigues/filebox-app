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

routes.get('/user/logout', auth.required, AuthController.logout)

routes.get('/posts', auth.required, PostController.getPosts)

routes.get('/post/:id', auth.required, PostController.getPost)

routes.delete('/post/:id', auth.required, PostController.remove)

routes.post('/posts',
  auth.required,
  multer(multerConfig).single('file'),
  PostController.store
)

module.exports = routes
