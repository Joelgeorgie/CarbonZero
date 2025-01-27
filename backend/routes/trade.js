const express = require('express');

const tradeRouter = express.Router();

// Initial reserves (example values)
let totalSol = 10000;
let totalCZ = 1000;
const k = totalSol * totalCZ; // Constant product (AMM rule)

// Route to check if the trade router is working
tradeRouter.get('/', (req, res) => {
    res.send("Trade Router Working fine");
});

// Quote SOL for CZ
tradeRouter.get('/quote/buy/:val', (req, res) => {
    const solAmount = parseFloat(req.params.val); // Amount of SOL to quote
    if (solAmount <= 0) {
        return res.status(400).json({ error: "SOL amount must be greater than 0" });
    }

    // Calculate CZ amount based on constant product formula
    const newTotalSol = totalSol + solAmount;
    const czAmount = totalCZ - k / newTotalSol;

    if (czAmount <= 0) {
        return res.status(400).json({ error: "Quote results in insufficient CZ in the pool" });
    }

    res.json({
        message: "Quote successful",
        solAmount,
        czAmount: czAmount.toFixed(6),
        totalSol,
        totalCZ,
    });
});

// Quote CZ for SOL
tradeRouter.get('/quote/sell/:val', (req, res) => {
    const czAmount = parseFloat(req.params.val); // Amount of CZ to quote
    if (czAmount <= 0) {
        return res.status(400).json({ error: "CZ amount must be greater than 0" });
    }

    // Calculate SOL amount based on constant product formula
    const newTotalCZ = totalCZ + czAmount;
    const solAmount = totalSol - k / newTotalCZ;

    if (solAmount <= 0) {
        return res.status(400).json({ error: "Quote results in insufficient SOL in the pool" });
    }

    res.json({
        message: "Quote successful",
        czAmount,
        solAmount: solAmount.toFixed(6),
        totalSol,
        totalCZ,
    });
});

// Trade SOL for CZ
tradeRouter.post('/execute/buy/:val', (req, res) => {
    const solAmount = parseFloat(req.params.val); // Amount of SOL to trade
    if (solAmount <= 0) {
        return res.status(400).json({ error: "SOL amount must be greater than 0" });
    }

    // Calculate CZ amount to receive
    const newTotalSol = totalSol + solAmount;
    const czAmount = totalCZ - k / newTotalSol;

    if (czAmount <= 0) {
        return res.status(400).json({ error: "Trade results in insufficient CZ in the pool" });
    }

    // Update reserves
    totalSol = newTotalSol;
    totalCZ -= czAmount;

    res.json({
        message: "Trade successful",
        solTraded: solAmount,
        czReceived: czAmount.toFixed(6),
        totalSol,
        totalCZ,
    });
});

// Trade CZ for SOL
tradeRouter.post('/execute/sell/:val', (req, res) => {
    const czAmount = parseFloat(req.params.val); // Amount of CZ to trade
    if (czAmount <= 0) {
        return res.status(400).json({ error: "CZ amount must be greater than 0" });
    }

    // Calculate SOL amount to receive
    const newTotalCZ = totalCZ + czAmount;
    const solAmount = totalSol - k / newTotalCZ;

    if (solAmount <= 0) {
        return res.status(400).json({ error: "Trade results in insufficient SOL in the pool" });
    }

    // Update reserves
    totalCZ = newTotalCZ;
    totalSol -= solAmount;

    res.json({
        message: "Trade successful",
        czTraded: czAmount,
        solReceived: solAmount.toFixed(6),
        totalSol,
        totalCZ,
    });
});

module.exports = tradeRouter;
