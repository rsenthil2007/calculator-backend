```javascript
const express = require('express');
const cors = require('cors');

const app = express();

/* ---------------------------------------
   Middleware
---------------------------------------- */

// Allow requests from your frontend.
// During development, allow all origins.
// Later, replace "*" with your website domain.
app.use(cors());

app.use(express.json());

// Optional: Simple security headers
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
});

/* ---------------------------------------
   Health Check
---------------------------------------- */

app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "Calculator API is running."
    });
});

/* ---------------------------------------
   Calculator Endpoint
---------------------------------------- */

app.post('/', (req, res) => {

    const { expression } = req.body;

    // Validate request body
    if (typeof expression !== "string") {
        return res.status(400).json({
            status: "error",
            message: "Expression is required."
        });
    }

    const expr = expression.trim();

    if (expr.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "Expression cannot be empty."
        });
    }

    // Allow:
    // Digits
    // + - * /
    // Decimal point
    // Parentheses
    // Spaces
    const allowedPattern = /^[0-9+\-*/().\s]+$/;

    if (!allowedPattern.test(expr)) {
        return res.status(400).json({
            status: "error",
            message: "Forbidden characters detected."
        });
    }

    try {

        // Evaluate expression
        const result = Function("return (" + expr + ")")();

        if (
            typeof result !== "number" ||
            Number.isNaN(result) ||
            !Number.isFinite(result)
        ) {
            return res.status(400).json({
                status: "error",
                message: "Invalid mathematical result."
            });
        }

        return res.json({
            status: "success",
            expression: expr,
            result: Number(result.toFixed(4))
        });

    } catch (error) {

        return res.status(400).json({
            status: "error",
            message: "Invalid mathematical expression."
        });

    }

});

/* ---------------------------------------
   404 Handler
---------------------------------------- */

app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Endpoint not found."
    });
});

/* ---------------------------------------
   Start Server
---------------------------------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Calculator API is running on port ${PORT}`);
});
```
