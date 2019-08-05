const jwt = require('jsonwebtoken')

const VerifyJwtToken = async (req, res, next) => {
  const { authorization } = req.headers

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    const token = authorization.split(' ')[1]

    await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) { return res.status(401).send({ error: 'Invalid Token' }) }

      req.user = decoded.id
    })

    return next()
  }

  return res.status(401).send({ error: 'Invalid Token' })
}

module.exports = VerifyJwtToken
