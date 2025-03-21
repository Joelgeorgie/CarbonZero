import express from 'express';
import zod from 'zod';
import jwt from 'jsonwebtoken';
import { Company } from '../db.js';
import { JWT_SECRET } from '../config.js';
import createTokenAccount from '../handlers/createTokenAccount.js';

const companyRouter = express.Router();

// Test route
companyRouter.get('/', (req, res) => {
    console.log("Company Router Working fine");
    res.end();
});


// Get all companies (excluding password)
companyRouter.get('/all', async (req, res) => {
    try {
        const companies = await Company.find({}, '-password'); // Exclude password
        res.status(200).json({ companies });
    } catch (error) {
        console.error("Error fetching all companies:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get companies with czTotal = 0 (excluding password)
companyRouter.get('/cztotal-zero', async (req, res) => {
    try {
        const companies = await Company.find({ czTotal: 0 }, '-password');
        res.status(200).json({ companies });
    } catch (error) {
        console.error("Error fetching companies with czTotal = 0:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get companies with czTotal != 0 (excluding password)
companyRouter.get('/cztotal-nonzero', async (req, res) => {
    try {
        const companies = await Company.find({ czTotal: { $ne: 0 } }, '-password');
        res.status(200).json({ companies });
    } catch (error) {
        console.error("Error fetching companies with czTotal != 0:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



// Signup route
companyRouter.post('/signup', async (req, res) => {
    // Zod schema for validating request body
    const companySchema = zod.object({
        name: zod.string().min(1, "Company name is required"),
        password: zod.string().min(6, "Password must be at least 6 characters"),
        publicKey: zod.string().min(1, "Public key is required"),
        czTotal: zod.number().nonnegative("czTotal must be a non-negative number"),
        czNeeded: zod.number().nonnegative("czNeeded must be a non-negative number"),
    });

    try {
        // Validate request body
        const { name, password, publicKey, czTotal, czNeeded } = companySchema.parse(req.body);

        // Check if company with the same public key already exists
        const existingCompany = await Company.findOne({ publicKey });
        if (existingCompany) {
            return res.status(400).json({ message: "Company with this public key already exists" });
        }

        // Create a new company document
        const newCompany = new Company({
            name,
            publicKey,
            password,
            czTotal,
            czNeeded,
        });

        // Save the company to the database
        await newCompany.save();

        // Generate JWT token
        const token = jwt.sign(
            { name, publicKey, czTotal },
            JWT_SECRET // Import secret from config
        );

        const resCreation = await createTokenAccount(publicKey);
        const address = resCreation.associatedToken.toBase58();
        res.status(201).json({ 
            message: "Company registered successfully",
            token,
            address
        });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(400).json({ message: "Validation failed", errors: error.errors });
        }
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login route
companyRouter.post('/login', async (req, res) => {
    // Zod schema for validating login request
    const loginSchema = zod.object({
        publicKey: zod.string().min(1, "Public key is required"),
        password: zod.string().min(6, "Password must be at least 6 characters"),
    });

    try {
        // Validate request body
        const { publicKey, password } = loginSchema.parse(req.body);

        // Find company by publicKey
        const company = await Company.findOne({ publicKey });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Check if password matches
        if (company.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { name: company.name, publicKey: company.publicKey, czTotal: company.czTotal },
            JWT_SECRET // Import secret from config
        );

        res.status(200).json({ 
            message: "Login successful",
            token
        });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(400).json({ message: "Validation failed", errors: error.errors });
        }
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default companyRouter;
