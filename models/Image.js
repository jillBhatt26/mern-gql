const { Schema, model } = require('mongoose');

const ImagesSchema = new Schema(
    {
        cloudImageName: {
            type: String,
            required: [true, 'Cloud image name required'],
            trim: true
        },
        cloudImageID: {
            type: String,
            require: [true, 'Cloud image id is required'],
            trim: true
        },
        userID: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: [true, 'User details required'],
            trim: true
        }
    },
    { timestamps: true }
);

const ImagesModel = model('images', ImagesSchema);

module.exports = ImagesModel;
