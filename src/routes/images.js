//DEPENDENCIES
const {deleteImageById,getAllImages} = require('../services/images')
const express = require('express')
const fs = require("fs");
//HELPERS
const {upload} = require("../helpers/storage")
const {ensureExistsAndDelete, deleteImage} = require("../helpers/filesystem")
const path = require("path");
const AWS = require("aws-sdk")
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
})



const router = express.Router();

router.get('/', async(req,res)=>{
    res.json(await getAllImages())
})

router.post("/",upload.single('image'), async (req,res)=>{
    const blob = await fs.readFileSync(req.file.path)
    const uploadedImage = await s3.upload({
        Bucket: "yellowflashpublicbucket",
        Key: `images/${req.itemId}/${req.body.imgName}${path.extname(req.file.originalname)}`,
        Body: blob,
    }).promise()
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