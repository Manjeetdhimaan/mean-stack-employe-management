const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Admin = mongoose.model('Admin');

passport.use('user', 
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {
            User.findOne({ email: username },
                (err, user) => {
                    if (err)
                        return done(err);
                    // unknown user
                    else if (!user)
                        return done(null, false, { message: 'Email is not registered' });
                    // wrong password
                    else if (!user.verifyPassword(password))
                        return done(null, false, { message: 'Wrong password.' });
                    // authentication succeeded
                    else
                        return done(null, user);
                });
        })
);

passport.use('admin', 
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {
            Admin.findOne({ email: username },
                (err, user) => {
                    if (err)
                        return done(err);
                    // unknown user
                    else if (!user)
                        return done(null, false, { message: 'Email is not registered' });
                    // wrong password
                    else if (!user.verifyPassword(password))
                        return done(null, false, { message: 'Wrong password.' });
                    // authentication succeeded
                    else
                        return done(null, user);
                });
        })
);

passport.serializeUser(function (entity, done) {
    done(null, { id: entity.id, type: entity.type });
});

passport.deserializeUser(function (obj, done) {
    switch (obj.type) {
        case 'user':
            User.findById(obj.id)
                .then(user => {
                    if (user) {
                        done(null, user);
                    }
                    else {
                        done(new Error('user id not found:' + obj.id, null));
                    }
                });
            break;
        case 'admin':
            Admin.findById(obj.id)
                .then(device => {
                    if (device) {
                        done(null, device);
                    } else {
                        done(new Error('device id not found:' + obj.id, null));
                    }
                });
            break;
        default:
            done(new Error('no entity type:', obj.type), null);
            break;
    }
});