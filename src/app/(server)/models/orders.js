import mongoose from "mongoose"; 


const OrderSchem = new mongoose.Schema({
    tracking: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false
    },
    adminEmail: {
        type: String,
        required: false
    },
    ip: {
        type: String,
        required: false
    },
    deliveryAgent: {
        type: String,
        required: false,
        default:'ZR'
    },
    blackListed: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    phoneNumber2: {
        type: String,
        required: false,
        default: ''
    },
    wilaya: {
        type: String,
        required: false
    },
    commune: {
        type: String,
        required: false
    },
    adresse: {
        type: String,
        required: false
    },
    stopDesk: {
        type: Boolean,
        required: false
    },
    shippingPrice: {
        type: Number,
        required: false
    },
    totalPrice: {
        type: Number,
        required: false
    },
    orders: {
        type: Array,
        required: true
    },
    state:{
        type: String,
        default: 'غير مؤكدة'
    },
    schedule:{
        type: String,
        default: ''
    },
    deliveryNote:{
        type: String,
        default: ''
    },
    inDelivery:{
        type: Boolean,
        default: false
    },
    note:{
        type: String,
        default: ''
    },
    source: {
        type: String,
        default: 'tasyir'
    }
    
},{timestamps: true})

const Order = mongoose.models.Order ||mongoose.model('Order', OrderSchem)

export default Order