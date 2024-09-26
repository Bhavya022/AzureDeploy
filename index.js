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
  
// app.post('/dataPushFunction', async (req, res) => {
//     const { dataPushUrl, requestBody } = req.body;

//     try {
//         console.log("Pushing data to", dataPushUrl);
//         const response = await axios.post(dataPushUrl, requestBody, {
//             headers: {
//                 accept: 'application/json',
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log("Data push response:", response.data);
//         res.status(200).json({ status: "success", data: response.data });
//     } catch (error) {
//         console.log("Error pushing data:", error);
//         res.status(500).json({ status: "failure", error: error.message });
//     }
// });

app.post('/dataPushFunction', async (req, res) => {
    const { dataPushUrl, requestBody } = req.body;

    try {
        console.log("Pushing data to", dataPushUrl);

        // If necessary, stringify nested objects in the request body
        const response = await axios.post(dataPushUrl, JSON.stringify(requestBody), {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            httpsAgent,  
        });
        
        console.log("Data push response:", response.data);
        res.status(200).json({ status: "success", data: response.data });
    } catch (error) {
        console.log("Error pushing data:", error);
        res.status(500).json({ status: "failure", error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
