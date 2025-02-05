import mongoose from "mongoose"; 


const StockArchiveSchem = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: false
    },
    qnt: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    sQnt: {
        type: Number,
        required: true
    },
    sUnitPrice: {
        type: Number,
        required: true
    },
    sTotalPrice: {
        type: Number,
        required: true
    },

    
},{timestamps: true})

const StockArchive = mongoose.models.StockArchive ||mongoose.model('StockArchive', StockArchiveSchem)

export default StockArchive