import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const messagesCollection = 'messages';

const messageSchema = new mongoose.Schema({
    user: {
        type: String, 
        required: true
    },
    receiver: {
        type: String, 
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

messageSchema.plugin(mongoosePaginate);

export const messagesModel = mongoose.model(messagesCollection, messageSchema);