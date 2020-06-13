const User = require('../models/User')

const AuthController = {
  login (req, res, next) {
    const { email, password } = req.body

    if (!email) {
      return res.status(422).json({
        error: {
          email: 'is required'
        }
      })
    }

    if (!password) {
      return res.status(422).json({
        error: {
          password: 'is required'
        }
      })
    }

    User.findOne({ email }).select('+password').select('+salt')
      .then((user) => {
        if (!user) {
          return res.status(422).send({ error: { email: 'is invalid' } })
        }

        if (!user.validatePassword(password)) {
          return res.status(422).send({ error: { password: 'is invalid' } })
        }

        return res.json({ user: user.toAuthJSON() })
      }).catch((res) => {
        res.status(400).send({ error: 'There\'s an error while processing your request' })
      })
  },

  logout (req, res) {
    return res.json({
      token: null
    })
  }
}

module.exports = AuthController
