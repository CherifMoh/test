'use server'

import Order from "../models/orders"
import { dbConnect } from "../../lib/dbConnect"




export async function addOrder(domain, formData) {
  try {
      await dbConnect(domain);
      formData.tracking = await generateUniqueString(domain);
      console.log(formData);
      const res = await Order.create(formData);
      return { success: true,data:'order created' };
  } catch (err) {
      console.log(err);
      return { success: false, error: err.message };
  }
}

export async function generateUniqueString(str) {
  // Check if str is provided and not empty
  if (!str || typeof str !== 'string') {
    throw new Error('A valid string parameter is required');
  }

  const firstLetter = str.charAt(0).toLowerCase();
  const length = 9;
  const prefix = 'TS';

  // Characters to choose from (excluding similar-looking characters)
  const letters = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const numbersAndLetters = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

  let result = prefix;

  // Ensure the first character after the prefix is a letter
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  result += randomLetter;

  // Generate the remaining random characters
  const randomLength = length - prefix.length - 1 - 1; // 1 for firstLetter, 1 for randomLetter
  for (let i = 0; i < randomLength; i++) {
    const randomIndex = Math.floor(Math.random() * numbersAndLetters.length);
    result += numbersAndLetters[randomIndex];
  }

  // Add the first letter of the parameter string
  result += firstLetter;

  return result;
}

export async function deleteOrder(domain, id){
  try{

    await dbConnect(domain);
    const res = await Order.findByIdAndDelete(id)
    return { success: true,data:'order deleted' };       
    
  }catch(err){
    console.log(err)
    return { success: false, error: err.message };
  }
}

export async function updateOrder(domain, orderId, data) {
  try {
    if (!domain || !orderId || !data) {
      throw new Error("Missing required parameters");
    }

    // Connect to the appropriate database
    await dbConnect(domain);

    // Update the order and get the updated document
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: data },
      { 
        new: true,  // Return the updated document
        runValidators: true  // Run schema validators
      }
    );

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return { success: true, data: updatedOrder };

  } catch (error) {
    console.error('Update order error:', error);
    return { 
      success: false, 
      error: error.message || "Failed to update order" 
    };
  }
}
