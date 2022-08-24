const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


async function getAllCategories() {
    return await prisma.category.findMany({
        where: {
            NOT:{
               OR:[
                   {id: 'men'},
                   {id: 'women'},
               ]
            }
        }
    });
}
async function getCategoryById (id){
    return await prisma.category.findUnique({where:{
        id:id
        }})
}

module.exports = {
    getAllCategories: getAllCategories,
    getCategoryById:getCategoryById
}