const User = require('../models/User')
const { validationResult } = require('express-validator')
const UserRepository = require('./../repositories/UserRepository');

class UserController {
  async create (req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    
    const user = await UserRepository.createUser(req.body)
    res.json(user)
  }

  async getUser (req, res) {
    const user = await UserRepository.find(req.params.id);

    if (!user) { 
      res.status(500).send({ error: 'There\'s an error while processing your request' })
    }

    return res.send({ user })
  }

  update (req, res) {
    // TODO UPDATE USER
  }

  delete (req, res) {
    // TODO DELETE USER
  }
}

module.exports = new UserController()
