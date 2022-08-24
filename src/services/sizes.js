const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


async function getAllSizes(category) {
    return await prisma.size.findMany({
        distinct: ['size'],
        orderBy:{
          size: "asc"
        },
        select: {
            id:true,
            size:true,
            item: {
                select: {
                    categories: {
                        where: {
                            categoryId: category
                        }

                    }
                }
            }
        }
    });
}


module.exports = {
    getAllSizes: getAllSizes
}