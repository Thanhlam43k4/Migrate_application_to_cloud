const axios = require('axios');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

function checkpassWord(pass1, pass2) {
  return pass1 === pass2;
}
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
module.exports = {
  checkpassWord,
  checkAdminRole,
  generateRandomHexCode,
  checkverify
}