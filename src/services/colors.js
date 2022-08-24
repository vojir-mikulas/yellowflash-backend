const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


async function getAllColors() {
    return await prisma.color.findMany();
}


module.exports = {
    getAllColors:getAllColors
}