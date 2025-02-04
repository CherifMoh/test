import mongoose from "mongoose"; 

const OrderSchem = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    
},{timestamps: true})

const Order = mongoose.models.Order ||mongoose.model('Order', OrderSchem)

export default Order