
const axios = require('axios');

module.exports = axios.create({
    baseURL: (process.env.NODE_ENV === 'test') ? 'http://localhost:8090' : 'https://mrspreader.com/api',
    headers: {
        'Content-type': 'application/json'
    }
})
