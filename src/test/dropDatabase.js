require('dotenv').config()
const mongoose = require('mongoose');

/* Connect to the DB */
mongoose.connect(process.env.MONGODB_DSN_TEST, () => {
    /* Drop the DB */
    mongoose.connection.db.dropDatabase();
});