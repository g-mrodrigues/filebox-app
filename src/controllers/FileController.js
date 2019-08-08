const File = require('../models/File')
const Box = require('../models/Box')

const FileController = {
  async store (req, res) {
    const { originalname: name, size, key, location: url = '' } = req.file

    const file = await File.create({
      name,
      size,
      key,
      url
    })

    if (file) {
      const box = await Box.findById(req.params.id)

      if (!box) { res.status(500).send({ error: 'There\'s an error while processing your request' }) }

      box.files.push(file)
      await box.save()
    }

    return res.json(file)
  },

  async remove (req, res) {
    const box = await Box.findById(req.params.id)
    const file = await File.findById(req.params.fileId)

    if (!box || !file) { res.status(500).send({ error: 'There\'s an error while processing your request' }) }

    box.files.pull(file)
    await box.save()
    await file.remove()

    return res.send({ response: 'success' })
  },

  async getFile (req, res) {
    const file = await File.findById(req.params.fileId).select('name size url createdAt')

    if (file) {
      return res.json({ file })
    }

    return res.status(404).json({ message: 'Not Found' })
  },

  async getFiles (req, res) {
    const box = await Box.findById(req.params.id).populate({
      path: 'files',
      select: 'name size url createdAt',
      options: {
        sort: {
          createdAt: -1
        }
      }
    })
    const files = box.files
    return res.json({ files })
  }
}

module.exports = FileController
