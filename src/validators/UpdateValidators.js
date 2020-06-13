const { body } = require('express-validator')
const User = require('../models/User')
const Greenhouse = require('../models/Greenhouse')

const validateUserUpdate = [
  body('name')
    .optional()
    .isString().withMessage('Nome do usuário inválido').bail()
    .isLength({ min: 3 }).withMessage('Nome do usuário precisa ter ao menos 3 caracteres'),
  body('email')
    .optional()
    .isEmail().withMessage('Email Invalido').bail()
    .custom(async (value, {req}) => {
      return await User.findOne({ email: value }).then(user => {
        if (user._id != req.params.id) {
          return Promise.reject('Ja existe um usuário cadastrado com esse email.')
        };
      })
    }),
  body('role')
    .optional()
    .isIn(['Admin', 'Grower', 'Watcher']).withMessage('Informe um papel válido'),
  body('password')
    .optional()
    .isLength({ min: 8, max: 24 }).withMessage('A senha precisa ter entre 8 e 24 caracteres').bail()
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/).withMessage('A senha precisa conter letras minusculas, ao menos 1 maiusculas e 1 número')
    .custom(async (value, { req }) => {
      if(req.body.password_confirmation == undefined) {
        return Promise.reject('A senha precisa ser confirmada');
      }
    }),
  body('password_confirmation')
    .optional()
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        return Promise.reject('Senha não confere')
      };
    })
]

const validateGreenhouseUpdate = [
  body('name')
    .optional()
    .isString().withMessage('Nome da Greenhouse inválido').bail()
    .isLength({ min: 3 }).withMessage('Nome da Greenhouse precisa ter ao menos 3 caracteres'),
  body('ip')
    .optional()
    .matches(/((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/)
    .withMessage('O IP informado é invalido')
]

module.exports = {
  validateUserUpdate,
  validateGreenhouseUpdate
}
