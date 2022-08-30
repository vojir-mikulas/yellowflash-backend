const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllItems(lowestPrice, highestPrice, categories, colors, sizes) {
    return await prisma.item.findMany({
        where: {
            price: {
                lte: highestPrice,
                gte: lowestPrice
            },

            ...(categories.length !== 0 ? {
                AND: categories.map((category) => ({
                    categories: {
                        some: {
                            categoryId: category
                        }
                    }
                }))
            } : undefined),
            ...(colors.length !== 0 ? {
                colors: {
                    some: {
                        OR: colors.map((color) => ({colorId: parseInt(color)}))
                    }
                }
            } : undefined),
            ...(sizes.length !== 0 ? {
                sizes: {
                    some: {
                        OR: sizes.map((size) => ({size: size}))
                    }
                }
            } : undefined)
        },
        select: {
            id: true,
            name: true,
            details: true,
            price: true,
            categories: {
                select: {
                    category: true
                }
            },
            sizes: {
                select: {
                    id: true,
                    size: true
                }
            },
            colors: {
                select: {
                    color: true
                }
            },
            images: {
                select: {
                    id: true,
                    url: true
                }
            },
        }
    });
}

async function deleteItemById(id) {
    await prisma.size.deleteMany({
        where: {
            itemId: id
        }
    })
    await prisma.item.update({
        where:{
            id:id
        },
        data:{
            categories:{
                deleteMany: {},
            },
            colors:{
                deleteMany: {},
            }
        }
    })

    await prisma.item.delete({
        where: {
            id: id,
        }
    })
}

async function createItem(id, name, details, price) {
    return await prisma.item.create({
        data: {
            id: id,
            name: name,
            details: details,
            price: price
        }
    })
}

async function updateItem(id, name, details, price, categories, colors, sizes) {
    await prisma.item.update({
        where:{
            id:id
        },
        data:{
            categories:{
                deleteMany: {},
            },
            colors:{
                deleteMany: {},
            }
        }
    })

    return await prisma.item.update({
        where: {
            id: id
        },
        data: {
            name: name,
            details: details,
            price: price,
            categories: {
                create: categories.map((category) => (
                    {
                        categoryId: category
                    }
                ))
            },
            colors:{
                create: colors.map((color) => (
                    {
                        colorId: parseInt(color)
                    }
                ))
            }

        }
    })

}

async function createSizeRelation(id, sizes) {

    await prisma.size.deleteMany({
        where: {
            itemId: id
        }
    })
    return await prisma.size.createMany({
        data: sizes.map((size) => {
            return (
                {
                    itemId: id,
                    size: size
                }
            )
        })
    })
}

async function getItemById(id) {
    return await prisma.item.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            details: true,
            price: true,
            categories: {
                select: {
                    category: true
                }
            },
            sizes: {
                select: {
                    id: true,
                    size: true
                }
            },
            colors: {
                select: {
                    color: true
                }
            },
            images: {
                select: {
                    id: true,
                    url: true
                }
            },
        }
    })
}

async function getItemNameById(id) {
    return await prisma.item.findUnique({
        where: {
            id: id,
        },

    })
}
async function getRecentItemsByCategory(category){
    return await prisma.item.findMany({
        take:-10,

        where:{
           categories: {
               some: {
                   categoryId: category
               }
           }
       },
        select: {
            id: true,
            name: true,
            details: true,
            price: true,
            categories: {
                select: {
                    category: true
                }
            },
            sizes: {
                select: {
                    id: true,
                    size: true
                }
            },
            colors: {
                select: {
                    color: true
                }
            },
            images: {
                select: {
                    id: true,
                    url: true
                }
            },
        }
    })
}
async function getMultipleItemsById(ids) {
    return await prisma.item.findMany({
        where: {
            OR: ids.map(id => ({id: id}))
        },
        select: {
            id: true,
            name: true,
            details: true,
            price: true,
            categories: {
                select: {
                    category: true
                }
            },
            colors: {
                select: {
                    color: true
                }
            },
            images: {
                select: {
                    id: true,
                    url: true
                }
            },
            sizes: {
                select: {
                    id: true,
                    size: true
                }
            },
        }
    })
}

module.exports = {
    getMultipleItemsById: getMultipleItemsById,
    getAllItems: getAllItems,
    getItemNameById: getItemNameById,
    createItem: createItem,
    getItemById: getItemById,
    deleteItemById: deleteItemById,
    updateItem, updateItem,
    createSizeRelation: createSizeRelation,
    getRecentItemsByCategory:getRecentItemsByCategory,
};