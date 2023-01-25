// const fast2sms = require("fast-two-sms");
// const {FAST2SMS} = require("../config");
const nodemailer = require('nodemailer');

exports.generateOTP = (otp_length) => {
    // Declare a digits variable
    // which stores all digits
    let digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < otp_length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};


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
        subject: 'Otp from Employee Management ',
        html: `<h2>You are receiving this because you (or someone else) have requested to registered as admin on Employee Management Website, 
        Please verify Otp to complete the process:</h2> 
        <div style="background-color: #3f51b5; color:white; padding: 16px 2px; max-width: 50%; text-align:center">
            <p> Your Otp is:  <h3><strong> ${otp}</strong></h3></p>
        </div>
        <h4> If you did not request this, please ignore this email</h4>`,
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
            //   res.send({error: error})
        } else {
            console.log('Email sent')
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