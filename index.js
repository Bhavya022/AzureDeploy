const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Handle data push requests
app.post('/dataPushFunction', async (req, res) => {
    const { dataPushUrl, requestBody } = req.body;

    try {
        console.log("Pushing data to", dataPushUrl);
        const response = await axios.post(dataPushUrl, requestBody, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
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
