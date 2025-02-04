'use server'

import Order from "../models/orders"
import { dbConnect } from "../../lib/dbConnect"



export async function addOrder(domain,formData){ 
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

