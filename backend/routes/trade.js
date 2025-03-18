import express from 'express';
import { authMiddleware } from '../middleware.js';
import transferTokens from '../handlers/transferTokens.js';
import transferSol from '../handlers/transferSol.js';
const tradeRouter = express.Router();

// Initial reserves (example values)
let totalSol = 10000;
let totalCZ = 1000;
const k = totalSol * totalCZ; // Constant product (AMM rule)

// Route to check if the trade router is working
tradeRouter.get('/',authMiddleware, (req, res) => {
    console.log(req.name);
    res.send("Trade Router Working fine");
});


// Get current reserves
tradeRouter.get('/reserves', (req, res) => {
    res.json({
        totalSol,
        totalCZ
    });
});


// Quote buy  CZ for SOL
tradeRouter.get('/quote/buy/:val', (req, res) => {
    const czAmount = parseFloat(req.params.val); // Amount of SOL to quote
    if (czAmount <= 0) {
        return res.status(400).json({ error: "SOL amount must be greater than 0" });
    }

    // Calculate CZ amount based on constant product formula
    const newTotalCZ = totalCZ - czAmount;
    let solAmount = (k / newTotalCZ)-totalSol;

    if (newTotalCZ <= 0) {
        return res.status(400).json({ error: "Quote results in insufficient CZ in the pool" });
    }
    solAmount=solAmount.toFixed(9)
    res.json({
        message: "Quote successful",
        solAmount: solAmount,
        czAmount,
        totalSol,
        totalCZ,
    });
});

// Quote for sell CZ for SOL
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

// Buy CZ for Sol
tradeRouter.post('/execute/buy/:val',authMiddleware,async (req, res) => {
    const czAmount = parseFloat(req.params.val); // Amount of SOL to trade

    if (czAmount <= 0 ) {
        return res.status(400).json({ error: "CZ amount must be greater than 0" });
    }
    
    // Calculate CZ amount to receive
    const newTotalCZ = totalCZ - czAmount;
    const solAmount = (k / newTotalCZ)-totalSol;

    if (czAmount <= 0) {
        return res.status(400).json({ error: "Trade results in insufficient CZ in the pool" });
    }

    // Update reserves
    totalSol = (k / newTotalCZ);
    totalCZ = newTotalCZ;
    
    const truncatedCzAmount = Math.floor(czAmount);
    const signature = await transferTokens(req.publicKey,truncatedCzAmount);

    res.json({
        message: "Trade successful",
        solTraded: solAmount,
        czReceived: czAmount,
        totalSol,
        totalCZ,
        signature
    });
});

// Sell CZ for SOL
tradeRouter.post('/execute/sell/:val',authMiddleware, async (req, res) => {
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
    
    const truncatedSolAmount = Math.floor(solAmount * 1e9) / 1e9;
    const signature = await transferSol(req.publicKey,truncatedSolAmount);
    console.log(signature);

    res.json({
        message: "Trade successful",
        czTraded: czAmount,
        solReceived: solAmount.toFixed(6),
        totalSol,
        totalCZ,
        signature
    });
});

export default tradeRouter;
