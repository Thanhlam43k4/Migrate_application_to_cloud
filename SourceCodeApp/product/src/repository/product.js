
import * as dotenv from 'dotenv'
import { con } from '../database/database.js'
dotenv.config()

const AddProduct = async ({
    name,
    type,
    amount,
    price,
    image
}) => {
    try {
        con.query(`INSERT INTO products(name,type,amount,price,image)
                    VALUES (?, ?, ?, ?,?)`,
            [name, type, amount,price,image],
            function (err, results) {
                if (err) {
                    console.log('Error not add products!!');
                }else{
                    console.log('Insert Product Successfully!!!!');
                }
                
                console.log(results);
            })
    } catch (err) {
        console.error('Error during insert:', err);
    }
}

export default {
    AddProduct,

}