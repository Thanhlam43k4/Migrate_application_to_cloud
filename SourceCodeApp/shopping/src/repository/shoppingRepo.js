import * as dotenv from 'dotenv'
import { con } from '../database/database.js'
dotenv.config()
import axios from 'axios'
async function getProduct(productId){
    const productAPIUrl = `http://product:8001/${productId}`;
    // console.log(productId);
    try{
        const response = await axios.get(productAPIUrl);
        console.log(response.data);
        return response.data;   
    }catch(err){
        console.log('Error fetching product datas:',err.message);
    }
}
async function fetchProductDetails(productId) {
    const productAPIUrl = `http://product:8001/${productId}`;
    try {
        const response = await axios.get(productAPIUrl);
        const productDetails = response.data.results; // Access the 'results' property
        console.log(productDetails);
        return productDetails;   
    } catch (err) {
        console.log('Error fetching product data:', err.message);
        throw err; // Propagate the error
    }
}
export default {
   getProduct,
   fetchProductDetails
}