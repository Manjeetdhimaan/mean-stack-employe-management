const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const Admin = mongoose.model('Admin');
const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    try {
        const admin = new Admin();
        admin.fullName = req.body.fullName;
        admin.email = req.body.email;
        admin.password = req.body.password;
        admin.save((err, doc) => {
            if (!err)
                res.status(200).send({
                    success: true,
                    message: 'Registration Successfull!'
                });
            else {
                if (err.code == 11000)
                    res.status(422).send({
                        success: false,
                        message: 'Duplicate email adrress found.'
                    });
                else
                    return next(err);
            }

        });
    } catch (err) {
        return next(err);
    }
}

module.exports.registerEmp = (req, res, next) => {
    try {
        let user = new User();
        user.fullName = req.body.fullName;
        user.email = req.body.email;
        user.password = req.body.password;
        // user.password = User.hashPassword(req.body.password);
        user.phone = req.body.phone;
        user.service = req.body.service;
        user.joindate = req.body.joindate;
        user.save((err, doc) => {
            if (!err)
                res.status(200).send({
                    success: true,
                    message: 'Registration succussful!'
                });
            else {
                if (err.code == 11000)
                    res.status(422).send({
                        success: false,
                        message: 'Duplicate email adrress found.'
                    });
                else
                    return next(err);
            }

        });
    } catch (err) {
        return next(err);
    }

}

module.exports.authenticate = (req, res, next) => {
    try {
        passport.authenticate('admin', (err, adminUser, info) => {
            // error from passport middleware
            if (err) {
                return res.status(400).json(err)
            }
            // registered user
            else if (adminUser) {
                return res.status(200).json({
                    "token": adminUser.generateJwt(),
                });
            }
            // unknown user or wrong password
            else {
                return res.status(404).json(info);
            }
        })(req, res, next);
    } catch (err) {
        return next(err);
    }
    // call for passport authentication

}

module.exports.adminProfile = (req, res, next) => {
    try {
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
    } catch (err) {
        return next(err);
    }
}

module.exports.getUsers = async (req, res, next) => {

    let counts = 0;
    try {
        await User.count({}, (err, countDOC) => {
            counts = countDOC

        }).clone()
    } catch (err) {
        return next(err);
    }


    try {
        User.find((err, users) => {
                if (!users) {
                    return res.status(404).json({
                        status: false,
                        message: 'No data found.'
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        users: users,
                        counts: counts
                    });
                }

            }).limit(req.params.perPage)
            .skip(+req.params.perPage * +(req.params.page - 1))

    } catch (err) {
        return next(err);
    }
}

module.exports.updateUserProfile = (req, res, next) => {
    try {

        Admin.findOne({
            _id: req._id
        }, (err, foundedObject) => {
            if (err) {
                console.log(err);
                res.status(500).send();
            } else {
                if (!foundedObject) {
                    res.status(404).send();
                } else {
                    if (req.body.firstName && req.body.lastName) {
                        foundedObject.fullName = req.body.firstName + ' ' + req.body.lastName;
                    }
                    if (req.body.email) {
                        foundedObject.email = req.body.email;
                    }
                    if (req.body.password) {
                        foundedObject.password = Admin.hashPassword(req.body.password);
                    }
                    if (req.body.bio) {
                        foundedObject.bio = req.body.bio;
                    }
                    foundedObject.save((err, updatedObject) => {
                        if (err) {
                            console.log(err)
                            res.status(500).send();
                        } else {
                            res.status(200).send({
                                success: true,
                                message: 'Profile updated successfully'
                            })
                        }
                    })
                }
            }
        })

        // Admin.findByIdAndUpdate({
        //     _id: req._id
        // }, {

        //     fullName: req.body.fullName,
        //     email: req.body.email
        // }, function (err, docs) {
        //     if (err) res.json(err);
        //     else {
        //         res.send(docs);
        //     }
        // });

    } catch (err) {
        return next(err);
    }
}

module.exports.checkIn = async (req, res, next) => {
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
                return res.status(406).send({
                    success: false,
                    message: `Please checkout ${user.fullName}\'s previous check in first`
                })
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
                res.status(200).json({
                    success: true,
                    message: `${user.fullName} signed in successfully`
                });

            } else {
                return res.status(406).send({
                    success: false,
                    message: `${user.fullName} have signed in today already`
                })
            }
        } else {
            user.attendance.push(data);
            await user.save();
        }

    } catch (error) {
        console.log(error);
        return next(error);
    }
};

//check out
module.exports.checkOut = async (req, res, next) => {
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
                return res.status(406).send({
                    success: false,
                    message: `${user.fullName} has already checked out today`
                });
            }

            lastAttendance.exit.time = Date.now();
            lastAttendance.exit.exitType = req.body.exitType;
            await user.save();
            return res.status(200).json({
                success: true,
                message: `${user.fullName} checked out successfully`
            })

        } else { //if no entry
            return res.status(401).send(`${user.fullName} do not have an attendance entry`)
        }
    } catch (error) {

        console.log('Cannot find User');
        return next(error);
    }
};


module.exports.respondToLeaves = (req, res, next) => {
    try {
        const id = req.params.id;
        if (req.params.id === req._id) {
            return res.status(401).send({
                message: 'You Are not authorized'
            });
        }
        User.findOne({
            _id: id
        }, (err, foundedObject) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    success: false,
                    message: 'Something went wrong! Please try again later.'
                });
            } else {
                if (!foundedObject) {
                    return res.status(404).send({
                        success: false,
                        message: 'Cannot find user with this name or ID'
                    });
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
                            return res.status(500).send({
                                success: false,
                                message: 'An error occured! Please try again after sometime'
                            });
                        } else {
                            return res.status(200).send({
                                success: true,
                                message: 'Leave ' + req.body.status,
                                user: updatedObject
                            })
                        }
                    })
                }
            }
        })
    } catch (err) {
        return next(err);
    }
}

module.exports.getUser = (req, res, next) => {
    try {
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
    } catch (err) {
        return next(err);
    }
}

module.exports.changePassword = (req, res, next) => {
    try {
        Admin.findOne({
            _id: req._id
        }, (err, admin) => {
            // Check if error connecting
            if (err) {
                return res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if user was found in database
                if (!admin) {
                    return res.status(404).json({
                        success: false,
                        message: 'Admin not found'
                    }); // Return error, user was not found in db
                } else {
                    if (!admin.verifyPassword(req.body.oldPassword)) {
                        return res.status(401).json({
                            success: false,
                            message: 'Admin Old password is incorrect'
                        });
                    }
                    if (req.body.newPassword !== req.body.confirmNewPassword) {
                        return res.status(401).json({
                            success: false,
                            message: 'Paswords do no match'
                        });
                    }
                    admin.password = req.body.newPassword;
                    admin.save((err, doc) => {
                        if (!err)
                            return res.status(200).send({
                                success: true,
                                message: 'Admin password Changed succussfully'
                            });
                        else {
                            return next(err);
                        }

                    });
                }
            }
        });
    } catch (err) {
        return next(err);
    }
}

module.exports.createPayroll = (req, res) => {
    try {
        Admin.findOne({
            _id: req._id
        }).then(admin => {
            if (!admin) {
                return res.status(401).send({
                    success: false,
                    message: 'Not Authorized'
                })
            }
            const data = {
                month: req.body.month,
                basic: req.body.basic,
                da: req.body.da,
                hra: req.body.hra,
                wa: req.body.wa,
                ca: req.body.ca,
                cca: req.body.cca,
                ma: req.body.ma,
                SalesIncentive: req.body.SalesIncentive,
                LeaveEncashment: req.body.LeaveEncashment,
                HolidayWages: req.body.HolidayWages,
                SpecialAllowance: req.body.SpecialAllowance,
                Bonus: req.body.Bonus,
                IndividualIncentive: req.body.IndividualIncentive,
                pf: req.body.pf,
                esi: req.body.esi,
                tds: req.body.tds,
                lop: req.body.lop,
                pt: req.body.pt,
                SPL_Deduction: req.body.SPL_Deduction,
                ewf: req.body.ewf,
                cd: req.body.cd,
                totalEarning: req.body.totalEarnings,
                totalDeductions: req.body.totalDeductions,
                netPay: req.body.netPay,
            };

            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    if (!data[key] || data[key] === '' || data[key] === null)
                        return res.status(400).json({
                            message: `${key.toUpperCase()} value is missing! All the fields are required`
                        })
                }
            }
            let checkMonth = '';
            User.findOne({
                _id: req.params.id
            }).then(user => {
                if (user._id.toString() === req._id.toString()) {
                    return res.status(401).send({
                        success: false,
                        message: 'You are not authorized'
                    })
                }
                user.payroll.map((a) => {
                    if (data.month == a.month) {
                        checkMonth = "checked";
                        return res.status(422).json({
                            message: `${user.fullName}'s salary slip already created for ${data.month}`
                        })
                    }
                })
                if (checkMonth !== "checked") {
                    user.payroll.push(data)
                    user.save();
                    return res.status(200).json({
                        message: `${user.fullName}'s salary slip created successfully for ${data.month}`
                    });
                }
            }).catch(err => {
                console.log(err)
            });
        }).catch(err => {
            return res.status(401).send({
                success: false,
                message: 'Not Authorized'
            })
        })
    } catch (error) {
        console.log(error);
        console.log('Cannot find User');
        return res.status(500).json({
            message: 'Cannot find User'
        })

    }
};