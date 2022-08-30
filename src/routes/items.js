const express = require('express')
const {getAllItems, getItemById, deleteItemById,getMultipleItemsById, updateItem, createSizeRelation, createItem,
    getRecentItemsByCategory
} = require("../services/items");
const {createItemID} = require("../helpers/convertor");

const router = express.Router();

//get all
router.get('/', async (req, res) => {
    //TODO nějakej ten dotaz do DB na nejvyšší cenu něčeho idk

    let lowestPrice = req.query.lowestPrice ? parseInt(req.query.lowestPrice) : undefined
    let highestPrice = req.query.highestPrice ? parseInt(req.query.highestPrice) : undefined
    let categories = req.query.categories ? req.query.categories.split(";") : []
    let colors = req.query.colors ? req.query.colors.split(";") : []
    let sizes = req.query.sizes ? req.query.sizes.split(";") : []
    res.json(await getAllItems(lowestPrice, highestPrice, categories, colors, sizes));
})
router.get('/single/:id', async (req, res) => {
        res.json(await getItemById(req.params.id));
})
router.delete('/single/:id', async (req, res) => {
    try {
        await deleteItemById(req.params.id)
        res.sendStatus(200);
    } catch {
        res.sendStatus(500)
    }
})

router.get("/multipleByCategory/:id",async (req,res)=>{

    try {
        res.json(await getRecentItemsByCategory(req.params.id))

    } catch {
        res.sendStatus(500)
    }
})
router.get("/multipleById",async (req,res)=>{
    let ids = req.query.ids ? req.query.ids.split(";") : []
    res.json(await getMultipleItemsById(ids))
})
router.post("/create", async (req, res) => {
    const item = req.body
    if (!item.name || !item.details || !item.price) return res.status(204).send()
    let id = createItemID(item.name)
    try {
        await createItem(id, item.name, item.details, parseInt(item.price))
        res.json({id: id})
    } catch {
        res.sendStatus(500)
    }
})
router.post("/update",async (req,res)=>{
    const item = req.body
    if (!item.name || !item.details || !item.price) return res.status(204).send()

    try{
        console.log(item.categories)
        await updateItem(item.id, item.name, item.details, parseInt(item.price),item.categories,item.colors).then(
            async ()=>{
                await createSizeRelation(item.id,item.sizes)
            }
        )
    }catch{
        res.status(500).send()
    }
})
module.exports = router;