require('./config/config');
require('./models/db');
require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const compression = require('compression')

const PORT = process.env.PORT || 3200;

const rtsIndex = require('./routes/index.router');
const rtsAdmin = require('./routes/admin.router');

const app = express();
app.use(cors());
app.use(compression())

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use('/api', rtsIndex);
app.use('/api/admin', rtsAdmin);



// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.static(path.join(__dirname, 'www')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/index.html'));
});

// start server
app.listen(PORT, () => console.log(`Server started at port : ${PORT}`));