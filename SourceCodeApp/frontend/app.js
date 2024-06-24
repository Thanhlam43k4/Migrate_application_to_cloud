// app.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { verify } = require('crypto');
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

      res.redirect('/homePage');

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
        return res.redirect('/homePage');
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.render('home_demo', { user: null, notification: 'Hãy đăng nhập trước khi truy cập vào cửa hàng!!!' });
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
app.get('/homePage',authenticateJWT_log, (req, res) => {
  res.render('home_demo',{user:req.user,notification: null});
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

app.get('/myCart', authenticateJWT_log, async (req, res) => {
  try {
    let id = req.user.id;
    const response = await axios.post(`http://localhost:8002/getCartDemo`, { id });
    const errorMessage = req.query.error;
    const successMessage = req.query.successMessage;
    console.log(response.data);
    res.render('carts', {
      user: req.user,
      cartItems: response.data,
      error: errorMessage,
      success: successMessage
    })


  } catch (err) {
    res.render(`/carts?error = Error function can't remove products from cart`)
    console.error('Error occurred while logging in:', err);
  }

})
app.post('/add-to-cart/:id', authenticateJWT_log, async (req, res) => {
  try {
    let productId = req.params.id;
    let customerId = req.user.id;
    let quantity = 1000;
    const response = await axios.post(`http://localhost:8002/addtoCartDemo`, { productId, customerId, quantity })
    console.log('Add product to Cart Sucessfully!');

    res.redirect('/myCart?successMessage= Add product to Cart Successfully!');

  } catch (err) {
    console.log('Error occured while loggin in:', err);
    res.redirect('/product-table')
  }
})


app.post('/remove-from-cart/:id', authenticateJWT_log, async (req, res) => {
  try {
    let productId = req.params.id;
    let customerId = req.user.id;
    const response = await axios.post(`http://localhost:8002/removetoCartDemo`, { customerId, productId });

    console.log('Remove product from Cart Sucessfully!');
    if (response.data > 0) {
      res.redirect('/myCart?successMessage= Remove product from Cart Successfully!');
    } else {
      res.redirect('/myCart?error= Error from system!');
    }

  } catch (err) {
    console.log('Error occured while loggin in:', err);
    res.redirect('/product-table')
  }
})


app.get('/logout', (req, res) => {
  // Clear any user session or authentication tokens
  // For example, if you're using sessions:
  res.clearCookie('token');
  res.redirect('/');
});




app.listen(port, () => {
  console.log(`Frontend server listening at http://${process.env.SERVER_URL}:${port}`);
});