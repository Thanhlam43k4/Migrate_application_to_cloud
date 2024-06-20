import express from 'express'
import {body
    ,validationResult
} from 'express-validator'
import{
    customerControllers
}from '../controllers/index.js'

const router = express.Router();

router.get('/home-info',customerControllers.getHomePage);
router.get('/',customerControllers.getAllUser);

router.post('/signup',
    body('email').isEmail(),
    body('password').isLength({min:5}),
    body('username').isLength({min:3}),
    customerControllers.signup);

router.get('/:id',customerControllers.getProfile);

router.post('/:id/add-info',customerControllers.addInforCus);

router.get('/get-products',customerControllers.getProducts);

router.post('/login',
    body('email').isEmail(),
    body('password').isLength({min:5}),
    customerControllers.login);
    
export default router

