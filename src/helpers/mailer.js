const nodemailer = require('nodemailer');
const html_to_pdf = require('html-pdf-node');
const {getOrderById} = require("../services/orders");
const {decodeItems} = require("./decodeItems");
const handlebars = require('handlebars');
const {promisify} = require('util');
const fs = require('fs/promises');
const {getMultipleItemsById} = require("../services/items");
const {getShippingPrice} = require("../services/shippingMethod");
const {getToday} = require("./getToday");

const createTemplate = async (path, data) => {
    const html = await fs.readFile(path, {encoding: 'utf8'});
    let template = handlebars.compile(html);
    return template(data);
}
let getTotalPrice = (items,itemData)=>{
    let price = 0;
    items.forEach((item)=>{
        const existingItem = itemData.find((data) => (data.id === item.id));

        price += item.quantity * existingItem.price
    })
    return price
}
const mailer = async (paymentIntent) => {
    const order = await getOrderById(paymentIntent.id)
    const items = decodeItems(order.items)
    const itemData = await getMultipleItemsById(items.map((item) => (item.id)))
    const shippingMethod = await getShippingPrice(order.shippingMethod)

    const itemsForPdf = await Promise.all(
        items.map(async (item) => {
            const existingItem = itemData.find((data) => (data.id === item.id));
            let vat = (15 / 100) * existingItem.price;
            return await createTemplate('./src/htmlTemplates/itemRowTemplate.html', {
                id:item.id,
                quantity:item.quantity,
                VAT:Math.round(vat),
                priceWithVAT: existingItem.price,
                priceNoVAT: existingItem.price - vat
            })
        }));
    let totalPrice = getTotalPrice(items,itemData)
    let totalVAT = Math.round((15 / 100) * totalPrice)
    let pdfToSend = await createTemplate('./src/htmlTemplates/pdf.html', {
        fullName: `${order.name} ${order.surname}`,
        address: order.address,
        zipcode: order.zipcode,
        city: order.city,
        phone: order.phone,
        shippingMethod: shippingMethod.id,
        shipping: shippingMethod.price,
        items:itemsForPdf.join(" "),
        date: () =>(getToday()),
        subtotal: totalPrice - totalVAT,
        totalVAT: totalVAT,
        totalWithVAT: totalPrice
    })

    let mailToSend = await createTemplate("./src/htmlTemplates/email.html", {
        name: order.name,
        surname: order.surname,
        address: order.address,
        zipcode: order.zipcode,
        city: order.city,
        phone: order.phone,
    })

    let options = {format: 'A4', path: `./invoices/xd.pdf`};
    let file = {content: pdfToSend};
    html_to_pdf.generatePdf(file, options).then(async (pdfBuffer) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.MAIL_LOGIN , // generated ethereal user
                pass: process.env.MAIL_PASSWORD, // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
              let info = await transporter.sendMail({
                   from: 'noreply.yellowflash@gmail.com ', // sender address
                   to: order.email, // list of receivers
                   subject: "Platba proběhla úspěšně ✔ - Yellowflash", // Subject line
                   html: mailToSend, // html body
                   attachments: [{
                   filename: 'invoice.pdf',
                   path: './invoices/xd.pdf',
                   contentType: 'application/pdf'
               }]
               });
    });


}

module.exports = {
    mailer: mailer,
}