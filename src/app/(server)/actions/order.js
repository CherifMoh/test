'use server'

import Order from "../models/orders"
import { dbConnect } from "../../lib/dbConnect"
import axios from "axios"


export async function addOrder(domain,formData){ 
  console.log(domain)
  try{
    await dbConnect(domain)
    const res = await Order.create(formData)   

    return res 
    
  }catch(err){
    console.log(err)
  }
}

// export async function deleteOrder(id){
//   try{

//     await dbConnect()
//     const res = await Order.findByIdAndDelete(id)       
    
//   }catch(err){
//     console.log(err)
//   }
// }

