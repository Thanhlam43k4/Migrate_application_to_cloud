import express from 'express'
import {body
    ,validationResult
} from 'express-validator'
import{
    productControllers
}from '../controllers/index.js'

const router = express.Router();



router.post('/add-products',productControllers.AddProduct);
router.get('/',(req,res) =>{
    res.json({msg : 'Access product service successfully!!!'});
})
router.get('/:id',productControllers.viewDetails);
router.post('/',productControllers.viewDetailspost);
router.get('/api/v1/data',productControllers.getAllProduct);
    
export default router

