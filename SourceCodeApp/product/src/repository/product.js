
import * as dotenv from 'dotenv'
import { con } from '../database/database.js'
dotenv.config()

const AddProduct = async ({
    name,
    type,
    amount
}) => {
    try {
        con.query(`INSERT INTO products(name,type,amount)
                    VALUES (?, ?, ?)`,
            [name, type, amount],
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