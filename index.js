const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3005;

app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Infobip API details from environment variables
const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY;
const INFOBIP_BASE_URL = process.env.INFOBIP_BASE_URL;

// Route to send SMS
app.post('/send-message', async (req, res) => {
    // Extract phone number and message from request body
    const { phone, message } = req.body;

    // fon validation
    if (!phone || !message) {
        return res.status(400).json({ error: 'Phone and message are required' });
    }

    // POST request
    const requestData = {
        messages: [
            {
                from: "447491163443",  // sender 
                destinations: [
                    {
                        to: phone,  // Recipient
                    },
                ],
                text: message,  
            },
        ],
    };

    // Try to send the SMS using Axios
    try {
        const response = await axios.post(
            INFOBIP_BASE_URL,
            requestData,
            {
                headers: {
                    Authorization: `App ${INFOBIP_API_KEY}`,  // Authorization header with API key
                    'Content-Type': 'application/json',
                },
            }
        );

        // If successful, send a response back with a success message
        res.status(200).json({ message: 'SMS sent successfully', data: response.data });
    } catch (error) {
        // Catch errors and log them, then send a failure response
        console.error('Error sending SMS:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to send SMS', details: error.response?.data || error.message });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
