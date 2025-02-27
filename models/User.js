const { Schema, model } = require('model');
const { isEmail } = require('validator');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required!'],
            trim: true,
            unique: [true, 'Username should be unique']
        },
        email: {
            type: String,
            required: [true, 'Email is required!'],
            trim: true,
            unique: [true, 'Email should be unique'],
            validator: [isEmail, 'Email should be in a valid format!']
        },
        password: {
            type: String,
            required: [true, 'Password is required!'],
            trim: true
        }
    },
    { timestamps: true }
);

const UserModel = model('users', UserSchema);

module.exports = UserModel;
