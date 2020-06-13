const mongoose = require('mongoose')
const User = mongoose.model('User')

class UserRepository {
  async createUser (userData) {
    const user = new User(userData)

    user.setPassword(userData.password)

    return await user.save()
      .then((user) => {
        return user.getPublicFields();
      })
  }

  async find (_id) {
    return await User.findOne({ _id })
      .then((user) => {
        return user.getPublicFields()
      })
  }

  async update (_id, body) {
    const user = await User.findOne({ _id })

    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        const command = `user.${key} = body.${key}`
        eval(command)
      }
    }

    return await user.save().then((user) => {
      return user.getPublicFields()
    })
  }

  async delete (_id) {
    await User.deleteOne({ _id }, function (err) {
      if (err) {
        throw new Error(err)
      }
    })

    return { deleted: true }
  }

  async findToAuthenticate (email) {
    return await User.findOne({ email: username }).select('+password').select('+salt');
  }
}

module.exports = new UserRepository();