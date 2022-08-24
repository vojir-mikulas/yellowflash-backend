const express = require('express')
const {getOrderById} = require("../services/orders");

const router = express.Router();

//get all
router.get('/:id', async (req, res) => {
    try{
        res.json(await getOrderById(req.params.id));
    }catch{
        res.status(500).send()
    }
})


module.exports = router;