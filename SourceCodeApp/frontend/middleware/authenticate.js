
// app.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { createClient } = require('redis');
const crypto = require('crypto');
const app = express();
const port = 3000;
dotenv.config({ path: '../.env' })
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"))


const authenticateJWT_reset = (req, res, next) => {

    const token_reset = req.cookies.token_reset;
    if (token_reset) {
        jwt.verify(token_reset, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                throw err;
            }
            req.user = decoded;
            console.log(req.user);
            next();
        });
    } else {
        next();
    }
}

const authenticateJWT_access_key = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.redirect('/homePage');
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.render('home_demo', { user: null, notification: 'Hãy đăng nhập trước khi truy cập vào cửa hàng!!!' });
    }
};

const authenticateJWT_reg = (req, res, next) => {
    const token = req.cookies.token_reg;
    console.log(token);

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(400).json({ msg: 'Not token found!!' });
            }
            req.user = decoded;
            next();
        });
    } else {
        next();
    }
};

const authenticateJWT_log = async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.redirect('/login');
            }
            req.user = decoded;
            console.log(req.user);
            next();

        });
    } else {
        next();
    }
};

module.exports = {
    authenticateJWT_access_key,
    authenticateJWT_log,
    authenticateJWT_reg,authenticateJWT_reset
}