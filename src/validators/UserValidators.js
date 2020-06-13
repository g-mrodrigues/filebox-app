const { body } = require('express-validator')
const User = require('../models/User')

const validateUserCreate = [
  body('name')
    .exists().withMessage('Name is missing').bail()
    .isString().withMessage('Given name is invalid').bail()
    .isLength({ min: 3 }).withMessage('Name must be at least 3 letters'),
  body('email')
    .exists().withMessage('Email is missing').bail()
    .isEmail().withMessage('Given email is invalid').bail()
    .custom(async value => {
      return await User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('There\'s an account registered with this email already')
        }
      })
    }),
  body('password')
    .exists().withMessage('Password is missing').bail()
    .isLength({ min: 8, max: 24 }).withMessage('Password must be between 8 and 24 characters').bail()
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/).withMessage('The password must constain at least one uppercase letter and one number'),
  body('password_confirmation')
    .exists().withMessage('Password confirmation is missing').bail()
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        return Promise.reject('Password is not matching')
      }
    })
]

module.exports = validateUserCreate
