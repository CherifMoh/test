'use server'

import axios from "axios";
import { decryptAPIKey } from "../cryptKeys";


function convertToZROrder(order) {

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

  const ZROrder ={
    Tracking:order.tracking,
    TypeLivraison:order.shippingMethod === 'مكتب' ? 1 : 0,
    TypeColis:0,
    Confrimee:'',
    Client:order.name,
    MobileA:order.phoneNumber,
    MobileB:'',
    Adresse:order.adresse,
    IDWilaya:order.wilaya,
    Commune:order.commune,
    Total:order.totalPrice,
    Note:order.deliveryNote,
    TProduit:products.join(),
    id_Externe:order._id,
    Source:''
  }

  return ZROrder
};

export async function addOrderToZR(order, keys) {

  const ZRorder = convertToZROrder(order)

  try{

    let { key, token } = keys;

    key = decryptAPIKey(key);

    const response = await axios.post('https://procolis.com/api_v1/add_colis', 
      {
          Colis: [
            ZRorder
          ]
      }, 
      {
          headers: {
              key: key,
              token: token
          }
      }
    );
  //   const userName = await getUserNameByEmail(cookies().get('user-email').value)
    
    
    return response.data
  }catch(err){
      console.log(err.message)
      throw new Error('Could not add order to ZR:'+err.message)
  }
}
  
export async function validateToZR(tracking, keys) {
  try{

    
    let { key, token } = keys;

    key = decryptAPIKey(key);

    const response = await axios.post('https://procolis.com/api_v1/pret ', 
      {
          Colis: [
            {Tracking: tracking }
          ]
      }, 
      {
          headers: {
              key: key,
              token: token
          }
      }
    );
  //   const userName = await getUserNameByEmail(cookies().get('user-email').value)
    
    
    return response.data
  }catch(err){
      console.log(err.message)
      throw new Error('Could not expedie order to ZR:'+err.message)
  }
}
