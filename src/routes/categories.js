const express = require('express')
const {getAllCategories, getCategoryById} = require("../services/categories");


const router = express.Router();

//get all
router.get('/', async (req, res) => {
    res.json(await getAllCategories());
})

router.get('/:id', async (req, res) => {
   try{
       res.json(await getCategoryById(req.params.id));
   }catch{
       res.status(500).send()
   }
})
module.exports = router;