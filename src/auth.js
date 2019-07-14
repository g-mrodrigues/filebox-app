const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  const { headers: authorization } = req;
  
  if(authorization && authorization.token !== undefined) {
    return authorization.token
  }
  return null;
};

const auth = {
  required: jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    passReqToCallback: true
  }),
  optional: jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    passReqToCallback: true
  }),
};

module.exports = auth;