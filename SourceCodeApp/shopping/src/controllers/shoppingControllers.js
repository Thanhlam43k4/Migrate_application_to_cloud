import {
    Create_connect,
    con
} from "../database/database.js";
import {
    body
    , validationResult
} from 'express-validator'
import jwt from 'jsonwebtoken'
import shoppingRepository from '../repository/shoppingRepo.js'
import axios from 'axios'
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import express from 'express'



dotenv.config({ path: '../.env' })


//Add product to CART

//Update quantity of Cart


//Remove product from cart


//Get customer Cart



async function getCartDemo(req, res) {
    const customerId = req.body.id;
    const query = `
    SELECT customers.username,cart.id, products.name, cart.quantity
    FROM cart
    JOIN products ON cart.product_id = products.id
    JOIN customers ON cart.customer_id = customers.id
    WHERE cart.customer_id = ?
    `
    try {
        con.query(query, [customerId],
            function (err, results) {
                if (err) {
                    console.log('Error Query Cart Service: ', err);
                }
                res.status(200).json(results);
                console.log('Get All Cart Successfully');

            })
    } catch (err) {
        if (err) throw err;
    }

}
async function removetoCartDemo(req, res) {
    const { cartId, customerId } = req.body;
    const query = `DELETE FROM cart WHERE customer_id = ? AND id = ?`;
    con.query(query, [customerId, cartId],
        (err, results) => {
            if (err) {
                console.error('Error executing DeleteQuery query:', err);
                throw new Error('Internal Server Error');
            }
            res.status(200).json({ msg: 'Delete product from cart sucessfully', results })
        })

}



async function addtoCartDemo(req, res) {
    const { productId, quantity, customerId } = req.body;
    const checkQuery = 'SELECT * FROM cart  WHERE customer_id = ? AND product_id = ?';

    con.query(checkQuery, [customerId, productId],
        (err, results) => {
            if (err) {
                console.error('Error executing checkQuery query:', err);
                throw new Error('Internal Server Error');
            }
            if (results.size > 0) {
                //Product is already in the cart, update the quantity
                const updateQuery = 'UPDATE cart SET quantity = quantity + ? WHERE customer_id = ? AND product_id = ?';
                con.query(updateQuery, [quantity, customerId, productId],
                    function (err, result) {
                        if (err) {
                            console.error('Error executing UPDATE query:', err);
                            throw new Error('Internal Server Error');
                        }
                        res.send('Cart updated successfully');
                    })
            } else {
                const insertQuery = 'INSERT INTO CART (customer_id, product_id, quantity) VALUES (?,?,?)'
                con.query(insertQuery, [customerId, productId, quantity],
                    function (err, result) {
                        if (err) throw err;
                        console.log('Product added to cart');
                        res.send('Product added to cart');
                    })
            }

        })

}




export default {
    getCartDemo, addtoCartDemo, removetoCartDemo

}