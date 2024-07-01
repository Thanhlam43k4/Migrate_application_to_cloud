import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { con } from '../database/database.js'
import axios from 'axios'

dotenv.config({ path: '../.env' })
import jwt from "jsonwebtoken"

let verificationLink = null;

async function comparePassword(plainPassword, hashedPassword) {
    try {
        const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return passwordMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw new Error('Error comparing passwords');
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

const signup = async ({ username, email, password }) => {
    try {
        const hashkey = process.env.SALT_ROUNDS;
        const hashpassword = await bcrypt.hash(password, parseInt(hashkey));

        // Insert into Database
        const results = await queryAsync(
            `INSERT INTO customers (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashpassword]
        );

        const userId = results.insertId;
        console.log(userId);

        await queryAsync(
            `INSERT INTO cus_profile (user_id, email, username) VALUES (?, ?, ?)`,
            [userId, email, username]
        );
        const token_reg = await jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '10m' });
        return token_reg;
    } catch (err) {
        console.error('Error during signup:', err);
    }
};
const updateCus = async ({
    address, phoneNumber,
    customerId
}) => {
    try {
        con.query('UPDATE customers SET address = ?, phoneNumber = ? WHERE id = ?',
            [address, phoneNumber, customerId],
            function (err, results) {
                if (err) {
                    // Handle the error (e.g., log it or return an error response)
                    console.error('Error executing SELECT query:', err);
                    throw new Error('Internal Server Error');
                }
                console.log(results);
            })
    } catch (err) {
        console.error('Error during updateCus:', err);
    }
}
async function fetchAllProducts() {
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
async function getUser(username, email) {
    const userDetail = {
        username: username,
        email: email,
    }
    return userDetail;

}
export default {
    signup, updateCus, fetchAllProducts, comparePassword, getUser, verificationLink
}