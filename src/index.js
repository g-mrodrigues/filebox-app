require('dotenv').config()
require('./database')

const express = require('express')
const morgan = require('morgan')

const path = require('path')
const helmet = require('helmet')
const passport = require('passport')
const cors = require('cors')
const app = express()
const isProduction = process.env.ENVIROMENT === 'production'

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(express.urlencoded({ extended: true }))

if (!isProduction) {
  app.use(morgan('dev'))
}

app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))

app.use(passport.initialize())
app.use(passport.session())

app.use(require('./routes'))

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).json({ message: err.message })
})

let server;

if (process.env.NODE_ENV != 'testing') {
  server = app.listen(process.env.HTTP_PORT, () => {
    return process.env.NODE_ENV != "testing" &&
    console.log('\x1b[33m%s\x1b[0m', 'Waiting for requests')
  });
}

module.exports = {
  app,
  server
}