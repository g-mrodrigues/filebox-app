/* eslint-disable class-methods-use-this */
require('./../config/passport')
const passport = require('passport')
const { validationResult } = require('express-validator')

class Auth {
  async login (req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    return await passport.authenticate(
      'local',
      { session: false },
      (err, passportUser, info) => {
        console.log(err)
        if (err) {
          throw new Error(err)
        }

        if (passportUser) {
          const user = passportUser
          user.token = passportUser.generateJWT()

          return res.json({ user: user.toAuthJSON() })
        }
        console.log(info)
        return res.status(400)
      }
    )(req, res, next)
  }

  logout (req, res) {
    return res.json({ token: '' })
  }
}

module.exports = new Auth()
