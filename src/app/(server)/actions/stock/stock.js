'use server'

import { dbConnect } from "../../../lib/dbConnect";
import Stock from "../../models/stock";
import {addToStockArchive} from './archive'

export async function addToStock(domain, product, qnt, price) {
    if (!domain || !product || typeof qnt === 'undefined' || typeof price === 'undefined') {
        throw new Error('Missing required parameters');
        return
    }

    if (typeof qnt !== 'number' || typeof price !== 'number') {
        throw new Error('Quantity and price must be numbers');
        return
    }

    if (qnt <= 0 || price <= 0) {
        throw new Error('Quantity and price must be positive numbers');
        return
    }

    try {
        await dbConnect(domain);
        
        // Find existing stock or create new one
        let stock = await Stock.findOne({ product });
        
        if (!stock) {
            stock = await Stock.create({
                product,
                totalQnt: 0,
                totalPrice: 0,
                unitPrice: 0,
                minQnt: 0,
                inProgress: 0,
                inDelivery: 0,
                delivered: 0,
                damaged: 0
            });
        }

        // Calculate new values
        const newTotalQnt = (stock.totalQnt || 0) + qnt;
        const newTotalPrice = ((stock.totalPrice || 0) + (qnt * price)).toFixed(2);
        const newUnitPrice = (newTotalPrice / newTotalQnt).toFixed(2); 

        // Update stock 
        const updatedStock = await Stock.findOneAndUpdate(
            { product },
            {
                $set: {
                    totalQnt: newTotalQnt,
                    totalPrice: newTotalPrice,
                    unitPrice: newUnitPrice,
                    minQnt: stock.minQnt || 0,
                    inProgress: stock.inProgress || 0,
                    inDelivery: stock.inDelivery || 0,
                    delivered: stock.delivered || 0,
                    damaged: stock.damaged || 0
                }
            },
            { 
                new: true, 
                runValidators: true,
                upsert: true 
            }
        );

        if (!updatedStock) {
            throw new Error('Failed to update stock');
            return
        }

        const archived = await addToStockArchive(domain,product,qnt,price,updatedStock.totalQnt,updatedStock.unitPrice,updatedStock.totalPrice,'دخول')

        return {updatedStock, archived};

    } catch (error) {
        console.error('Error in addToStock:', error);
        throw error;
    }
}

export async function RemoveFromStock(domain, product, qnt) {
    if (!domain || !product || typeof qnt === 'undefined') {
        throw new Error('Missing required parameters');
    }

    if (typeof qnt !== 'number') {
        throw new Error('Quantity must be numbers');
    }

    if (qnt <= 0) {
        throw new Error('Quantity must be positive numbers');
    }

    try {
        await dbConnect(domain);
        
        // Find existing stock or create new one
        let stock = await Stock.findOne({ product });
        
        if (!stock) {
            throw new Error(`Product not found in stock`);
        }

        // Calculate new values
        const newTotalQnt = (stock.totalQnt || 0) - qnt;
        const newTotalPrice = ((stock.totalPrice || 0) - (qnt * stock.unitPrice)).toFixed(2);
        const newUnitPrice = (newTotalPrice / newTotalQnt).toFixed(2); 

        // Update stock 
        const updatedStock = await Stock.findOneAndUpdate(
            { product },
            {
                $set: {
                    totalQnt: newTotalQnt,
                    totalPrice: newTotalPrice,
                    unitPrice: newUnitPrice,
                    minQnt: stock.minQnt || 0,
                    inProgress: stock.inProgress || 0,
                    inDelivery: stock.inDelivery || 0,
                    delivered: stock.delivered || 0,
                    damaged: stock.damaged || 0
                }
            },
            { 
                new: true, 
                runValidators: true,
                upsert: true 
            }
        );

        if (!updatedStock) {
            throw new Error('Failed to update stock');
        }

        const archived = await addToStockArchive(domain,product,qnt,stock.unitPrice,updatedStock.totalQnt,updatedStock.unitPrice,updatedStock.totalPrice,'خروج')

        return updatedStock;

    } catch (error) {
        console.error('Error in addToStock:', error);
        throw error;
    }
}

export async function updateStockStatus(domain, product, statusUpdate, qnt) {
    if (!domain || !product || !statusUpdate || typeof qnt === 'undefined') {
        throw new Error('Missing required parameters');
    }

    if (typeof qnt !== 'number') {
        throw new Error('Quantity must be a number');
    }

    try {
        await dbConnect(domain);
        
        const validStatuses = ['inProgress', 'inDelivery', 'delivered', 'damaged'];
        
        if (!validStatuses.includes(statusUpdate)) {
            throw new Error('Invalid status. Must be one of: ' + validStatuses.join(', '));
        }

        const stock = await Stock.findOne({ product });
        if (!stock) {
            throw new Error('Product not found in stock');
        }

        const update = {};
        update[statusUpdate] = (stock[statusUpdate] || 0) + qnt;

        const updatedStock = await Stock.findOneAndUpdate(
            { product },
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!updatedStock) {
            throw new Error('Failed to update stock status');
        }

        return updatedStock;
    } catch (error) {
        console.error('Error in updateStockStatus:', error);
        throw error;
    }
}
