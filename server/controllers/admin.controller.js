const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const Admin = mongoose.model('Admin');
const User = mongoose.model('User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const AdminNotification = mongoose.model('AdminNotification');

const {
    generateOTP,
    sendOtpToMail,
    verifyOtp,
    sendLeaveResponseMail
} = require("../util/otp.util");

module.exports.register = async (req, res, next) => {
    try {
        if (await adminExists(req.body.email)) {
            Admin.findOne({
                email: req.body.email
            }).then(foundedAdmin => {
                if (foundedAdmin['role'] === "Admin") {
                    return res.status(409).json({
                        success: false,
                        message: 'Account with this email address exists already!'
                    })
                } else if (foundedAdmin['role'] !== "Admin") {
                    const otp = generateOTP(6);
                    foundedAdmin.phoneOtp = otp;
                    foundedAdmin.save((err, doc) => {
                        if (!err) {
                            sendOtpToMail(foundedAdmin, otp)
                            // setTimeout(() => {
                            //     foundedAdmin.phoneOtp = null;
                            //     foundedAdmin.save();
                            // }, 2*60*1000);
                            return res.status(200).send({
                                success: true,
                                message: 'Otp sent to Admin email!',
                                _id: foundedAdmin._id
                            });

                        }
                        return next(err);
                    });
                }
            }).catch(err => next(err));

        } else {
            const admin = new Admin();
            admin.fullName = req.body.fullName;
            admin.email = req.body.email;
            admin.password = Admin.hashPassword(req.body.password);
            // admin.role = "Admin";
            // generate otp

            const otp = generateOTP(6);
            // save otp to user collection
            admin.phoneOtp = otp;
            admin.save((err, doc) => {
                if (!err) {
                    sendOtpToMail(admin, otp)

                    // setTimeout(() => {
                    //     admin.phoneOtp = null;
                    //     admin.save();
                    // }, 2*60*1000);
                    return res.status(200).send({
                        success: true,
                        message: 'Otp sent to Admin email!',
                        _id: admin._id
                    });

                } else {
                    if (err.code == 11000)
                        res.status(422).send({
                            success: false,
                            message: 'Duplicate email adrress found.'
                        });
                    else
                        return next(err);
                }

            });
        }
    } catch (err) {
        return next(err);
    }
}

module.exports.resendOtp = async (req, res, next) => {
    try {
            Admin.findOne({
                _id: req.body.adminId
            }).then(foundedAdmin => {
                if (!foundedAdmin) {
                    return res.status(404).json({
                        success: false,
                        message: 'No account found with this email!'
                    })
                }
                if (foundedAdmin['role'] === "Admin") {
                    return res.status(409).json({
                        success: false,
                        message: 'Account with this email address exists already!'
                    })
                } else if (foundedAdmin['role'] !== "Admin") {
                    const otp = generateOTP(6);
                    foundedAdmin.phoneOtp = otp;
                    foundedAdmin.save((err, doc) => {
                        if (!err) {
                            sendOtpToMail(foundedAdmin, otp)
                            // setTimeout(() => {
                            //     foundedAdmin.phoneOtp = null;
                            //     foundedAdmin.save();
                            // }, 2*60*1000);
                            return res.status(200).send({
                                success: true,
                                message: 'Otp sent to your email!',
                                _id: foundedAdmin._id
                            });

                        }
                        return next(err);
                    });
                }
            }).catch(err => next(err));

    } catch (err) {
        return next(err);
    }
};


module.exports.verifyOtp = async (req, res, next) => {
    try {
        if(req.body.otp.trim().length < 6) {
            return res.status(401).send({
                success: false,
                message: 'OTP must be of 6 characters'
            });
        }
        const {
            otp,
            adminId
        } = req.body;
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).send({
                success: false,
                message: 'No account found with this email!'
            });
        }

        if (!verifyOtp(otp)) {
            return res.status(401).send({
                success: false,
                message: 'Incorrect or Expired OTP'
            });
        }

        admin.phoneOtp = null;
        admin.role = "Admin";
        await admin.save();

        return res.status(201).json({
            success: true,
            message: "OTP verified successfully",
            data: {
                adminId: admin._id,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports.registerEmp = async (req, res, next) => {

    try {
        let user = new User();
        user.fullName = req.body.fullName;
        user.email = req.body.email;
        user.password = User.hashPassword(req.body.password);
        user.confirmPassword = req.body.confirmPassword;
        // user.password = User.hashPassword(req.body.password);
        user.phone = req.body.phone;
        user.gender = req.body.gender;
        user.service = req.body.service;
        user.joindate = req.body.joindate;


        if (req.body.password !== req.body.confirmPassword) {
            return res.status(422).send({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (await userExists(req.body.email)) {

            return res.status(409).json({
                success: false,
                message: 'Account with this email address exists already!'
            })
        }
        user.save().then(() => {
            return res.status(200).send({
                success: true,
                message: 'User added succussfully!'
            });
        }).catch(err => {
            console.log(err);
            if (err.code == 11000)
                return res.status(409).send({
                    success: false,
                    message: 'Account with this email address exits already!'
                });
            else
                return next(err);
        })

    } catch (err) {
        return next(err);
    }

}

const userExists = async (email) => {
    const user = await User.findOne({
        email: email.toLowerCase().trim()
    })
    if (user) {
        return true;
    } else {
        return false;
    }
}

const adminExists = async (email) => {
    const user = await Admin.findOne({
        email: email.toLowerCase().trim()
    })
    if (user) {
        return true;
    } else {
        return false;
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

module.exports.deleteUser = (req, res, next) => {
    try {

        User.deleteOne({
            _id: req.params.id
        }, (err, foundedObject) => {
            if (err) {
                console.log(err);
                res.status(500).send();
            } else {
                if (!foundedObject) {
                    res.status(404).send();
                } else {
                    return res.status(200).send({
                        success: true,
                        message: 'User deleted successfully'
                    })
                }
            }
        })


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
            let lastCheckIn = user.attendance[user.attendance.length - 1];
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
                return res.status(200).json({
                    success: true,
                    message: `${user.fullName} checked in successfully`
                });

            } else {
                return res.status(406).send({
                    success: false,
                    message: `${user.fullName} has checked in today already`
                })
            }
        } else {
            user.attendance.push(data);
            await user.save();
        }

    } catch (error) {
        return next(error);
    }
};

module.exports.checkAllUsers = async (req, res, next) => {
    try {
        const data = {
            entry: Date.now()
        };

        const allUsers = User.find(async (err, users) => {
            if (!users) {
                return res.status(404).json({
                    status: false,
                    message: 'No data found.'
                });
            } else {
                users.forEach((e, i) => {
                    users[i].attendance.push(data)
                    console.log("hy", users[i].attendance.push(data))
                    // e[i].attendance.push(data);
                });
                console.log("hy", users)
                await allUsers.save();
            }

        })

    } catch (err) {
        return next(err);
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
        let to;
        let from;
        User.findOne({
            _id: id
        }, (err, foundedObject) => {
            if (err) {
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
                             to = leaveArray[leaveArray.indexOf(n)].to;
                             from = leaveArray[leaveArray.indexOf(n)].from;
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
                            const leaveData= {
                                from: String(from).slice(0,15),
                                to: String(to).slice(0,15),
                                domain: req.body.domain,
                                response:req.body.status
                            }
                            sendLeaveResponseMail(foundedObject, leaveData)
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

module.exports.ResetPassword = async (req, res) => {
    if (!req.body.email) {
        return res.status(500).json({
            message: 'Email is required'
        });
    }
    const admin = await Admin.findOne({
        email: req.body.email
    });
    if (!admin) {
        return res.status(409).json({
            message: 'Email does not exist'
        });
    }
    // let resettoken = new passwordResetToken({
    //     _userId: user._id,
    //     resettoken: crypto.randomBytes(16).toString('hex')
    // });
    admin.resettoken = crypto.randomBytes(16).toString('hex')
    admin.save(function (err) {
        if (err) {
            return res.status(500).send({
                msg: err.message
            });
        }

        Admin.find({
            _id: admin._id,
            resettoken: {
                $ne: admin.resettoken
            }
        }).deleteOne().exec();
        res.status(200).json({
            message: 'Reset Password successfully.'
        });
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            port: 465,
            auth: {
                user: process.env.MAILER_AUTH_EMAIL,
                pass: process.env.MAILER_AUTH_PASS
            }
        });
        // const resetLink = "<a href='" + req.body.domain + "/employee/response-reset-password/'><span>link</span></a>.<br>This is a <b>test</b> email."
        let mailOptions = {
            to: admin.email,
            from: process.env.ADMIN_EMAIL,
            subject: 'Employee Management Admin Password Reset',
            html: `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link to complete the process.</p>
                <div style="background-color:#3f51b5; color:white;
                padding:24px 2px; max-width: 50%; text-align:center">
                <a style="color:white; text-decoration:none;" href="${req.body.domain}/admin/response-reset-password/${admin.resettoken}">RESET PASSWORD</a></div>
                
                <p>'If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
        }
        transporter.sendMail(mailOptions, (err, info) => {})
    })
}


module.exports.ValidatePasswordToken = async (req, res) => {
    if (!req.body.resettoken) {
        return res
            .status(500)
            .json({
                message: 'Token is required'
            });
    }
    const admin = await Admin.findOne({
        resettoken: req.body.resettoken
    });
    if (!admin) {
        return res
            .status(409)
            .json({
                message: 'Invalid URL'
            });
    }
    Admin.findOne({
        _id: admin._id
    }).then(() => {
        res.status(200).json({
            message: 'Token verified successfully.'
        });
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({
            msg: err.message
        });
    });
}

module.exports.NewPassword = async (req, res) => {
    Admin.findOne({
        resettoken: req.body.resettoken
    }, function (err, admin, next) {
        if (!admin) {
            return res
                .status(409)
                .json({
                    message: 'Account does not exist'
                });
        }
        else if (!admin.resettoken) {
            return res
                .status(409)
                .json({
                    message: 'Token has expired'
                });
        }
        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(401).json({
                success: false,
                message: 'Paswords do no match'
            });
        }

        admin.password = Admin.hashPassword(req.body.newPassword);
        admin.resettoken = null;
        admin.save(function (err) {
            if (err) {
                return res
                    .status(400)
                    .json({
                        message: 'Password can not reset.'
                    });
            } else {
                admin.resettoken = null;
                return res
                    .status(201)
                    .json({
                        message: 'Password reset successfully'
                    });
            }
        });
    })
}

module.exports.getNotifications = async (req, res, next) => {

    let counts = 0;
    try {
        await AdminNotification.count({}, (err, countDOC) => {
            counts = countDOC

        }).clone()
    } catch (err) {
        return next(err);
    }

    // AdminNotification.updateMany({ "isRead": false}, [{$set: {"isRead": true}}], {upsert: false})
   

    try {
        AdminNotification.find((err, notifications) => {
                if (!notifications) {
                    return res.status(404).json({
                        status: false,
                        message: 'No Notifications found.'
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        notifications: notifications,
                        counts: counts
                    });
                }
            }).sort({_id: -1}).limit(req.params.perPage)
            .skip(+req.params.perPage * +(req.params.page - 1))

    } catch (err) {
        return next(err);
    }
}

module.exports.markAsReadAllNotifications = async (req, res, next) => {
    try {
        await AdminNotification.updateMany(
            { isRead: false }, 
            { $set: { isRead: true } }
        ).then(result => {
            return res.status(200).json({
                status: true,
                message: "Success"
            })
        }).catch(err => next(err));
    } catch (err) {
        return next(err);
    }
}