import express from 'express'
import {body
    ,validationResult
} from 'express-validator'
import{
    customerControllers
}from '../controllers/index.js'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config({ path: '../.env' })
import bodyParser from'body-parser';


import cookieParser from 'cookie-parser'
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


const authenticateJWT_reg = (req, res, next) => {
    const token = req.query.token;
    console.log(token);
    
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(400).json({msg:'Not token found!!'});
        }
        req.user = decoded;
        next();
      });
    } else {
      next();
    }
  };

  
const router = express.Router();
router.get('/home-info',customerControllers.getHomePage);
router.get('/',customerControllers.getAllUser);

router.post('/signup',
    body('email').isEmail(),
    body('password').isLength({min:5}),
    body('username').isLength({min:3}),
    customerControllers.signup);
router.get('/verify',authenticateJWT_reg,customerControllers.verify)



router.get('/:id',customerControllers.getProfile);

router.post('/:id/add-info',customerControllers.addInforCus);

router.get('/get-products',customerControllers.getProducts);
router.post('/checkverify',customerControllers.checkverify);


router.post('/login',
    body('email').isEmail(),
    body('password').isLength({min:5}),
    customerControllers.login);
router.post('/sendEmail',customerControllers.sendEmailController)   



export default router

