import express from 'express'
import {body
    ,validationResult
} from 'express-validator'
import{
    shoppingControllers
}from '../controllers/index.js'
import * as dotenv from 'dotenv'
dotenv.config()

const router = express.Router();

router.get('/get-product/:id',shoppingControllers.getProductDetails);




export default router

