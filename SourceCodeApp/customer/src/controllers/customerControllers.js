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
import crypto from 'crypto'
import customerRepository from '../repository/customer.js'
import { sendEmailService } from "../repository/emailService.js";
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
dotenv.config({ path: '../.env' })
import bodyParser from 'body-parser';
import express from 'express'
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET
let token_reg = null

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
    res.clearCookie('token');
    res.clearCookie('token_reg');
    try {
        con.query(
            'SELECT * FROM customers WHERE email = ?',
            [email],
            function (err, results) {
                if (err) {
                    // Handle the error (e.g., log it or return an error response)
                    console.error('Error executing SELECT query:', err);
                    throw new Error('Internal Server Error');
                }
                if (results.length > 0) {
                    console.log(results);
                    res.status(200).json({ msg: 'Email is already existed' })
                } else {
                    
                    customerRepository.signup({ username, email, password })
                    res.status(200).json({ msg: 'Add user successfully', email });
                }
            })

    } catch (err) {
        console.log(err);
        throw err;
    }


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
    let id = null;
    let role = null;
    let verified = null;    // const {email,password} = req.body;
    queryAsync('SELECT * FROM customers WHERE email = ?', [email_])
        .then((results) => {
            if (results.length > 0) {
                username = results[0].username;
                id = results[0].id;
                role = results[0].role;
                verified = results[0].verified;
                const customerpassword = results[0].password;

                return customerRepository.comparePassword(password_, customerpassword);
            }
        })
        .then((passwordMatch) => {
            if (passwordMatch) {
                const token = jwt.sign({ id: id, username: username, email: email_, role: role }, JWT_SECRET, { expiresIn: '20m' })
                console.log(`Login successfully with token ${token}`);

                ///return customerRepository.getUser(username,email_);

                res.status(200).json({ msg: 'Login Successfully', token });
            } else {
                console.log(`password Doesn't not match`)
                res.status(200).json({ msg: `Password doesn't not match!!` })
            }
        })
        .catch((err) => {
            console.error('Error during login:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });


}
async function getProfile(req, res) {
    const customerId = req.body.id;
    try {
        con.query('SELECT * FROM customers WHERE id = ?',
            [customerId],
            function (err, results) {
                res.status(200).json({results});
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
async function getProducts(req, res) {
    const productAPIUrl = `http://${process.env.PRODUCT_SERVICE_URL}:${process.env.PRODUCT_PORT}/api/v1/data`;
    console.log(productAPIUrl);
    try {
        const response = await axios.get(productAPIUrl);
        const productDetails = response.data; // Access the 'results' property
        return productDetails;
    } catch (err) {
        console.log('Error fetching product data:', err.message);
        throw err; // Propagate the error
    }

}
async function verify(req, res) {
    console.log(req.body);
    let email = req.body.email;
    console.log(email);
    const updateUserQuery = 'Update customers set verified = true WHERE email = ?';
    try {
        con.query(updateUserQuery, [email], (err, results) => {
            if (err) {
                return res.status(500).json({ msg: 'Database error' });
            }
            return res.json({ msg: 'Account verified! You can now log in.' });
        })
    } catch (err) {
        if (err) throw err;
    }

}
async function checkverify(req, res) {
    const id = req.body.id
    const checkQuery = 'SELECT * FROM customers WHERE id = ?';
    try {
        con.query(checkQuery, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ msg: 'Error Query' });
            }
            let data = (results[0]).verified;
            if (data == 1) {
                res.status(200).json({ msg: `Person is verified!!!` });
            } else {
                res.status(200).json({ msg: `Persion isn't verified!!!` });
            }
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
}
const updatePassword = async(req,res) =>{
    const email = req.body.email;
    const password = req.body.password;

    const hashkey = process.env.SALT_ROUNDS;
    const hashpassword = await bcrypt.hash(password, parseInt(hashkey));
    try{
        con.query(`UPDATE customers SET password = ?  WHERE email = ?`,
        [hashpassword,email],
        function(err,results){
            if(err){
                console.log(err);
                console.log('Can not update new password')
            }
        })
        console.log('Change password')
        res.status(200).json({msg : 'Change Password Successfully!'});
    }catch(err){
        res.status(200).json({msg : 'Error from the queries'});
        throw err;
    }

}
const sendEmailController = async (req, res) => {
    try {
        const email = req.body.email;
        console.log(req.body.msg);
        let URL_LINK = null;
        if (req.body.msg == 'Sign Up Email!!') {
            URL_LINK = `http://localhost:3000/verify/${email}/${req.body.code}`
        } else if (req.body.msg == 'Reset password Email!!') {
            URL_LINK = `http://localhost:3000/resetPass/${email}/${req.body.code}`
        }
        if (email) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            const info = await transporter.sendMail({
                from: `"Uet WebSite for verfication" ${process.env.EMAIL_USERNAME}`, // sender address
                to: email, // list of receivers
                subject: "Verification your email at website VNU_UET", // Subject line
                text: `Please verify your email by clicking the following link: ${URL_LINK}`,
                html: `<p>Please verify your email by clicking the following link: <a href=${URL_LINK}>Verify Email</a></p>`,
            });
            return res.json(info);
        }
        return res.json({
            status: 'err',
            msg: 'The email is required'
        })
    } catch (err) {
        console.log(err);
        return res.json({
            status: 'err'
        })
    }
}
async function updateProfile(req,res){
    const user_id = req.body.user_id;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const city = req.body.city;
    const country = req.body.city;


}



export default {
    getAllUser,
    signup,
    login,
    getProfile,
    addInforCus,
    getHomePage,
    getProducts,
    sendEmailController,
    verify,
    checkverify,
    updatePassword
}
