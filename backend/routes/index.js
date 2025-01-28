import express from 'express';
import companyRouter from './company.js';
import tradeRouter from './trade.js';
// import accountRouter from './account.js';

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log("Router Working");
    res.end();
});

router.use('/companies', companyRouter);
router.use('/trade', tradeRouter);
// router.use('/account', accountRouter);

export default router;
