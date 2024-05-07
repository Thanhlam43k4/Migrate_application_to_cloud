import { 
    Create_connect,
    con
} from "../database/database.js";
import {body
    ,validationResult
} from 'express-validator'
import jwt from 'jsonwebtoken'
import shoppingRepository from '../repository/shoppingRepo.js'
import axios from 'axios'


async function getShoppingPage(req,res){
    res.json({
        books
    })

}

async function getProductDetails(req,res){
    const productId = req.params.id;
    console.log(productId);
    try{
        const data = await shoppingRepository.fetchProductDetails(productId);
        res.status(200).json({ data });
    }catch(err){
        res.status(500).json({ error: 'Error fetching product details' });
    }
}

export default{
   getShoppingPage,
    getProductDetails
}