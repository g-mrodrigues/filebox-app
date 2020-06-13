const User = require('../models/User')
const Box = require('../models/Box')

const BoxController = {
  async store (req, res) {
    const { title } = req.body

    const box = await Box.create({
      title
    })

    if (box) {
      const user = await User.findById(req.user)

      if (!user) { res.status(500).send({ error: 'There\'s an error while processing your request' }) }

      user.boxes.push(box)
      await user.save()
    }

    return res.json({ box })
  },

  async remove (req, res) {
    const box = await Box.findById(req.params.id)
    const user = await User.findById(req.user)

    if (!user || !box) { res.status(500).send({ error: 'There\'s an error while processing your request' }) }

    user.boxes.pull(box)
    await user.save()
    await box.remove()

    return res.send({ response: 'success' })
  },

  async update (req, res) {
    try {
      const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('title createdAt')
      return res.send({ box })
    } catch (e) {
      res.status(500).send({ error: 'There\'s an error while processing your request' })
      console.log(e)
    }
  },

  async getBox (req, res) {
    const box = await Box.findById(req.params.id, 'title createdAt').populate({
      path: 'files',
      select: 'name size url createdAt',
      options: {
        sort: {
          createdAt: -1
        }
      }
    })

    if (box) {
      return res.json({ box })
    }

    return res.status(404).json({ message: 'Not Found' })
  },

  async getBoxes (req, res) {
    const user = await User.findById(req.user).populate({
      path: 'boxes',
      select: 'title filesCount createdAt',
      options: {
        sort: {
          createdAt: -1
        }
      },
      populate: {
        path: 'files',
        select: 'name size url createdAt',
        options: {
          sort: {
            createdAt: -1
          }
        }
      }
    })

    const boxes = user.boxes
    return res.json({ boxes })
  }
}

module.exports = BoxController
