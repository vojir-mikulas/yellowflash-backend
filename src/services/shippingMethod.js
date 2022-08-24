const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function getShippingPrice(id) {
    return await prisma.shippingMethod.findUnique({
        where: {id: id}
    })
}


module.exports = {
    getShippingPrice: getShippingPrice
}