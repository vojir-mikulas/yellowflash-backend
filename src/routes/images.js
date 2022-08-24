//DEPENDENCIES
const {deleteImageById,getAllImages} = require('../services/images')
const express = require('express')
const fs = require("fs");
//HELPERS
const {upload} = require("../helpers/storage")
const {ensureExistsAndDelete, deleteImage} = require("../helpers/filesystem")

const router = express.Router();

router.get('/', async(req,res)=>{
    res.json(await getAllImages())
})

router.post("/",upload.single('image'),(req,res)=>{
    res.status(200).send( `Image uploaded ${req.file.originalname}`);
})

router.delete("/:id",async(req,res)=>{
try {
    await deleteImage(parseInt(req.params.id))
    res.sendStatus(200);
}catch {
res.sendStatus(500);
}

})

module.exports = router;