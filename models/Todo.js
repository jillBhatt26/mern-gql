const { Schema, model } = require('mongoose');

const TodoSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Todo name is required!'],
            minLength: [3, 'Name should be at least 3 characters long']
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Todo description is required!'],
            minLength: [3, 'Description should be at least 3 characters long']
        },
        status: {
            type: String,
            enum: ['pending', 'progress', 'complete'],
            trim: true,
            required: [true, 'Todo status is required!'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

const Todo = model('todos', TodoSchema);

module.exports = Todo;
