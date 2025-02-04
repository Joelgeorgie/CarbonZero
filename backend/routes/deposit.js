import express from 'express';
import { authMiddleware } from '../middleware.js';
import { Company } from '../db.js';

const depositRouter = express.Router();

// Test route
depositRouter.get('/balance', authMiddleware,async (req, res) => {
    const  publicKey  = req.publicKey;
    try {
        // Find the company by publicKey
        const company = await Company.findOne({ publicKey });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.status(200).json({ 
            message: "Company balance",
            company: {
                name: company.name,
                publicKey: company.publicKey,
                czTotal: company.czTotal,
                czNeeded: company.czNeeded,
            }
        });
    } catch (error) {
        console.error("Error during deposit:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Deposit credits route
depositRouter.post('/credits/:amount', authMiddleware, async (req, res) => {
    const { amount } = req.params; // Get the amount from the URL parameter
    const  publicKey  = req.publicKey; // Extract publicKey from the authenticated company

    try {
        // Validate the amount
        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number" });
        }

        // Find the company by publicKey
        const company = await Company.findOne({ publicKey });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Check if the amount is greater than czNeeded
        if (amountNumber > company.czNeeded) {
            return res.status(400).json({ message: "Amount cannot be greater than czNeeded" });
        }

        // Reduce the czNeeded by the amount
        company.czNeeded -= amountNumber;

        // Save the updated company to the database
        await company.save();

        res.status(200).json({ 
            message: "Credits deposited successfully",
            updatedCompany: {
                name: company.name,
                publicKey: company.publicKey,
                czTotal: company.czTotal,
                czNeeded: company.czNeeded,
            }
        });
    } catch (error) {
        console.error("Error during deposit:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



export default depositRouter;