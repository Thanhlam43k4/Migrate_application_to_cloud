import {
    Create_connect,
    con
} from "../database/database.js";
import {
    body
    , validationResult
} from 'express-validator'
import { fetchData } from "../routes/api.js";
import bcrypt from 'bcryptjs'
import customerRepository from '../repository/customer.js'

import jwt from "jsonwebtoken"

import dotenv from "dotenv"
dotenv.config({path : '../.env'})



const JWT_SECRET = process.env.JWT_SECRET
async function getAllUser(req, res) {
    const apiData = await fetchData();
    con.query('SELECT * FROM customers', function (err, rows) {
        if (err) {
            res.json({ data: ' ' }, apiData);
        } else {
            res.json({ data: rows, apiData })
        }
    })

}
async function signup(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Error input type');
        return res.status(400).json({ error: errors.array() })
    }
    let username = req.body.username
    let email = req.body.email;
    let password = req.body.password;
    // const {username,email,password} = req.body;
    let a = true;
    con.query(
        'SELECT * FROM customers WHERE username = ? OR email = ?',
        [username, email],
        function (err, results) {
            if (err) {
                // Handle the error (e.g., log it or return an error response)
                console.error('Error executing SELECT query:', err);
                throw new Error('Internal Server Error');
            }
            if (results.length > 0) {
                console.log('User is already exist')
                res.json({msg: 'User is already existed'})
            } else {
                res.json({ msg: 'Add user Successfully!!!' })
                customerRepository.signup({ username, email, password })
            }
        })
}
function queryAsync(sql, values) {
    return new Promise((resolve, reject) => {
        con.query(sql, values, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}
async function login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Error input type');
        return res.status(400).json({ error: errors.array() })
    }
    let email_ = req.body.email;
    let password_ = req.body.password;
    let username = null;
    // const {email,password} = req.body;
    queryAsync('SELECT * FROM customers WHERE email = ?', [email_])
        .then((results) => {
            if (results.length > 0) {
                username = results[0].username;
                
                const customerpassword = results[0].password;
                
                return customerRepository.comparePassword(password_, customerpassword);
            }
        })
        .then((passwordMatch) => {
            if (passwordMatch) {
                const token = jwt.sign({username: username,email: email_}, JWT_SECRET)
                console.log(`Login successfully with token ${token}`);
        
                ///return customerRepository.getUser(username,email_);
                
                res.status(200).json({msg: 'Login Successfully',token});
            } else {
                throw new Error('Password does not match');
            }
        })
      
        .catch((err) => {
            console.error('Error during login:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}


async function getProfile(req, res) {
    const customerId = req.params.id;
    try {
        con.query('SELECT * FROM customers WHERE id = ?',
            [customerId],
            function (err, results) {
                res.json({ results });
                console.log(results);
            });
    } catch (err) {
        console.error('Error during login:', err);
    }
}
async function addInforCus(req, res) {
    const customerId = req.params.id;
    const { address, phoneNumber } = req.body;
    await customerRepository.updateCus({ address, phoneNumber, customerId })

    con.query('SELECT * FROM customers WHERE id = ?',
        [customerId],
        function (err, results) {
            res.json({ msg: 'This Data after updated', results });
        });
}

async function getHomePage(req, res) {
    res.render('home.ejs')

}
async function getProducts(req,res){
    const productAPIUrl = `http://${process.env.PRODUCT_SERVICE_URL}:${process.env.PRODUCT_PORT}/api/v1/data`;
    console.log(productAPIUrl);
    try{
        const response = await axios.get(productAPIUrl);
        const productDetails = response.data; // Access the 'results' property
        return productDetails;  
    }catch(err){
        console.log('Error fetching product data:', err.message);
        throw err; // Propagate the error
    }
    
}
export default {
    getAllUser,
    signup,
    login,
    getProfile,
    addInforCus,
    getHomePage,
    getProducts
}