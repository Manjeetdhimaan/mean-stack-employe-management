const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');
const AdminNotification = mongoose.model('AdminNotification');
const fileHelper = require('../util/file');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {
    sendApplyLeaveMail
} = require("../util/otp.util");


module.exports.register = (req, res, next) => {
    try {
        let user = new User();
        user.fullName = req.body.fullName;
        user.email = req.body.email;
        user.password = req.body.password;
        // user.password = User.hashPassword(req.body.password);
        user.phone = req.body.phone;
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
    // call for passport authentication
    try {
        passport.authenticate('user', (err, user, info) => {
            // error from passport middleware
            if (err) return res.status(400).json(err);
            // registered user
            else if (user) return res.status(200).json({
                "token": user.generateJwt(),
                "_id": user['_id'],
                "name": user['fullName']
            });
            // unknown user or wrong password
            else {
                return res.status(404).json(info);
            }
        })(req, res, next);
    } catch (err) {
        return next(err);
    }

}

module.exports.userProfile = (req, res, next) => {
    try {
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
    } catch (err) {
        return next(err);
    }

}

module.exports.getUsers = (req, res, next) => {
    try {
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
        });
    } catch (err) {
        return next(err);
    }

}

module.exports.updateUserProfile = (req, res, next) => {
    try {
        const id = req._id;
        User.findOne({
            _id: id
        }, (err, foundedObject) => {
            if (err) {
                console.log(err);
                res.status(500).send();
            } else {
                if (!foundedObject) {
                    res.status(404).send();
                } else {
                    if (req.body.fullName) {
                        foundedObject.fullName = req.body.fullName;
                    }
                    if (req.body.service) {
                        foundedObject.service = req.body.service;
                    }
                    if (req.body.email) {
                        foundedObject.email = req.body.email;
                    }
                    if (req.body.password) {
                        foundedObject.password = User.hashPassword(req.body.password);
                    }
                    if (req.body.bio || req.body.bio === "") {
                        foundedObject.bio = req.body.bio;
                    }
                    if (req.body.phone) {
                        foundedObject.phone = req.body.phone;
                    }
                    foundedObject.save((err, updatedObject) => {
                        if (err) {
                            res.status(500).send({
                                msg: err
                            });
                        } else {
                            res.send({
                                msg: 'Profile Updated Successfully!'
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

module.exports.updateProfileImage = (req, res, next) => {

    try {
        const id = req._id;
        User.findOne({
            _id: id
        }, (err, foundedObject) => {
            if (err) {
                res.status(500).send();
            } else {
                if (!foundedObject) {
                    res.status(404).send();
                } else {
                    let imagePath = req.body.image;
                    if (req.file) {
                        // const url = req.protocol + "://" + req.get("host");
                        const url = req.body.domain;
                        imagePath = url + "/images/" + req.file.filename;
                    }

                    if (!imagePath) {
                        if (foundedObject.imagePath) {
                            fileHelper.deleteFile('/images/' + foundedObject.imagePath.split('images/')[1]);
                            foundedObject.imagePath = "";
                        }
                        foundedObject.imagePath = "";
                    }
                    if (imagePath) {
                        if (foundedObject.imagePath && imagePath.split('images/')[1] !== foundedObject.imagePath.split('images/')[1]) {
                            fileHelper.deleteFile('images/' + foundedObject.imagePath.split('images/')[1]);
                            foundedObject.imagePath = imagePath;
                        }
                        foundedObject.imagePath = imagePath;
                    }
                    foundedObject.save((err, updatedObject) => {
                        if (err) {
                            res.status(500).send({
                                msg: err
                            });
                        } else {
                            res.send({
                                msg: 'Image uploaded successfully!',
                                imagePath: updatedObject['imagePath']
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

module.exports.removeProfileImage = (req, res, next) => {
    try {
        const id = req._id;
        User.findOne({
            _id: id
        }, (err, foundedObject) => {
            if (err) {
                res.status(500).send();
            } else {
                if (!foundedObject) {
                    res.status(404).send();
                } else {
                    let imagePath = req.body.image;
                    if (req.file) {
                        const url = req.protocol + "://" + req.get("host");
                        imagePath = url + "/images/" + req.file.filename;
                    }

                    if (!imagePath) {
                        if (foundedObject.imagePath) {
                            fileHelper.deleteFile('images/' + foundedObject.imagePath.split('images/')[1]);
                            foundedObject.imagePath = "";
                        }
                        foundedObject.imagePath = "";
                    }

                    foundedObject.save((err, updatedObject) => {
                        if (err) {
                            res.status(500).send({
                                msg: err
                            });
                        } else {
                            res.send({
                                msg: 'Image removed successfully!',
                                imagePath: updatedObject['imagePath']
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

module.exports.changePassword = (req, res, next) => {
    User.findOne({
        _id: req._id
    }, (err, user) => {
        // Check if error connecting
        if (err) {
            return res.status(500).json({
                success: false,
                message: err
            }); // Return error
        } else {
            // Check if user was found in database
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                }); // Return error, user was not found in db
            } else {
                if (!user.verifyPassword(req.body.oldPassword)) {
                    return res.status(401).json({
                        success: false,
                        message: 'Old password is incorrect'
                    });
                }
                if (req.body.newPassword !== req.body.confirmNewPassword) {
                    return res.status(401).json({
                        success: false,
                        message: 'Paswords do no match'
                    });
                }
                // user.password = req.body.newPassword;
                user.password = User.hashPassword(req.body.newPassword)
                user.save((err, doc) => {
                    if (!err)
                        return res.status(200).send({
                            success: true,
                            message: 'Password Changed succussfully'
                        });
                    else {
                        return next(err);
                    }

                });
            }
        }
    });
}

// async await 
module.exports.applyLeave = async (req, res, next) => {
    try {
        const data = {
            from: new Date(req.body.from),
            to: new Date(req.body.to),
            reason: req.body.reason,
            status: req.body.status
        };
        const user = await User.findOne({
            _id: req._id
        });
        //check if there is an attendance entry
        const fromDate = data.from.getDate() + '-' + +data.from.getMonth() + 1 + '-' + data.from.getFullYear();
        const toDate = data.to.getDate() + '-' + +data.to.getMonth() + 1 + '-' + data.to.getFullYear();
        user.leaves.push(data)
        await user.save().then(() => {
            let adminNotification = new AdminNotification();
            adminNotification.title = "applied for leave";
            adminNotification.context = "from " + fromDate + " to " + toDate;
            adminNotification.isRead = false;
            adminNotification.user = {
                fullName: user.fullName,
                email: user.email,
                imgUrl: user.imagePath,
                userId: user._id
            };

            adminNotification.save().then(() => {
                const leaveData = {
                    from: fromDate,
                    to: toDate,
                    domain: req.body.domain
                }
                sendApplyLeaveMail(user, leaveData);
                return res.status(200).json({
                    success: true,
                    message: 'Applied for leave successfully'
                });
            }).catch(err => next(err));

        }).catch(err => next(err));
        

    } catch (error) {
        console.log('Cannot find User', error);
        return next(error);
    }
}

module.exports.ResetPassword = async (req, res) => {
    if (!req.body.email) {
        return res.status(500).json({
            message: 'Email is required'
        });
    }
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        return res.status(409).json({
            message: 'Email does not exist'
        });
    }
    // let resettoken = new passwordResetToken({
    //     _userId: user._id,
    //     resettoken: crypto.randomBytes(16).toString('hex')
    // });
    user.resettoken = crypto.randomBytes(16).toString('hex')
    user.save(function (err) {
        if (err) {
            return res.status(500).send({
                msg: err.message
            });
        }

        User.find({
            _id: user._id,
            resettoken: {
                $ne: user.resettoken
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
            to: user.email,
            from: process.env.ADMIN_EMAIL,
            subject: 'Employee Management Password Reset',
            html: `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link to complete the process.</p>
                <div style="background-color:#3f51b5; color:white;
                padding:24px 2px; max-width: 50%; text-align:center">
                <a style="color:white; text-decoration:none;" href="${req.body.domain}/employee/response-reset-password/${user.resettoken}">RESET PASSWORD</a></div>
                
                <p>'If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
        }
        transporter.sendMail(mailOptions, (err, info) => {})
    })
}


module.exports.ValidPasswordToken = async (req, res) => {
    if (!req.body.resettoken) {
        return res
            .status(500)
            .json({
                message: 'Token is required'
            });
    }
    const user = await User.findOne({
        resettoken: req.body.resettoken
    });
    if (!user) {
        return res
            .status(409)
            .json({
                message: 'Invalid URL'
            });
    }
    User.findOne({
        _id: user._id
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
    User.findOne({
        resettoken: req.body.resettoken
    }, function (err, user, next) {
        if (!user) {
            return res
                .status(409)
                .json({
                    message: 'User does not exist'
                });
        } else if (!user.resettoken) {
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

        user.password = User.hashPassword(req.body.newPassword);
        user.resettoken = null;
        user.save(function (err) {
            if (err) {
                return res
                    .status(400)
                    .json({
                        message: 'Password can not reset.'
                    });
            } else {
                user.resettoken = null;
                return res
                    .status(201)
                    .json({
                        message: 'Password reset successfully'
                    });
            }
        });
    })
}