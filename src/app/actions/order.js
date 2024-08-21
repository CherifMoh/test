'use server'

import Order from "../models/orders"
import { dbConnect } from "../lib/dbConnect"
import axios from "axios"
import BlackList from "../models/blackLists"

export async function addOrder(formData){ 
    await dbConnect()
    Order.create(formData)   
}

export async function deleteOrder(id){
    await dbConnect()
    const res = await Order.findByIdAndDelete(id)        
}

export async function getOrder(methode, value){
    await dbConnect()
    const res = await Order.find({[methode]: value}).sort({ _id: -1 })    
    const formattedRes = res.map(order => {
        return {
          ...order._doc,
          createdAt: order.createdAt.toISOString(),  // or any other date format
          updatedAt: order.updatedAt.toISOString()   // or any other date format
        };
      }); 
    return formattedRes
}

export async function addOrderSchedule(order,schedule) {
    

  try {
      await dbConnect();

      const newOrder = {
          ...order,
          schedule: schedule
      }

      await Order.findByIdAndUpdate(order._id,newOrder,{new:true});

      return 'updated';
  } catch (error) {
      console.error("Error creating role:", error);
      throw error;
  }
}

export async function fetchOrderStatus(tracking) {
  try{
    const response = await axios.post('https://procolis.com/api_v1/lire', 
      {
          Colis: [
              { "Tracking": tracking }
          ]
      }, 
      {
          headers: {
              key: process.env.ZR_API_KEY,
              token: process.env.ZR_API_TOKEN
          }
      }
    );
    return response.data
  }catch(err){
      console.log(err.message)
      return null
  }
}
export async function addOrderToZR(order) {
  try{
    const response = await axios.post('https://procolis.com/api_v1/add_colis', 
      {
          Colis: [
            order
          ]
      }, 
      {
          headers: {
              key: process.env.ZR_API_KEY,
              token: process.env.ZR_API_TOKEN
          }
      }
    );
    return response.data
  }catch(err){
      console.log(err.message)
      return null
  }
}

export async function expedieOrderToZR(tracking) {
  try{
    const response = await axios.post('https://procolis.com/api_v1/pret ', 
      {
          Colis: [
            {Tracking: tracking }
          ]
      }, 
      {
          headers: {
              key: process.env.ZR_API_KEY,
              token: process.env.ZR_API_TOKEN
          }
      }
    );
    return response.data
  }catch(err){
      console.log(err.message)
      return null
  }
}

export async function addToBlackList(ip,phoneNumber) {
  try {
    await dbConnect()


    // Find the blacklist entry with name 'IP'
    const blacklist = await BlackList.findOne({ name: 'IP' });

    if (!blacklist) {
        // If no blacklist entry exists, create one
        await BlackList.create({
            name: 'IP',
            ip: [{ip: ip,phoneNumber:phoneNumber}]
        });
    } else {
        // If blacklist entry exists, add the IP address if it's not already present
        if (!blacklist.ip.includes(ip)) {
            blacklist.ip.push({ip: ip,phoneNumber:phoneNumber});
            await blacklist.save();
        }
    }

    return {sucsess: true, message: "IP added to blacklist"}

  } catch (err) {
    return {sucsess: false, err:err}
  }
}
