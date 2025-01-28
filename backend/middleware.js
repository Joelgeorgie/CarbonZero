import { JWT_SECRET } from './config.js';
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.name = decoded.name;
        req.publicKey = decoded.publicKey;
        req.czTotal = decoded.czTotal;

        next();
    } catch (err) {
        return res.status(403).json({});
    }
};

export { authMiddleware };
