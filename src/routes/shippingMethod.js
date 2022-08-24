const express = require('express')
const {getAllSizes} = require("../services/sizes");
const {getShippingPrice} = require("../services/shippingMethod");

const router = express.Router();

//get all
router.get('/:id', async (req, res) => {
    try{
        res.json(await getShippingPrice(req.params.id));
    }catch{
        res.status(500).send()
    }
})


module.exports = router;