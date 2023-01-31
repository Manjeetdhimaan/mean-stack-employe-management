// const fast2sms = require("fast-two-sms");
// const {FAST2SMS} = require("../config");
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');

// exports.generateOTP = (otp_length) => {
//     // Declare a digits variable
//     // which stores all digits
//     let digits = "0123456789";
//     let OTP = "";
//     for (let i = 0; i < otp_length; i++) {
//         OTP += digits[Math.floor(Math.random() * 10)];
//     }
//     return OTP;
// };
exports.generateOTP = (otp_length) => {
    let token = speakeasy.totp({
        secret:process.env.OTP_KEY,
        encoding: 'base32',
        digits:otp_length,
        step: 12,
        window:10
    });
    return token;
}

// step is for expiring otp, stp 60 is equals 10 minutes, step 1 is eqauls 10 seconds

exports.verifyOtp = (token) => {
    let expiry =  speakeasy.totp.verifyDelta({
        secret:process.env.OTP_KEY,
        encoding: 'base32',
        token: token,
        step: 12,
        window:10
    });
    return expiry
}

exports.sendOtpToMail = async (user, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        auth: {
            user: process.env.MAILER_AUTH_EMAIL,
            pass: process.env.MAILER_AUTH_PASS
        }
    });
    const mailOptions = {
        to: process.env.ADMIN_EMAIL,
        from: user.email,
        subject: 'OTP verification from Employee Management',
        html: `<h2>You are receiving this because you (or someone else) have requested to register as admin on Employee Management Website, 
        Please verify OTP to complete the process:</h2> 
        <h3>Sender Name :  ${user.fullName.toUpperCase()}</h3>
        <h3>Sender Email :  ${user.email}</h3>
        <p> THIS VERIFICATION CODE IS ONLY VALID FOR 2 MINUTES.</p>
        <div style="background-color: #3f51b5; color:white; padding: 16px 2px; max-width: 50%; text-align:center">
            <p> VERIFICATION CODE:  <h3><strong> ${otp}</strong></h3></p>
        </div>
        <h4> If you did not request this, please ignore this email</h4>`,
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
            //   res.send({error: error})
        } else {
            return {
                res: info.response,
                message: 'Details sent successfully'
            };
        }
    })
}

exports.fast2sms = async ({
    message,
    contactNumber
}, next) => {
    try {
        const res = await fast2sms.sendMessage({
            authorization: process.env.FAST2SMS,
            message,
            numbers: [contactNumber],
        });
        console.log(res);
    } catch (error) {
        next(error);
    }
};

exports.sendApplyLeaveMail = async (user, leaveData) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        auth: {
            user: process.env.MAILER_AUTH_EMAIL,
            pass: process.env.MAILER_AUTH_PASS
        }
    });
    const mailOptions = {
        to: process.env.ADMIN_EMAIL,
        from: user.email,
        subject: `Applied for Leave ( ${leaveData.domain} )`,
        html: `<h2>${user.fullName.toUpperCase()} applied for leave from ( ${leaveData.from} ) to ( ${leaveData.to} ) :</h2> 
        <h3>Employee Name :  ${user.fullName.toUpperCase()}</h3>
        <h3>Employee Email :  ${user.email}</h3>
        <div style="background-color:#3f51b5; color:white;
        padding:24px 2px; max-width: 50%; text-align:center">
        <a style="color:white; text-decoration:none;" href="${leaveData.domain}/admin/employees/leaves/check/${user._id}">RESPOND TO LEAVE</a></div>`
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
            //   res.send({error: error})
        } else {
            return {
                res: info.response,
                message: 'Details sent successfully'
            };
        }
    })
}

exports.sendLeaveResponseMail = async (user, leaveData) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        auth: {
            user: process.env.MAILER_AUTH_EMAIL,
            pass: process.env.MAILER_AUTH_PASS
        }
    });
    const mailOptions = {
        to: user.email,
        from: user.email,
        subject: `Response from admin for Applied Leave ( ${leaveData.domain} )`,
        html: `<h3>${user.fullName.toUpperCase()}, You applied for leave from ( ${leaveData.from} ) to ( ${leaveData.to} )</h3> 
        <h2>Your leave is <b>${leaveData.response}</b> by Admin.</h2>
        <div style="background-color:#3f51b5; color:white;
        padding:24px 2px; max-width: 50%; text-align:center">
        <a style="color:white; text-decoration:none;" href="${leaveData.domain}/employee/leaves/check">CHECK YOUR LEAVES HERE</a></div>`
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
            //   res.send({error: error})
        } else {
            return {
                res: info.response,
                message: 'Details sent successfully'
            };
        }
    })
}