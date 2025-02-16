'use server'
import { dbConnect } from "../../lib/dbConnect";
import Wilaya from "../models/wilayas";

const wilayasData = [
    { code: 1, name: "Adrar" },
    { code: 2, name: "Chlef" },
    { code: 3, name: "Laghouat" },
    { code: 4, name: "Oum El Bouaghi" },
    { code: 5, name: "Batna" },
    { code: 6, name: "Béjaïa" },
    { code: 7, name: "Biskra" },
    { code: 8, name: "Béchar" },
    { code: 9, name: "Blida" },
    { code: 10, name: "Bouira" },
    { code: 11, name: "Tamanrasset" },
    { code: 12, name: "Tébessa" },
    { code: 13, name: "Tlemcen" },
    { code: 14, name: "Tiaret" },
    { code: 15, name: "Tizi Ouzou" },
    { code: 16, name: "Alger" },
    { code: 17, name: "Djelfa" },
    { code: 18, name: "Jijel" },
    { code: 19, name: "Sétif" },
    { code: 20, name: "Saïda" },
    { code: 21, name: "Skikda" },
    { code: 22, name: "Sidi Bel Abbès" },
    { code: 23, name: "Annaba" },
    { code: 24, name: "Guelma" },
    { code: 25, name: "Constantine" },
    { code: 26, name: "Médéa" },
    { code: 27, name: "Mostaganem" },
    { code: 28, name: "M'Sila" },
    { code: 29, name: "Mascara" },
    { code: 30, name: "Ouargla" },
    { code: 31, name: "Oran" },
    { code: 32, name: "El Bayadh" },
    { code: 33, name: "Illizi" },
    { code: 34, name: "Bordj Bou Arréridj" },
    { code: 35, name: "Boumerdès" },
    { code: 36, name: "El Tarf" },
    { code: 37, name: "Tindouf" },
    { code: 38, name: "Tissemsilt" },
    { code: 39, name: "El Oued" },
    { code: 40, name: "Khenchela" },
    { code: 41, name: "Souk Ahras" },
    { code: 42, name: "Tipaza" },
    { code: 43, name: "Mila" },
    { code: 44, name: "Aïn Defla" },
    { code: 45, name: "Naâma" },
    { code: 46, name: "Aïn Témouchent" },
    { code: 47, name: "Ghardaïa" },
    { code: 48, name: "Relizane" },
    { code: 49, name: "El M'Ghair" },
    { code: 50, name: "El Meniaa" },
    { code: 51, name: "Ouled Djellal" },
    { code: 52, name: "Bordj Baji Mokhtar" },
    { code: 53, name: "Béni Abbès" },
    { code: 54, name: "Timimoun" },
    { code: 55, name: "Touggourt" },
    { code: 56, name: "Djanet" },
    { code: 57, name: "In Salah" },
    { code: 58, name: "In Guezzam" }
  ];


export async function addWilaya(){ 
try{
    await dbConnect("global")
    const res = await Wilaya.create(wilayasData)   

    return res 
    
}catch(err){
    console.log(err)
}
}

export async function getWilayaNameByCode(code) {
    try {
      await dbConnect("global")
      const wilaya = await Wilaya.findOne({ code });
      if (!wilaya) {
        throw new Error(`No wilaya found with code ${code}`);
      }
      return wilaya.name;
    } catch (error) {
      console.error('Error getting wilaya name:', error);
      throw error;
    }
}
  
export async function getWilayaCodeByName(name) {
    try {
      await dbConnect("global")
      const wilaya = await Wilaya.findOne({ 
      name: { $regex: new RegExp(name, 'i') } 
      });
      if (!wilaya) {
      // throw new Error(`No wilaya found with name ${name}`);
      }
      return wilaya?.code;
    } catch (error) {
        console.error('Error getting wilaya name:', error);
        throw error;
    }
}