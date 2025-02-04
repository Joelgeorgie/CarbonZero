import express from 'express';
import companyRouter from './company.js';
import tradeRouter from './trade.js';
import depositRouter from './deposit.js';

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log("Router Working");
    res.end();
});

router.use('/companies', companyRouter);
router.use('/trade', tradeRouter);
router.use('/deposit', depositRouter);

export default router;
