const fs = require("fs");
const {deleteImageById} = require("../services/images");

const ensureExists = (path, mask, cb) =>{
    if (typeof mask == 'function') {
        cb = mask;
        mask = 0o744;
    }
    fs.mkdir(path, mask, (err) => {
        if (err) {
            if (err.code == 'EEXIST') return cb(null);
            else return  (err);
        }
        return null;
    });
}

const deleteImage = async (id)=>{
    const img = await deleteImageById(id);
    const splitPath = img.url.split("/");
    fs.rm(`public/img/${splitPath[1]}/${splitPath[2]}`, { recursive:true }, (err) => {
        if(err){
            console.error(err.message);
        }
    })
}
module.exports = {
    ensureExists: ensureExists,
    deleteImage:deleteImage
}