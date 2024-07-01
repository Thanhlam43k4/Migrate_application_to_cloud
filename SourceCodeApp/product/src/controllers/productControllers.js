import { 
    Create_connect,
    con
} from "../database/database.js";
import {body
    ,validationResult
} from 'express-validator'


import productRepository from '../repository/product.js'

async function AddProduct(req,res){

    const {name,type,amount,price} = req.body;
    con.query(
        'SELECT * FROM products WHERE name = ?',
        [name],
        function (err, results) {
            if (err) {
                // Handle the error (e.g., log it or return an error response)
                console.error('Error executing SELECT query:', err);
                throw new Error('Internal Server Error');
            }
            if (results.length > 0) {
                res.json({ msg: 'Product has already existed!!!' })
            }else{
                productRepository.AddProduct({name,type,amount,price})
                res.json({msg: "Add product successfully!!!"})
            }
        })    
}
async function updateProduct(req,res){
    const {name,type,amount,price} = req.body;
}
async function viewDetails(req,res){
    const productId = req.params.id;
    try{
        con.query('SELECT * FROM products WHERE id = ?',
        [productId],
        function (err, results) {
            res.status(200).json({results});
            console.log(results);
            console.log('Get One Product!!');
        })
    }catch(err){
        console.log('Error during viewing Products: ',err);
    }
}

async function getAllProduct(req,res){
    try{
        con.query('SELECT * FROM products',
            function(err,results){
                res.status(200).json(results);
                console.log('Get All Products Successfully');
            })
    }catch(err){
        console.log('Error druing get all Products')
    }
}
async function viewDetailspost(req,res){
    const productId = req.body;
    try{
        con.query('SELECT * FROM products WHERE id = ?',
        [productId],
        function (err, results) {
            res.json({results});
            console.log(results);
        })
    }catch(err){
        console.log('Error during viewing Products: ',err);
    }
}
export default{
   AddProduct,
   viewDetails,
   getAllProduct,
   viewDetailspost
}