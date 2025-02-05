'use client'
import axios from "axios"
import {addWilaya, getWilayaCodeByName, getWilayaNameByCode} from "../../(server)/actions/wilayas"
import {addToStock, RemoveFromStock, updateStockStatus} from "../../(server)/actions/stock/stock"



function page({params}) {

  
  const domain = params.domain

  async function handelAdd(){
    const news = await addToStock(domain,'test2',10,25)
    console.log(news)
  }
  async function handelRemove(){
    const news = await RemoveFromStock(domain,'test2',10)
    console.log(news)
  }
  async function handelDamaged(){
    const news = await updateStockStatus(domain,'test2','inProgress',10)
    console.log(news)
  }

  

  return (
    <div className="space-x-10">
      <button
        onClick={handelAdd}
      >add</button>
      <button
        onClick={handelRemove}
      >minus</button>
      <button
        onClick={handelDamaged}
      >Damaged</button>
    </div>
  )
}

export default page