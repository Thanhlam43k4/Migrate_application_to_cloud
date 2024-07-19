// app.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;


dotenv.config({ path: '../.env' })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"))



// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    // Check if the file type is allowed
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});
function handleFileUploadError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.redirect('/getProfile?error= File size exceeds 2MB')
    }
  } else if (err) {
    return res.status(400).send(err.message);
  }
  next();

}

const {
  authenticateJWT_access_key,
  authenticateJWT_log,
  authenticateJWT_reg, authenticateJWT_reset
} = require('./middleware/authenticate.js')
const
  {
    checkpassWord,
    checkAdminRole,
    generateRandomHexCode,
    checkverify
  }
    = require('./middleware/checkmiddle.js')
let random_Code = null;
app.get('/login', (req, res) => {
  // Pass error message as a parameter if present
  res.clearCookie('token');
  const errorMessage = req.query.error;
  const successMessage = req.query.successMessage;
  res.render('login', { error: errorMessage, success: successMessage });
});
app.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`http://${process.env.CUSTOMER_SERVICE_URL}:${process.env.CUSTOMER_PORT}/login`, req.body);//dockerfile http://customer:8003/login
    console.log('Successfull');
    if (response.data.token) {
      const token = response.data.token;
      console.log(token);
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/homePage');
    } else if (response.data.msg == `Password doesn't not match!!`) {
      res.redirect('/login?error= Password does not match!!');
    } else if (response.data.msg == 'Email is not registered!!') {
      res.redirect('/login?error= Email is not registered!!')
    }
    else {
      res.redirect('/login?error= Time out Login');
    }


    // 
  } catch (error) {
    // Handle other errors
    console.error('Error occurred while logging in.', error);
    if (error.response && error.response.status === 401) {
      // Unauthorized - Password does not match
      res.redirect('/login?error=Error response status');
    }
  }
}
);
app.get('/addproduct', authenticateJWT_access_key, checkAdminRole, (req, res) => {
  const errorMessage = req.query.error;
  res.render('add-product', { error: errorMessage });
})
app.get('/product-table', authenticateJWT_access_key, async (req, res) => {
  const errorMessage = req.query.error;
  try {
    const response = await axios.get(`http://${process.env.PRODUCT_SERVICE_URL}:${process.env.PRODUCT_PORT}/api/v1/data`)
    res.render('productView', { user: req.user, products: response.data, error: errorMessage });

  } catch (err) {
    console.log(err);
  }

})
app.get('/homePage', authenticateJWT_log, checkverify, (req, res) => {
  console.log(req.user);
  res.render('home_demo', { user: req.user, notification: null });
})
// Render signup page
app.get('/signup', (req, res) => {

  const errorMessage = req.query.error;
  const errorPass = req.query.errorPass;
  res.render('signup', { error: errorMessage, errorPass: errorPass });

});
// Handle signup form submission
app.post('/signup', async (req, res) => {

  try {
    const response = await axios.post(`http://${process.env.CUSTOMER_SERVICE_URL}:${process.env.CUSTOMER_PORT}/signup`, req.body);//dockerfile http://customer:8003/login
    console.log(response.data.email);
    let token_reg = response.data.token;
    /*
    if(response.data.token){
      const token = response.data.token;
      console.log(token);
      res.cookie('token', token, { httpOnly: true });
    }
    */
    if (response.data.msg == 'Email is already existed') {
      res.redirect('/login?error=Email is already exist');
    } else {
      const data = response.data.email

      random_Code = generateRandomHexCode(16);
      const send_email = await axios.post(`http://${process.env.CUSTOMER_SERVICE_URL}:${process.env.CUSTOMER_PORT}/sendEmail`, {
        email: data,
        code: random_Code,
        msg: 'Sign Up Email!!'
      });
      //  console.log(send_email);
      res.redirect('/login?successMessage=Signup successful. Please log in.');
    }

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
app.get('/verify/:email/:verifyCode', async (req, res) => {
  let email = req.params.email;
  let verifyCode = req.params.verifyCode;
  console.log(email, verifyCode);
  try {
    const response = await axios.post(`http://${process.env.CUSTOMER_SERVICE_URL}:${process.env.CUSTOMER_PORT}/verify`, { email: email });
    if (response.data.msg == 'Database error') {
      res.status(200).json({ err: 'Error from database query' });
    }
    if (response.data.msg == 'Account verified! You can now log in.') {
      console.log('Account verified! You can now log in.');
      res.clearCookie('token_reg');
      res.redirect('/login?successMessage= Verified Sucessfully Please Login!')
    } else {
      res.redirect('/login?error= Cannot verifiy please check email and click the link again');
    }
  } catch (err) {
    if (err) {
      console.log(err);
      throw err;
    }
  }



})
app.get('/logout', (req, res) => {
  // Clear any user session or authentication tokens
  // For example, if you're using sessions:
  res.clearCookie('token');
  res.redirect('/homePage');
});
app.get('/resetPass', (req, res) => {
  const errorMessage = req.query.error;
  const successMessage = req.query.successMessage;
  res.render('resetPass', { error: errorMessage, success: successMessage });
})
app.post('/resetPass', async (req, res) => {
  const email = req.body.email;
  const code = generateRandomHexCode(16);
  const send_email = await axios.post(`http://${process.env.CUSTOMER_SERVICE_URL}:${process.env.CUSTOMER_PORT}/sendEmail`, {
    email: email,
    msg: 'Reset password Email!!',
    code: code
  });
  console.log('Send verification to your email successfully!!')
  res.redirect('/resetPass?successMessage= Please Check your email for reseting password')
})
app.get('/resetPass/:email/:code', async (req, res) => {
  const email = req.params.email;
  const token_reset = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '10m' });
  res.cookie('token_reset', token_reset, { httpOnly: true });
  const error = req.query.error;
  const success = req.query.success;
  res.render('resetPassForm', { email: email, error: error, success: success });
})
app.post('/updatePassWord', authenticateJWT_reset, async (req, res) => {
  if (req.user) {
    const email = req.user.email;
    const password = req.body.password;
    const response = await axios.post(`http://${process.env.CUSTOMER_SERVICE_URL}:${process.env.CUSTOMER_PORT}/updatePassWord`, {
      email: email,
      password: password
    })
    if (response.data.msg == 'Change Password Successfully!') {
      res.clearCookie('token_reset');
      res.redirect('/login?successMessage= Reset password Sucessfully Please Log in')
    } else {
      res.status(200).json({ msg: 'Cannot change password!!' });
    }
  } else {
    res.redirect('/resetPass?error= Please reset password again');
  }


})
app.get('/getProfile', authenticateJWT_log, async (req, res) => {
  if (req.user != null) {
    let id = req.user.id;
    console.log('id:', id);
    try {
      const response = await axios.post(`http://${process.env.CUSTOMER_SERVICE_URL}:${process.env.CUSTOMER_PORT}`, {
        id: id
      });
      res.render('getProfile', { user: response.data.results[0], error: req.query.error })
    } catch (err) {
      throw err;
    }
  } else {
    res.redirect('/login?error= Your session login is expired Please login again')
  }
})
app.post('/addproduct', authenticateJWT_access_key, checkAdminRole, upload.single('profilePicture'), async (req, res) => {
  const { name, type, amount, price, image} = req.body;
  console.log(req.filename)
  try {
    // Make a POST request to your backend API
    const price = parseFloat(req.body.price);
    const response = await axios.post(`http://${process.env.PRODUCT_SERVICE_URL}:${process.env.PRODUCT_PORT}/add-products`, {//dockerfile http://product:8001/add-products
      name: name,
      type: type,
      amount: amount,
      price: price,
      image: image ? `/uploads/${image}` : null,
    });

    if (response.data.msg === 'Product has already existed!!!') {
      // Redirect to the same page with error message
      res.redirect('/addproduct?error=Product has already existed');
    } else if (response.data.msg == "Add product successfully!!!") {
      // Redirect to the same page without error message
      res.redirect('/product-table');
    }
  } catch (error) {
    // Handle errors
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/update-profile', authenticateJWT_log, upload.single('profilePicture'), handleFileUploadError, async (req, res) => {
  if (req.user != null) {
    let id = req.user.id;
    try {
      let phone = req.body.phone;
      let gender = req.body.gender;
      let city = req.body.city;
      let country = req.body.country;
      let address = req.body.address;
      let profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

      const response = await axios.post(`http://${process.env.CUSTOMER_SERVICE_URL}:${process.env.CUSTOMER_PORT}/updateProfile`, {
        user_id: id,
        phone: phone,
        gender: gender,
        city: city,
        country: country,
        address: address,
        profile_picture: profilePicture
      });

      if (response.data.msg == 'Update Information Successfully!!') {
        let user = {
          user_id: id,
          phone: phone,
          gender: gender,
          city: city,
          country: country,
          address: address,
          profile_picture: profilePicture
        };
        console.log(user);
        res.redirect('/getProfile');
      } else {
        res.redirect('/getProfile');
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  } else {
    res.redirect('/login?error=Your session login is expired. Please login again.');
  }
});
app.get('/', (req, res) => {
  res.redirect('/homePage');
})
app.get('/myCart', authenticateJWT_log, async (req, res) => {
  if (req.user != null) {
    let id = req.user.id;
    const errorMessage = req.query.error;
    const successMessage = req.query.successMessage;
    try {
      const response = await axios.post(`http://${process.env.SHOPPING_SERVICE_URL}:${process.env.SHOPPING_PORT}/getCartDemo`, { id });

      let total = 0;
      response.data.forEach(
        item => {
          total += (parseFloat(item.price)) * (item.quantity);
        })
      console.log(total);
      res.render('carts', {
        user: req.user,
        cartItems: response.data,
        error: errorMessage,
        success: successMessage,
        total: total
      })
      /*
      client.get('cartItems', async (err, cachedCartItems) => {
        if (err) {
          console.log('Cache redis: ', err);
          throw err;
        }
        if (cachedCartItems) {
          console.log('Cache hit');
          res.render('carts', {
            user: req.user,
            cartItems: response.data,
            error: errorMessage,
            success: successMessage
          })
        } else {
          console.log('Cache hit');
          try {
            const response = await axios.post(`http://localhost:8002/getCartDemo`, { id });
            client.setEx('cartItems',3600,JSON.stringify(response.data));
            res.render('carts', {
              user: req.user,
              cartItems: response.data,
              error: errorMessage,
              success: successMessage
            })
            
          } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          }
          
        }
      })*/
    } catch (err) {
      res.redirect('/homePage')
      console.error('Error occurred while logging in:', err);
    }
  } else {
    res.redirect('/login?error= Your session login is expired Please login again')
  }


})
app.post('/add-to-cart/:id', authenticateJWT_log, async (req, res) => {
  try {
    let productId = req.params.id;
    let customerId = req.user.id;
    const response = await axios.post(`http://${process.env.SHOPPING_SERVICE_URL}:${process.env.SHOPPING_PORT}/addtoCartDemo`, { productId, customerId })
    console.log('Add product to Cart Sucessfully!');

    res.redirect('/myCart?successMessage= Add product to Cart Successfully!');

  } catch (err) {
    console.log('Error occured while loggin in:', err);
    res.redirect('/product-table')
  }
})
app.post('/updateCartQuantity/:id', authenticateJWT_log, async (req, res) => {
  const CartId = req.params.id;
  const quantity = req.body.selectedQuantity;
  console.log(quantity);
  try {
    const response = await axios.post(`http://${process.env.SHOPPING_SERVICE_URL}:${process.env.SHOPPING_PORT}/updateCartQuantity`, {
      CartId: CartId,
      quantity: quantity
    })
    if (response.data.msg == 'Update Quantity from cart successfully') {
      res.redirect('/myCart')
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
})
app.post('/remove-from-cart/:id', authenticateJWT_log, async (req, res) => {
  try {
    let cartId = req.params.id;
    let customerId = req.user.id;
    const response = await axios.post(`http://${process.env.SHOPPING_SERVICE_URL}:${process.env.SHOPPING_PORT}/removetoCartDemo`, { customerId, cartId });

    console.log('Remove product from Cart Sucessfully!');
    res.redirect('/myCart?successMessage= Remove product from Cart Successfully!');
  } catch (err) {
    console.log('Error occured while loggin in:', err);
    console.log('Error query system')
    res.redirect('/myCart?error= Error from system!');
  }
})
app.post('/payment', authenticateJWT_log, async (req, res) => {
  const customerId = req.user.id;
  const customerName = req.body.name;
  const totalPrice = req.query.total;
  const phone = req.body.phone;
  try {
    const response = await axios.post(`http://${process.env.SHOPPING_SERVICE_URL}:${process.env.SHOPPING_PORT}/addPayment`, {
      customerId: customerId,
      customerName: customerName,
      totalPrice: totalPrice,
      phone: phone
    })
    if (response.data.msg == 'Error Query Add Payment') {
      res.redirect('/myCart?error= Can not add this payment')
    } else if (response.data.msg == 'Add Payment Successfully') {
      const response1 = await axios.post(`http://${process.env.SHOPPING_SERVICE_URL}:${process.env.SHOPPING_PORT}/deleteAllCart`, {
        customerId: customerId
      })
      res.render('bill', { name: customerName, total: totalPrice })
    } else {
      res.redirect('/myCart?error= Internal Service Error!!!');
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.listen(port, () => {
  console.log(`Frontend server listening at http://${process.env.SERVER_URL}:${port}`);
});