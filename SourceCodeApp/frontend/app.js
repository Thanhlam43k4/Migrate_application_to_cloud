// app.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());




// Render login page
app.get('/',(req,res) =>{
  res.render('home');
})
app.get('/login', (req, res) => {
  // Pass error message as a parameter if present
  const errorMessage = req.query.error;
  res.render('login', { error: errorMessage });
});

app.get('/addproduct',(req,res) =>{
  const errorMessage = req.query.error;
  res.render('add-product', { error: errorMessage });
})



app.post('/login', async (req, res) => {
  try {
    const response = await axios.post('http://customer:8003/login', req.body);//dockerfile http://customer:8003/login
    // Check if the response contains a success message
    // if (response.data.success) {
      // If login is successful, render the product view page
      res.render('productView', { products: response.data.data });
    // 
  } catch (error) {
    // Handle other errors
    console.error('Error occurred while logging in:', error);
    if (error.response && error.response.status === 401) {
      // Unauthorized - Password does not match
      res.redirect('/login?error=Password does not match');
    } else {
      // Other errors
      res.redirect('/login?error=Password does not match');
    }
  }
});



// Render signup page
app.get('/signup', (req, res) => {
  const errorMessage = req.query.error;
  res.render('signup', { error: errorMessage });
});
app.get('/logout', (req, res) => {
  // Clear any user session or authentication tokens
  // For example, if you're using sessions:
  res.redirect('/');
});
// Handle signup form submission
app.post('/signup', async (req, res) => {
  try {
    const response = await axios.post('http://customer:8003/signup', req.body);//dockerfile http://customer:8003/login
    res.redirect('/login');
    if(response.data.msg == "User is already existed"){
      res.redirect('/login?error=Email is already exist');
    }
  } catch (error) {
    // Handle other errors
    console.error('Error occurred while Signup in:', error);
    if (error.response && error.response.status === 401) {
      // Unauthorized - Password does not match
        
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
    const response = await axios.get('http://product:8001/${productId}');//dockerfile http://product:8001/
    
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
app.post('/addproduct', async (req, res) => {
  const { name, type, amount } = req.body;

  try {
      // Make a POST request to your backend API
      const response = await axios.post('http://product:8001/add-products', {//dockerfile http://product:8001/add-products
          name: name,
          type: type,
          amount: amount
      });

      // Check the response from the server
      if (response.data.msg === 'Product has already existed!!!') {
        // Redirect to the same page with error message
        res.redirect('/addproduct?error=Product has already existed');
      } else if (response.data.msg == "Add product successfully!!!"){
        // Redirect to the same page without error message
        res.redirect('/');
      }
  } catch (error) {
      // Handle errors
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(port, () => {
  console.log(`Frontend server listening at http://Localhost:${port}`);
});