const express = require('express')
const {getAllSizes} = require("../services/sizes");

const router = express.Router();

//get all
router.get('/', async (req, res) => {
    let category = req.query.category
    res.json(await getAllSizes(category));
})


module.exports = router;