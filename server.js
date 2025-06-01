const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Route to proxy requests to Flask backend
app.get('/api/flask-data', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/data');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching from Flask:', error);
        res.status(500).json({ error: 'Failed to fetch from Flask backend' });
    }
});

// Additional Node.js specific endpoint
app.get('/api/node-status', (req, res) => {
    res.json({
        status: 'active',
        service: 'Node.js Server',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Node.js server running on http://localhost:${PORT}`);
});
