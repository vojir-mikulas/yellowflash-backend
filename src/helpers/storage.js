//DEPENDENCIES
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const {getItemNameById} = require("../services/items");
const {convertToSlug} = require("../helpers/convertor");
const {ensureExists} = require("../helpers/filesystem");
const {createImage} = require("../services/images")

//HELPERS
const storage = multer.diskStorage(({
    destination: async (req, file, cb) => {

            const item = await getItemNameById(req.body.itemId);
            console.log(item)
            ensureExists(`public/img/${item.id}`, 0o744, (err) => {
                if (err) console.error(`Složka v public/img/${item.id} již existuje`);
            })

            await createImage(item.id, `public/${item.id}/${req.body.imgName}${path.extname(file.originalname)}`);

            cb(null, `public/img/${item.id}`)

    },
    filename: (req, file, cb) => {

        cb(null, `${req.body.imgName}${path.extname(file.originalname)}`);
    }
}))
const upload = multer({storage: storage})

module.exports = {upload: upload}