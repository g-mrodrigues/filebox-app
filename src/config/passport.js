const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./../models/User')

passport.serializeUser(function (user, cb) {
  cb(null, user.id)
})

passport.deserializeUser(function (id, cb) {
  User.find(id, function (err, user) {
    cb(err, user)
  })
})

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (username, password, done) => {
  User.findOne({ email: username }).select('+password').select('+salt')
    .then((user) => {
      if (!user || !user.validatePassword(password)) {
        return done(null, false, { error: { 'Email or Password': 'Is invalid' } })
      }
      return done(null, user)
    }).catch(done)
}))