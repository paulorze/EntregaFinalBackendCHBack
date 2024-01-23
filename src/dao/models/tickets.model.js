import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import mongoosePaginate from 'mongoose-paginate-v2';

const ticketsCollection = 'tickets';

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        default: uuidv4,
        unique: true
    }, 
    purchase_datetime:{
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    products: {
        type: [
            {
                id: {
                    type: String,
                    required: true
                },
                code: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }
});

ticketsSchema.plugin(mongoosePaginate);

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);