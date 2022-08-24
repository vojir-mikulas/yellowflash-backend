const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

//TODO try catch
async function createImage(itemId, pathString) {
    return await prisma.image.upsert({
        where: {
            url: pathString,
        },
        create: {
            itemId: itemId,
            url: pathString,
        },
        update: {}
    });
}

async function getAllImages() {
    return await prisma.image.findMany();
}

async function deleteImageById(id) {
    return await prisma.image.delete({
        where: {
            id: id,
        },
    })
}

module.exports = {
    createImage: createImage,
    deleteImageById: deleteImageById,
    getAllImages: getAllImages,
}