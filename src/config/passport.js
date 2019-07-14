const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserEntity = require('../models/User');

module.exports = passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  UserEntity.findOne({ email: email }).select('+password').select('+salt')
    .then((user) => {
      if(!user) {
        return done(null, false, { errors: { 'email': 'is invalid' } });
      }

      if(!user.validatePassword(password)) {
        return done(null, false, { errors: { 'password': 'is invalid' } });
      }
      
      return done(null, user);
    }).catch(done);
}));