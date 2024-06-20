// app.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
dotenv.config({ path: '../.env' })
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());






// Render login page

app.get('/login', (req, res) => {
  // Pass error message as a parameter if present
  const errorMessage = req.query.error;
  const successMessage = req.query.successMessage;
  res.render('login', { error: errorMessage, success: successMessage });
});





app.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`http://${process.env.CUSTOMER_SERVICE_URL}:${process.env.CUSTOMER_PORT}/login`, req.body);//dockerfile http://customer:8003/login
    // Check if the response contains a success message
    // if (response.data.success) {
    // If login is successful, render the product view page
    //res.render('productView', { products: response.data.data });
    console.log('Successfull');
    // if(response.data.success){
    //   console.log(response.data.data)
    //   res.render('home',{user: response.data.data})
    // }
    if (response.data.token) {

      const token = response.data.token;

      res.cookie('token', token, { httpOnly: true });

      res.redirect('/');

    } else {
      res.redirect('/login');
    }
    // 
  } catch (error) {
    // Handle other errors
    console.error('Error occurred while logging in:', error);
    if (error.response && error.response.status === 401) {
      // Unauthorized - Password does not match
      res.redirect('/login?error=Error response status');
    } else {
      // Other errors
      res.redirect('/login?error=Password does not match');
    }
  }
});

const authenticateJWT_log = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.redirect('/login');
      }
      req.user = decoded;
      next();
    });
  } else {
    next();
  }
};
const authenticateJWT_access_key = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.redirect('/');
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.render('home', { user: null, notification: 'Please log in!!!!' });
  }
};

app.get('/addproduct', authenticateJWT_access_key, (req, res) => {
  const errorMessage = req.query.error;
  res.render('add-product', { error: errorMessage });
})

app.get('/product-table', authenticateJWT_access_key, async (req, res) => {
  try {
    const response = await axios.get(`http://${process.env.PRODUCT_SERVICE_URL}:${process.env.PRODUCT_PORT}/api/v1/data`)
    console.log(response.data);
    res.render('productView', { products: response.data });

  } catch (err) {
    console.log(err);
  }

})
app.get('/', authenticateJWT_log, (req, res) => {

  console.log(req.user);

  res.render('home', { user: req.user, notification: null });

})

// Render signup page

app.get('/signup', (req, res) => {

  const errorMessage = req.query.error;

  res.render('signup', { error: errorMessage });

});

// Handle signup form submission


app.post('/signup', async (req, res) => {
  try {

    const response = await axios.post(`http://${process.env.CUSTOMER_SERVICE_URL}:${process.env.CUSTOMER_PORT}/signup`, req.body);//dockerfile http://customer:8003/login
    console.log('test')
    if (response.data.msg == "User is already existed") {

      res.redirect('/login?error=Email is already exist');

    }
    res.redirect('login?successMessage=Signup successful. Please log in.');
  } catch (error) {
    // Handle other errors
    console.error('Error occurred while Signup in:', error);
    if (error.response && error.response.status === 401) {
      // Unauthorized - Password does not match
      res.redirect('/login?error=Error Response and status = 401');
    } else {
      // Other errors
      res.redirect('/login?error=Error Input');
    }
  }

});



app.get('/view/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    // Fetch product details from your backend API
    const response = await axios.get(`http://${process.env.PRODUCT_SERVICE_URL}:${process.env.PRODUCT_PORT}/${productId}`);//dockerfile http://product:8001/

    const product = await response.data;
    // console.log('Product:' + product);
    console.log(response.data);
    // Render the product details page with the fetched product data
    res.render('productDetails', { product });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/addproduct', authenticateJWT_access_key, async (req, res) => {
  const { name, type, amount } = req.body;

  try {
    // Make a POST request to your backend API
    const response = await axios.post(`http://${process.env.PRODUCT_SERVICE_URL}:${process.env.PRODUCT_PORT}/add-products`, {//dockerfile http://product:8001/add-products
      name: name,
      type: type,
      amount: amount
    });

    // Check the response from the server
    if (response.data.msg === 'Product has already existed!!!') {
      // Redirect to the same page with error message
      res.redirect('/addproduct?error=Product has already existed');
    } else if (response.data.msg == "Add product successfully!!!") {
      // Redirect to the same page without error message
      res.redirect('/');
    }
  } catch (error) {
    // Handle errors
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/logout', (req, res) => {
  // Clear any user session or authentication tokens
  // For example, if you're using sessions:
  res.clearCookie('token');
  res.redirect('/');
});


app.listen(port, () => {
  console.log(`Frontend server listening at http://${process.env.SERVER_URL}:${port}`);
});