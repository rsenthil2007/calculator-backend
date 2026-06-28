const express = require('express');
const cors = require('cors');
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) 
// This allows your separate HostingRaja domain to communicate securely with Render
app.use(cors()); 
app.use(express.json());

// Main Calculator Endpoint
app.post('/calculate', (req, res) => {
    const { expression } = req.body;
    
    // Strict input validation: Allow ONLY digits, spaces, and standard math symbols
    if (/^[0-9\+\-\*\/\.\s]+$/.test(expression)) {
        try {
            // Safely execute the validated mathematical expression
            const result = Function(`return ${expression}`)();
            
            // Check for division by zero or invalid calculations
            if (result === null || !isFinite(result)) {
                return res.status(400).json({ status: 'error', message: 'Math anomaly' });
            }
            
            res.json({ status: 'success', result: Number(result.toFixed(4)) });
        } catch (err) {
            res.status(400).json({ status: 'error', message: 'Syntax error' });
        }
    } else {
        res.status(400).json({ status: 'error', message: 'Forbidden characters' });
    }
});

// Root endpoint just to confirm the API is alive in your browser
app.get('/', (req, res) => {
    res.send('Calculator API is running smoothly.');
});

// Render dynamically provides a port via process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server executing successfully on port ${PORT}`));
