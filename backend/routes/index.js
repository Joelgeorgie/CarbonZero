const express = require('express');
const router = express.Router();
const companyRouter = require("./company");
const tradeRouter = require("./trade");
// const accountRouter = require("./account");
 
router.get('/', function (req, res, next) {
    console.log("Router Working");
    res.end();
})
 
router.use("/companies",companyRouter);
router.use("/trade", tradeRouter);
// router.use("/account", accountRouter);

 
module.exports=router;