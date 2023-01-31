const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminNotificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    context: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        required: true
    },
    user: {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        imgUrl: {
            type: String,
            ref: 'User'
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
}, {
    timestamps: true
});

mongoose.model('AdminNotification', adminNotificationSchema);