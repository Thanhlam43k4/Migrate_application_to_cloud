import express from 'express'
import * as dotenv from 'dotenv'
import { Create_connect,con } from './database/database.js'
import bodyParser  from 'body-parser'
dotenv.config()
import productRoutes from './routes/index.js'

const port = process.env.PORT || 8001
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',productRoutes);


app.listen(port,'0.0.0.0',()=>{
     Create_connect();
    console.log(`Product service listening on port ${port}`)
})