const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyDiscountCode(id) {
    return await prisma.discountCode.findUnique({
        where: {id: id}
    })
}


module.exports = {
    verifyDiscountCode: verifyDiscountCode
}