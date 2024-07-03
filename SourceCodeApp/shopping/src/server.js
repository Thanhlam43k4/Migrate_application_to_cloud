import express from 'express'
import * as dotenv from 'dotenv'
import { Create_connect, con } from './database/database.js'
import bodyParser from 'body-parser'
dotenv.config()
import axios from 'axios'
import shoppingRoutes from './routes/index.js'

import cors from "cors"
const port = process.env.PORT || 8002
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());







app.use('/', shoppingRoutes);



app.listen(port, () => {
    Create_connect();
    console.log(`Shopping Service listening on port ${port}`)
})



