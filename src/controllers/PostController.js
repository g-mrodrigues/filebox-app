const Post = require('../models/Post')
const User = require('../models/User')

const PostController = {
  async store (req, res) {
    const { originalname: name, size, key, location: url = '' } = req.file

    const post = await Post.create({
      name,
      size,
      key,
      url
    })

    if (post) {
      const user = await User.findById(req.user)

      if (!user) { res.status(500).send({ error: 'There\'s an error while processing your request' }) }

      user.posts.push(post)
      await user.save()
    }

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
    const user = await User.findById(req.user).populate({
      path: 'posts',
      options: {
        sort: {
          createdAt: -1
        }
      }
    })
    const posts = user.posts
    return res.json({ posts })
  }
}

module.exports = PostController
