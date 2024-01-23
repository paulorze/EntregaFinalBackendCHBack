import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    purchaser: {
        type: String, 
        required: true
    },
    products: {
        type: [
            {
                pid: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number
            }
        ],
        default: []
    }
});

cartsSchema.plugin(mongoosePaginate);

cartsSchema.pre('find', function(){
    this.populate('products.pid');
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);