
import * as dotenv from 'dotenv'
import { con } from '../database/database.js'
dotenv.config()

const AddProduct = async ({
    name,
    type,
    amount,
    price
}) => {
    try {
        con.query(`INSERT INTO products(name,type,amount,price)
                    VALUES (?, ?, ?, ?)`,
            [name, type, amount,price],
            function (err, results) {
                if (err) {
                    console.log('Error not add products!!');
                }
                console.log('Insert Product Successfully!!!!');
                console.log(results);
            })
    } catch (err) {
        console.error('Error during insert:', err);
    }
}

export default {
    AddProduct,

}