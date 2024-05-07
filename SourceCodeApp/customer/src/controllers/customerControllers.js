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
    let email = req.body.email;
    let password = req.body.password;
    // const {email,password} = req.body;
    queryAsync('SELECT * FROM customers WHERE email = ?', [email])
        .then((results) => {
            if (results.length > 0) {
                const customerpassword = results[0].password;
                return customerRepository.comparePassword(password, customerpassword);
            }
        })
        .then((passwordMatch) => {
            if (passwordMatch) {
                console.log('Login successfully');
                return customerRepository.fetchAllProducts();
            } else {
                throw new Error('Password does not match');
            }
        })
        .then((data) => {
            if (data) {
                console.log(data);
                res.status(200).json({ data });
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
export default {
    getAllUser,
    signup,
    login,
    getProfile,
    addInforCus,
    getHomePage
}