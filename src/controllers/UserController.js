const User = require('../models/User');

const UserController = {
  async create (req, res) {
    const { body : user } = req;
    
    if(!user.name) {
      return res.status(422).json({
        errors: {
          name: 'is required',
        },
      });
    }
  
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
    
  if(!user.password_confirmation) {
    return res.status(422).json({
      errors: {
        password_confirmation: 'is required',
      }
    })
  }
  
  if(user.password !== user.password_confirmation) {
    return res.status(422).json({
      errors: {
        password: 'needs match',
        password_confirmation: 'needs match',
      }
    })
  }

  const finalUser = await new User(user);
  finalUser.setPassword(user.password);

  return await finalUser.save()
    .then(() =>
      res.json({ user: finalUser.toAuthJSON() }
    ));
  }
}

module.exports = UserController;
