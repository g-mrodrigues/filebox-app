require('dotenv').config()
require('./config/passport')

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const app = express()

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true
})
mongoose.Promise = global.Promise
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

app.use(require('./routes'))

app.listen(3000)
