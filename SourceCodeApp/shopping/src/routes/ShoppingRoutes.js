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




const verifyJWT = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
        return res.status(403).send('A token is required for authentication');

    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
        req.user = decoded;

    } catch (err) {
        return res.status(401).send('Invalid Token')
    }
    return next();
}


const router = express.Router();




router.post('/addtoCartDemo',shoppingControllers.addtoCartDemo);
router.post('/getCartDemo',shoppingControllers.getCartDemo);
router.post('/removetoCartDemo',shoppingControllers.removetoCartDemo);

export default router

