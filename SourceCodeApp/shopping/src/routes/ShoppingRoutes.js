import express from 'express'
import {
    body
    , validationResult
} from 'express-validator'
import {
    shoppingControllers
} from '../controllers/index.js'
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser'


dotenv.config()
const app = express()
app.use(cookieParser())



const router = express.Router();


router.post('/addtoCartDemo',shoppingControllers.addtoCartDemo);
router.post('/getCartDemo',shoppingControllers.getCartDemo);
router.post('/removetoCartDemo',shoppingControllers.removetoCartDemo);

export default router

