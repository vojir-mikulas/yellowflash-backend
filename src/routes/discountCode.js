const express = require('express')
const {verifyDiscountCode} = require("../services/discountCode");


const router = express.Router();

//get all
router.get('/', async (req, res) => {
    try{
        const code= await verifyDiscountCode(req.query.id)
        res.json(code);
    }catch{
        res.status(500).send()
    }
})


module.exports = router;