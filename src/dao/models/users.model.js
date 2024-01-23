import mongoose from 'mongoose';

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                },
                reference: {
                    type: String,
                }
            }
        ],
        default: []
    },
    last_connection: {
        type: Date,
        default: Date.now
    }
});

export const usersModel = mongoose.model(usersCollection, usersSchema);