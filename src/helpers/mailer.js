const nodemailer = require('nodemailer');

const {getOrderById} = require("../services/orders");
const {decodeItems} = require("./decodeItems");
const handlebars = require('handlebars');
const fsp = require('fs/promises');
const fs = require('fs')
const {getMultipleItemsById} = require("../services/items");
const {getShippingPrice} = require("../services/shippingMethod");
const {getToday} = require("./getToday");
const pdf = require('html-pdf')
const AWS = require("aws-sdk")
const path = require("path");
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
})

const getFutureDate = () =>{
    let dt = new Date();
    dt.setDate(dt.getDate() + 3);
    const yyyy = dt.getFullYear();
    let mm = dt.getMonth() + 1;
    let dd = dt.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '/' + mm + '/' + yyyy;
}

const createTemplate = async (path, data) => {
    const html = await fsp.readFile(path, {encoding: 'utf8'});
    let template = handlebars.compile(html);
    return template(data);
}
let getTotalPrice = (items, itemData) => {
    let price = 0;
    items.forEach((item) => {
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

    const itemsForEmail = await Promise.all(
        items.map(async (item) => {
            const existingItem = itemData.find((data) => (data.id === item.id));
            console.log(existingItem)
            return await createTemplate('./src/htmlTemplates/emailItem.html', {
                itemImage: "https://yellowflash-backend.herokuapp.com/" + existingItem.images[0].url,
                itemName: existingItem.name,
                itemPrice:existingItem.price,
                itemSize:item.size
            })
        }));
    console.log(itemsForEmail)
    const itemsForPdf = await Promise.all(
        items.map(async (item) => {
            const existingItem = itemData.find((data) => (data.id === item.id));
            let vat = (15 / 100) * existingItem.price;
            return await createTemplate('./src/htmlTemplates/itemRowTemplate.html', {
                id: item.id,
                invoice: order.invoice,
                quantity: item.quantity,
                VAT: Math.round(vat),
                priceWithVAT: existingItem.price,
                priceNoVAT: existingItem.price - vat
            })
        }));
    let totalPrice = getTotalPrice(items, itemData)
    let totalVAT = Math.round((15 / 100) * totalPrice)
    let pdfToSend = await createTemplate('./src/htmlTemplates/pdftable.html', {
        fullName: `${order.name} ${order.surname}`,
        address: order.address,
        zipcode: order.zipcode,
        city: order.city,
        phone: order.phone,
        shippingMethod: shippingMethod.id,
        shipping: shippingMethod.price,
        items: itemsForPdf.join(" "),
        date: () => (getToday()),
        subtotal: totalPrice - totalVAT,
        totalVAT: totalVAT,
        totalWithVAT: totalPrice,
        invoice: order.invoice
    })

    const formattedToday = getFutureDate()
    let mailToSend = await createTemplate("./src/htmlTemplates/email.html", {
        order: order.id,
        deliveryDate: formattedToday,
        name: order.name,
        surname: order.surname,
        address: order.address,
        zipcode: order.zipcode,
        city: order.city,
        phone: order.phone,
        items: itemsForEmail.join(" ")
    })


    let options = {width: "853px", height: "1280px", childProcessOptions: {env: {OPENSSL_CONF: '/dev/null'}}};



     pdf.create(pdfToSend, options).toFile(`./public/invoices/${order.id}.pdf`, async function (err, res) {
        if (err) return console.log(err);
        console.log(res);

        const blob = await fs.readFileSync(`./public/invoices/${order.id}.pdf`)
        const uploadedImage = await s3.upload({
            Bucket: "yellowflashpublicbucket",
            Key: `invoices/${order.id}.pdf`,
            Body: blob,
        }).promise()

        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.MAIL_LOGIN, // generated ethereal user
                pass: process.env.MAIL_PASSWORD, // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: process.env.MAIL_LOGIN, // sender address
            to: order.email, // list of receivers
            subject: "Platba proběhla úspěšně ✔ - Yellowflash", // Subject line
            html: mailToSend, // html body
            attachments: [{
                filename: 'invoice.pdf',
                path: `./public/invoices/${order.id}.pdf`,
                contentType: 'application/pdf'
            }]
        });
    });


}

module.exports = {
    mailer: mailer,
}