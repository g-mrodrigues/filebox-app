const User = require('../models/User')
const Box = require('../models/Box')

const BoxController = {
  async store (req, res) {
    const { name } = req.box

    const box = await Box.create({
      name
    })

    if (box) {
      const user = await User.findById(req.user)

      if (!user) { res.status(500).send({ error: 'There\'s an error while processing your request' }) }

      user.boxes.push(box)
      await user.save()
    }

    return res.json(box)
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
    const box = await Box.findById(req.params.id)

    if (!box) { res.status(500).send({ error: 'There\'s an error while processing your request' }) }

    box.update(req.body)

    return res.send({ response: 'success' })
  },

  getBox (req, res) {
    const box = Box.findById(req.params.id)

    if (box.id) {
      return res.json({ box })
    }

    return res.status(404).json({ message: 'Not Found' })
  },

  async getBoxes (req, res) {
    const user = await User.findById(req.user).populate({
      path: 'boxes',
      options: {
        sort: {
          createdAt: -1
        }
      }
    })
    const boxes = user.boxes
    return res.json({ boxes })
  }
}

module.exports = BoxController
