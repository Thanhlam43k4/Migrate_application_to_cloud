import express from 'express'
import * as dotenv from 'dotenv'
import { Create_connect,con } from './database/database.js'
import bodyParser  from 'body-parser'


dotenv.config({path : '../.env'})

import customerRouter from './routes/customerRoutes.js'
import { configViewEngine } from './config/viewEngine.js'
const port = process.env.PORT || 8003
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


configViewEngine(app);

app.use('/',customerRouter);


app.listen(port,()=>{   
    Create_connect();
    console.log(`Customer listening on port ${port}`)
})