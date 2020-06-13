const { body } = require('express-validator')

const validateUserLogin = [
  body('email')
    .exists().withMessage('User email is missing').bail()
    .isEmail().withMessage('Invalid email').bail(),
  body('password')
    .exists().withMessage('User password is missing').bail()
    .isLength({ min: 8, max: 24 }).withMessage('Password Invalid')
]

module.exports = validateUserLogin;
