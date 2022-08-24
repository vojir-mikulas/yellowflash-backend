
const decodeItems = (string) => {
    const items = [];
    const itemsInString = string.split(";")
    itemsInString.forEach((itemDataString)=>{
        const itemData =  itemDataString.split("%")
        const item = {
            id: itemData[0],
            quantity: itemData[1],
            size: itemData[2]
        }
        items.push(item)
    })
    return items
}

module.exports = {
    decodeItems: decodeItems,
}