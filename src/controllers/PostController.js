const Post = require('../models/Post')

const PostController = {
  async store (req, res) {
    const { originalname: name, size, key, location: url = '' } = req.file

    const post = await Post.create({
      name,
      size,
      key,
      url
    })

    return res.json(post)
  },

  async remove (req, res) {
    const post = await Post.findById(req.params.id)
    post.remove()
    return res.send({ response: 'success' })
  },

  getPost (req, res) {
    const post = Post.findById(req.params.id)

    if (post.id) {
      return res.json({ post })
    }

    return res.status(404).json({ message: 'Not Found' })
  },

  async getPosts (req, res) {
    const posts = await Post.find({})
    return res.json({ posts })
  }
}

module.exports = PostController
