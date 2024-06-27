// app.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

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
const checkverify = async (req, res, next) => {
  if (req.user) {
    const user_id = req.user.id;
    console.log(user_id);

    const response = await axios.post(`http://${process.env.CUSTOMER_SERVICE_URL}:${process.env.CUSTOMER_PORT}/checkverify`, { id: user_id })
    console.log(response.data.msg);
    if (response.data.msg == 'Person is verified!!!') {
      next();
    } else {
      res.redirect('/login?error= Vui Lòng xác thực email trước khi đăng nhập');
    }
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

function checkAdminRole(req, res, next) {
  const user = req.user;

  if (user && user.role === 'admin') {
    next(); // User is admin, proceed to the next middleware or route handler
  } else {
    res.redirect('/product-table?error= Access denied. Admins only.')
  }
}
function generateRandomHexCode(length) {
  return crypto.randomBytes(length).toString('hex');
}
function checkpassWord(pass1, pass2) {
  return pass1 === pass2;
}


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
    } else if (response.data.msg == `Password doesn'tnot match!!`) {

      res.redirect('/login?error= Password does not match!!');
    } else {
      res.redirect('/login?error= Time out Login');
    }


    // 
  } catch (error) {
    // Handle other errors
    console.error('Error occurred while logging in.', err);
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
    console.log(response.data);
    res.render('productView', { products: response.data, error: errorMessage });

  } catch (err) {
    console.log(err);
  }

})
/*
app.get('/', authenticateJWT_log, (req, res) => {

  console.log(req.user);

  res.render('home', { user: req.user, notification: null });

})
*/
app.get('/homePage', authenticateJWT_log, checkverify, (req, res) => {
  //console.log(req.user);
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
  const pass1 = req.body.password;
  const pass2 = req.body.password2;
  if (pass1 != pass2) {
    res.redirect('/signup?errorPass= Password and Confirm Password do not match!!')
  }
  else {
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
          code: random_Code
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
app.post('/addproduct', authenticateJWT_access_key, checkAdminRole, async (req, res) => {
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
      res.redirect('/homePage');
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
    let cartId = req.params.id;
    let customerId = req.user.id;
    const response = await axios.post(`http://localhost:8002/removetoCartDemo`, { customerId, cartId });

    console.log('Remove product from Cart Sucessfully!');
    res.redirect('/myCart?successMessage= Remove product from Cart Successfully!');
  } catch (err) {
    console.log('Error occured while loggin in:', err);
    console.log('Error query system')
    res.redirect('/myCart?error= Error from system!');
  }
})
app.get('/logout', (req, res) => {
  // Clear any user session or authentication tokens
  // For example, if you're using sessions:
  res.clearCookie('token');
  res.redirect('/homePage');
});



app.listen(port, () => {
  console.log(`Frontend server listening at http://${process.env.SERVER_URL}:${port}`);
});