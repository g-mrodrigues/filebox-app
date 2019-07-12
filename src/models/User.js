const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true
  },
  salt: {
    type: String,
    select: false,
    required: true
  },
  password: {
    type: String,
    select: false,
    required: true
  }
}, {
  timestamps: true
})

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.validatePassword = function (password) {
  const finalPassword = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.password === finalPassword
}

UserSchema.methods.generateJWT = function () {
  return jwt.sign({
    email: this.email,
    id: this._id
  },
  process.env.JWT_SECRET,
  {
    expiresIn: 3600
  })
}

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT()
  }
}

module.exports = mongoose.model('User', UserSchema)
