import axios from 'axios'

async function fetchData() {
    try {
        const response = await axios.get('http://product:8082/api/v1/data');
        // Handle the API response data here
        console.log('API Response:', response.data);
    } catch (error) {
        // Handle errors here
        console.error('Error fetching data from the API:', error.message);
    }
}

// Call the fetchData function
export {
    fetchData
}