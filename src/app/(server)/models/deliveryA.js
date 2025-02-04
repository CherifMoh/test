import mongoose from "mongoose"; 
// import { generateUniqueString } from "../lib/utils";

const DeliveryASchem = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    keys: {
        type: String,
        required: false
    },
    
    
},{timestamps: true})

const DeliveryA = mongoose.models.DeliveryA ||mongoose.model('DeliveryA', DeliveryASchem)

export default DeliveryA