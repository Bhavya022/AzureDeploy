const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
const https = require('https');
app.use(express.json());

// Create an HTTPS agent that bypasses the proxy
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,  // Only for self-signed certificates (optional)
});

// Handle data push requests
app.get('/', (req, res) => {
    res.send('Welcome!');
});

// Data push function
app.post('/dataPushFunction', async (req, res) => {
    const { dataPushUrl, requestBody } = req.body;

    try {
        // Log incoming request
        console.log("Received data push request:");
        console.log("dataPushUrl:", dataPushUrl);
        console.log("requestBody:", JSON.stringify(requestBody, null, 2)); // Pretty print the request body
        
        console.log("Pushing data to", dataPushUrl);

        // If necessary, stringify nested objects in the request body
        const response = await axios.post(dataPushUrl, JSON.stringify(requestBody), {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            httpsAgent,
        });

        // Log response data as an object with detailed output
        console.log("Data push response status:", response.status);
        console.log("Data push response headers:", JSON.stringify(response.headers, null, 2));
        console.log("Data push response data:", JSON.stringify(response.data, null, 2));

        res.status(200).json({ status: "success", data: response.data });
    } catch (error) {
        // Log error details
        console.log("Error pushing data:");
        console.log("Error message:", error.message);
        if (error.response) {
            console.log("Error response status:", error.response.status);
            console.log("Error response headers:", JSON.stringify(error.response.headers, null, 2));
            console.log("Error response data:", JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.log("No response received:", JSON.stringify(error.request, null, 2));
        }

        res.status(500).json({ status: "failure", error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
