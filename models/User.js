const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required!'],
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: [true, 'Email is required!'],
            trim: true,
            unique: true,
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

// UserSchema.pre('save', async function (next) {
//     try {
//         this.validateSync();
//         next(); // Call next() to continue with the save operation
//     } catch (error) {
//         next(error); // Pass the error to the next middleware
//     }
// });

const UserModel = model('users', UserSchema);

module.exports = UserModel;
