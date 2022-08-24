const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function createOrder(id, items, shippingMethod,amount, email, name, surname, company, address, city, zipcode, country, phone) {
    return await prisma.order.create({
        data: {
            id: id,
            items: items,
            amount: amount,
            shippingMethod: shippingMethod,
            email: email,
            name: name,
            surname: surname,
            company: company,
            address: address,
            city: city,
            zipcode: zipcode,
            country: country,
            phone: phone
        }
    })
}

async function getOrderById(id){
    return await prisma.order.findUnique({where:{
        id:id,
        }})
}

module.exports = {
    createOrder: createOrder,
    getOrderById:getOrderById

}