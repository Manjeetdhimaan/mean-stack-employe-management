const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'Full name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength: [4, 'Password must be atleast 4 character long']
    },
    service: {
        type: String,
        required: [false, 'Please enter a service'],
        trim: true
    },
    joindate: {
        type: Date,
        required: [false, 'Please provide joining date'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Provide your mobile number'],
        trim: true
    },
    remainingLeaves: {
        type: String,
        required: false,
        trim: true
    },
    totalLeaves: {
        type: String,
        required: false,
        trim: true
    },
    appliedLeaves: {
        type: String,
        required: false,
        trim: true
    },
    camps: {
        type: Object,
        required: false,
        trim: true
    },
    leaves: [{
        reason: {
            type: String,
            trim: true
        },
        from: {
            type: Date,
        },
        to: {
            type: Date
        },
        status: {
            type: String
        }
    }],
    attendance: [{
        date: {
            type: Date,
            default: Date.now,
        },
        entry: { type: Date },
        exit: {
            time: {
                type: Date
            },
            // 1 - General
            // 2 - Vacation
            // 3 - Doctor
            exitType: String
        }

    }],
    payroll: [{
        month: {
            type: String,
            required: false,
            trim: true
        },
        basic: {
            type: Number,
            required: false,
            trim: true
        },
        da: {
            type: Number,
            required: false,
            trim: true
        },
        hra: {
            type: Number,
            required: false,
            trim: true
        },
        wa: {
            type: Number,
            required: false,
            trim: true
        },
        ca: {
            type: Number,
            required: false,
            trim: true
        },
        cca: {
            type: Number,
            required: false,
            trim: true
        },
        ma: {
            type: Number,
            required: false,
            trim: true
        },
        SalesIncentive: {
            type: Number,
            required: false,
            trim: true
        },
        LeaveEncashment: {
            type: Number,
            required: false,
            trim: true
        },
        HolidayWages: {
            type: Number,
            required: false,
            trim: true
        },
        SpecialAllowance: {
            type: Number,
            required: false,
            trim: true
        },
        Bonus: {
            type: Number,
            required: false,
            trim: true
        },
        IndividualIncentive: {
            type: Number,
            required: false,
            trim: true
        },
        pf: {
            type: Number,
            required: false,
            trim: true
        },
        esi: {
            type: Number,
            required: false,
            trim: true
        },
        tds: {
            type: Number,
            required: false,
            trim: true
        },
        lop: {
            type: Number,
            required: false,
            trim: true
        },
        pt: {
            type: Number,
            required: false,
            trim: true
        },
        SPL_Deduction: {
            type: Number,
            required: false,
            trim: true
        },
        ewf: {
            type: Number,
            required: false,
            trim: true
        },
        cd: {
            type: Number,
            required: false,
            trim: true
        },
        totalEarning: {
            type: Number,
            required: false,
            trim: true
        },
        totalDeductions: {
            type: Number,
            required: false,
            trim: true
        },
        netPay: {
            type: Number,
            required: false,
            trim: true
        },
    }],
    saltSecret: String
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Events
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}



mongoose.model('User', userSchema);