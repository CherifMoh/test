import mongoose from "mongoose"; 


const StockSchem = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    unitPrice:{
        type: Number,
        required: false
    },
    totalPrice:{
        type: Number,
        required: false
    },
    totalQnt:{
        type: Number,
        required: false
    },
    minQnt:{
        type: Number,
        required: false
    },
    inProgress:{
        type: Number,
        required: false
    },
    inDelivery:{
        type: Number,
        required: false
    },
    delivered:{
        type: Number,
        required: false
    },
    damaged:{
        type: Number,
        required: false
    },
    
},{timestamps: true})

const Stock = mongoose.models.Stock ||mongoose.model('Stock', StockSchem)

export default Stock