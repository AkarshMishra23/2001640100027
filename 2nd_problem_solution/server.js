require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();

app.get('/', (req, res) => {
    res.send('Server is working fine.');
});

app.get('/numbers', async (req, res) => {
    let urls = req.query?.url;
    if (!Array.isArray(urls)) urls = [urls];
    
    const result = await Promise.all(urls.map(async (url) => {
        try {
            const response = await axios.get(url);
            return response.data?.numbers || [];
        } catch (err) {
            console.error(`Error fetching from ${url}: ${err.message}`);
            return [];
        }
    }));
    
    const mergedNumbers = [].concat(...result);
    
    console.log(mergedNumbers);
    
    res.status(200).json({
        message: 'success',
        result: mergedNumbers,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});