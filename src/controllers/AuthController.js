const passport = require('passport');

const AuthController = {
  login(req, res, next) {
    const { body: user } = req;

    if(!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    return passport.authenticate(
      'local', 
      { session: false },
      (err, passportUser, info) => {
        if(err) {
          return next(err);
        }

        if(passportUser) {
          const user = passportUser;
          req.user = user;
          return res.json({ user: user.toAuthJSON() });
        }

        return res.status(400).info;
      }
    )(req, res, next);
  },

  async logout(req, res) {
    req.logout();
    return res.json({
      token:null
    });
  }
}

module.exports = AuthController;
