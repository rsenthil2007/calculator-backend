const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Calculator API is running."
    });
});

app.post("/", (req, res) => {

    const expression = req.body.expression;

    if (typeof expression !== "string") {
        return res.status(400).json({
            status: "error",
            message: "Expression is required."
        });
    }

    const expr = expression.trim();

    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid expression."
        });
    }

    try {

        const result = eval(expr);

        if (!Number.isFinite(result)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid result."
            });
        }

        res.json({
            status: "success",
            result: Number(result.toFixed(4))
        });

    } catch (err) {

        res.status(400).json({
            status: "error",
            message: "Syntax error."
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
