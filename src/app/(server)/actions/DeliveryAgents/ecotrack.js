'use server'

import axios from "axios";
import { decryptAPIKey } from "../cryptKeys";


function convertToEcotrackOrder(order) {

    let products =[]

    order.orders.forEach(order=>{
        const i =products.findIndex(product=>product === order.title)
        if(i === -1){
            if(!order.code){
                products.push(order.title)
            }else{
                products.push(order.code)
            }
        }
    })

 

    const EcoOrder ={
        reference:order.reference,
        nom_client:order.name,
        telephone:order.phoneNumber,
        adresse:order.adresse,
        commune:order.commune,
        produit:products.join(),
        code_wilaya: order.wilaya,
        fragile:1,
        remarque:order.deliveryNote,
        montant:order.totalPrice,
        stop_desk:order.shippingMethod === 'مكتب' ? 1 : 0,
        type:1,
    }

  return EcoOrder
};

export async function addOrderToEco(order, keys) {
    
    try {
      const ecoOrder = convertToEcotrackOrder(order);
      let { key, link } = keys;

      key = decryptAPIKey(key);
      
      const response = await axios.post(
        `https://${link}.ecotrack.dz/api/v1/create/order`,
        ecoOrder,
        {
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if(response.data.success){
        return {success:response.data.success,tracking:response.data.tracking}
      }
      
      throw new Error(`Could not add order to Ecotrack: ${response?.data?.message}`);
    } catch (error) {
      console.error('Error adding order to Ecotrack:', error.message);
      throw new Error(`Could not add order to Ecotrack: ${error.message}`);
    }
}

export async function validateToTsl(tracking,ask_collection,keys) {
       
    try {

        let { key, link } = keys;

        key = decryptAPIKey(key);

        const res = await axios.post(
            `https://${link}.ecotrack.dz/api/v1/create/order`,
            {
                tracking: tracking,
                ask_collection: ask_collection
            },
            {
                headers: {
                    Authorization: `Bearer ${key}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        if(res.data.success){
            return {tracking:res.data.tracking};
        }
        throw new Error(`Could not validate order to Ecotrack: ${response?.data?.message}`);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw new Error(`Could not validate order to Ecotrack: ${error.response?.data || error.message}`);
    }
    
}
