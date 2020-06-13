const mongoose = require('mongoose')

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const mongoDsn = process.env.NODE_ENV === 'testing' ? process.env.MONGODB_DSN_TEST : process.env.MONGODB_DSN;

connection = mongoose.connect(mongoDsn)
  .catch(error => {
    throw new Error(error)
  })

mongoose.Promise = global.Promise

module.exports = mongoose