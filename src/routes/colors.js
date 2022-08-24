const express = require('express')
const {getAllColors} = require("../services/colors");

const router = express.Router();

//get all
router.get('/', async (req, res) => {
    res.json(await getAllColors());
})


module.exports = router;