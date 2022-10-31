const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.phone = req.body.phone;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('user', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({
            "token": user.generateJwt(),
            "_id": user['_id']
        });
        // unknown user or wrong password
        else {
            return res.status(404).json(info);
        }
    })(req, res, next);
}

module.exports.userProfile = (req, res, next) => {
    User.findOne({
            _id: req._id
        },
        (err, user) => {
            if (!user)
                return res.status(404).json({
                    status: false,
                    message: 'User record not found.'
                });
            else
                return res.status(200).json({
                    status: true,
                    user: user
                });
        }
    );
}

module.exports.getUsers = (req, res, next) => {
    User.find((err, user) => {
        if (!user)
            return res.status(404).json({
                status: false,
                message: 'User record not found.'
            });
        else
            return res.status(200).json({
                status: true,
                user: user
            });
    }
);
}

module.exports.updateUserProfile = (req, res, next) => {
    User.findByIdAndUpdate({
        _id: req._id
    }, {
        fullName: req.body.fullname,
        email: req.body.email
    }, function (err, docs) {
        if (err) res.json(err);
        else {
            res.send(docs);
        }
    });
}