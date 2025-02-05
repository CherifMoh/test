'use server'

import { dbConnect } from "../../../lib/dbConnect";
import Stock from "../../models/stock";
import StockArchive from "../../models/stockArchive";


export async function addToStockArchive(domain, product,qnt,Uprice,sQnt,sUnitPrice,sTotalPrice,action) {

    try{
        await dbConnect(domain)

        const newArchive = {
            product,
            action,
            qnt,
            unitPrice: Uprice ,
            totalPrice: qnt * Uprice,
            sQnt,
            sUnitPrice,
            sTotalPrice
        }

        const res = await StockArchive.create(newArchive)   
    
        return res 
        
    }catch(err){
    console.log(err)
    }
    
}

