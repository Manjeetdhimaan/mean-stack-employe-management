const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const Admin = mongoose.model('Admin');
const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    var admin = new Admin();
    admin.fullName = req.body.fullName;
    admin.email = req.body.email;
    admin.password = User.hashPassword(req.body.password);
    admin.save((err, doc) => {
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
    passport.authenticate('admin', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) {
            return res.status(200).json({
                "token": user.generateJwt(),
                "_id": user['_id']
            });
        }
          
        // unknown user or wrong password
        else {
            return res.status(404).json(info);
        }
    })(req, res, next);
}

module.exports.adminProfile = (req, res, next) => {
    Admin.findOne({
            _id: req._id
        },
        (err, admin) => {
            if (!admin)
                return res.status(404).json({
                    status: false,
                    message: 'Admin record not found.'
                });
            else
                return res.status(200).json({
                    status: true,
                    user: admin
                });
        }
    );
}

module.exports.getUsers = (req, res, next) => {
    User.find((err, users) => {
        if (!users)
            return res.status(404).json({
                status: false,
                message: 'User record not found.'
            });
        else
            return res.status(200).json({
                status: true,
                users: users
            });
    }
);
}

module.exports.updateUserProfile = (req, res, next) => {
    Admin.findByIdAndUpdate({
        _id: req._id
    }, {
        fullName: req.body.fullName,
        email: req.body.email
    }, function (err, docs) {
        if (err) res.json(err);
        else {
            res.send(docs);
        }
    });
}


module.exports.checkIn = async(req, res, next) => {
    try {
        const data = {
            entry: Date.now()
        };
        const user = await User.findOne({
            _id: req.params.id
        });
        //if the user has an attendance array;
        if (user.attendance || user.attendance.length > 0) {
            //for a new checkin attendance, the last checkin
            //must be at least 24hrs less than the new checkin time;

            // const lastCheckInTimestamp = lastCheckIn.date;

            // var ts = Math.round(new Date().getTime() / 1000);
            // var tsYesterday = ts - (24 * 3600);
            // console.log(Date.now(), lastCheckInTimestamp);
            // if(ts<tsYesterday){

            // }
            var lastCheckIn = user.attendance[user.attendance.length - 1];
            if (!lastCheckIn) {
                lastCheckIn = {
                    exit: {
                        exitType: 'Full day',
                        time: new Date()
                    },
                    entry: new Date().setHours(-24, 0, 0, 0),
                    _id: ("616fd18fc902ba3a12893ab4"),
                    date: Date.now()
                }
            }
            if (!lastCheckIn.exit.time) {
                return res.status(406).send(`Please checkout ${user.fullName}\'s previous check in first`)
            }
            let nextMidNight = new Date();
            nextMidNight.setHours(24, 0, 0, 0);
            let pastMidNight = new Date();
            pastMidNight.setHours(0, 0, 0, 0);
            // const lastAttendance = user.attendance[user.attendance.length - 1];
            // console.log(lastAttendance.entry<nextMidNight)
            //if (pastMidNight>lastAttendance.entry){}
            // Date.now() > lastCheckInTimestamp
            if (pastMidNight > lastCheckIn.entry) {
                user.attendance.push(data)
                await user.save();
                res.status(200).json(user);

            } else {
                return res.status(406).send(`${user.fullName} have signed in today already`)
            }
        } else {
            user.attendance.push(data);
            await user.save();
        }

    } catch (error) {
        console.log("something went wrong");
        console.log(error);
    }
};


//check out
module.exports.checkOut =  async(req, res, next) => {
    // the attendance than can be checked out must be last entry in the attendance array
    try {
        const user = await User.findOne({
            _id: req.params.id
        });

        //check if there is an attendance entry
        if (user.attendance && user.attendance.length > 0) {

            //check whether the exit time of the last element of the attedance entry has a value
            const lastAttendance = user.attendance[user.attendance.length - 1];
            if (lastAttendance.exit.time) {
               return res.status(406).send(`${user.fullName} has already checked out today`);
            }
            
            lastAttendance.exit.time = Date.now();
            lastAttendance.exit.exitType = req.body.exitType;
            await user.save();
            res.status(200).json(user)

        } else { //if no entry
            return res.status(401).send(`${user.fullName} do not have an attendance entry`)
        }
    } catch (error) {
        console.log('Cannot find User');
    }
};



module.exports.respondToLeaves =  (req, res, next) => {
    const id = req.params.id;
    if (req.params.id === req._id) {
        return res.status(401).send({ message: 'You Are not authorized'});
    }
    User.findOne({
        _id: id
    }, (err, foundedObject) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        } else {
            if (!foundedObject) {
                return res.status(404).send();
            } else {
                let leaveArray = [];;
                foundedObject.leaves.map(a => {
                    leaveArray.push(a)
                })
                leaveArray.map(n => {
                    if (n['_id'] == req.body.leaveId) {
                        leaveArray[leaveArray.indexOf(n)].status = req.body.status
                        let to = leaveArray[leaveArray.indexOf(n)].to;
                        let from = leaveArray[leaveArray.indexOf(n)].from;
                        let diff = (to.getDate() - from.getDate()) + 1;
                        if (leaveArray[leaveArray.indexOf(n)].status == "Denied" && req.body.prevStatus !== "Pending") {
                            if (foundedObject.appliedLeaves > 0) {
                                // foundedObject.appliedLeaves = Number(foundedObject.appliedLeaves) - Number(diff);
                                if (foundedObject.remainingLeaves <= 24) {
                                    foundedObject.remainingLeaves = Number(foundedObject.totalLeaves) + Number(diff);
                                    foundedObject.totalLeaves = Number(foundedObject.remainingLeaves)
                                        // foundedObject.appliedLeaves = leaveArray.length
                                }
                            }
                        }
                        if (leaveArray[leaveArray.indexOf(n)].status === "Approved") {
                            // foundedObject.appliedLeaves = Number(foundedObject.appliedLeaves) + Number(diff);
                            foundedObject.remainingLeaves = Number(foundedObject.totalLeaves) - Number(diff);
                            foundedObject.totalLeaves = Number(foundedObject.remainingLeaves)
                                // foundedObject.appliedLeaves = leaveArray.length
                        }
                    }
                })
                foundedObject.save((err, updatedObject) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).send();
                    } else {
                        return res.send(updatedObject)
                    }
                })
            }
        }
    })
}


module.exports.getUser = (req, res, next) => {
    User.findOne({
            _id: req.params.id
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