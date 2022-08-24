const { v4: uuidv4 } = require('uuid');

const convertToSlug = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').toLowerCase();

const createItemID = (name) =>{
    return convertToSlug(name) +"-"+ uuidv4()
}

module.exports = {
    convertToSlug:convertToSlug,
    createItemID:createItemID
}