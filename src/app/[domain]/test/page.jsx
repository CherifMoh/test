'use client'
import axios from "axios"
import {addWilaya, getWilayaCodeByName, getWilayaNameByCode} from "../../(server)/actions/wilayas"
import {addToStock, RemoveFromStock, updateStockStatus} from "../../(server)/actions/stock/stock"
import { use, useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { addOrder, deleteOrder, generateUniqueString } from "../../(server)/actions/order"

async function fetchOrders(query) {
  const res = await axios.get('/api/orders', { params:  query  });
  return res.data;
}

function page({params}) {

  const paramst = use(params)
  const domain = paramst.domain

  const queryClient = useQueryClient();

  const query = {
    domain:domain,
    fields:'name tracking'
  }

  const { data: Orders, isLoading, isError, error } = useQuery({
    queryKey: ['orders',query],
    queryFn: ({queryKey})=>fetchOrders(queryKey[1]),
  });

  if (isLoading ) return <div>Loading...</div>;
  if (isError ) {
      return <div>Error fetching Data: {
          error?.message 
      }</div>;
  }

  console.log(Orders)

  const testOrder2 = {
    name: "Khaled Mansouri",
    adminEmail: "admin2@example.com",
    ip: "192.168.2.2",
    deliveryAgent: "AMANA",
    blackListed: false,
    phoneNumber: "0777654321",
    phoneNumber2: "0555987654",
    wilaya: "Oran",
    commune: "Es Senia",
    adresse: "Boulevard de l'ALN, Oran",
    shippingPrice: 300,
    totalPrice: 2500,
    orders: [
      {
        product: "Kitchen Storage Rack",
        quantity: 1,
        price: 2000
      },
      {
        product: "Silicone Baking Mat",
        quantity: 2,
        price: 250
      }
    ],
    state: "غير مؤكدة",
    schedule: "2024-09-06 10:00",
    deliveryNote: "Ring the doorbell upon arrival",
    inDelivery: false,
    note: "Customer prefers delivery after 10 AM",
    source: "instagram"
  };

  

  async function handelAdd(){
    // const news = await addOrder(domain,testOrder2)
    const newst = await deleteOrder(domain,'67a4781f78425a175239ff25')
    queryClient.invalidateQueries(['orders',query])
    console.log(newst)
  }
  
  

  return (
    <div className="space-x-10">
       <button
        onClick={handelAdd}
      >add</button>
      
    </div>
  )
}

export default page