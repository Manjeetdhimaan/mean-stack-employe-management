const mongoose = require('mongoose');
const mongoConfig = require('../config/config.json')

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true }, (err) => {
    if (!err) { console.log('MongoDB connection succeeded.'); }
    else { console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2)); }
});

require('./user.model');
require('./admin.model');