const express = require('express')
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const endpointSecret = "whsec_1588f9891494bf964355bb997897a6fe65137588b077ec89d5f3612ff9c1cfed";
const {getItemById} = require("../services/items");
const {createOrder} = require("../services/orders");
const {getShippingPrice} = require("../services/shippingMethod");
const {verifyDiscountCode} = require("../services/discountCode");
const {mailer} = require("../helpers/mailer");

const router = express.Router();

router.post("/secret", async (req, res) => {
    if (req.body.billingInformation === undefined) res.status(204).send()


         let itemsString = req.body.items.map((item)=>{
         return `${item.id}%${item.quantity}%${item.size}`
         }).join(";")
         let itemPrice = await Promise.all(req.body.items.map(async (item) => {
             const cartItem = await getItemById(item.id)
             return (parseInt(cartItem.price) * item.quantity) * 100
         }))
         let shippingPrice = await getShippingPrice(req.body.shippingMethod)
         let price = itemPrice.reduce((a, b) => a + b, 0)
         if(req.body.discountCode !== null) {
             let discount = await verifyDiscountCode(req.body.discountCode)
             if(discount) price = Math.round(price * (1 - (discount.discountAmount / 100)))
         }
         price += (shippingPrice.price * 100) ;
         const params = {
             payment_method_types: ["card"],
             amount: price,
             currency: 'czk',
         }
         const paymentIntent = await stripe.paymentIntents.create(params);
         await createOrder(paymentIntent.id,itemsString, req.body.shippingMethod, paymentIntent.amount, req.body.billingInformation.email, req.body.billingInformation.name, req.body.billingInformation.surname, req.body.billingInformation.company, req.body.billingInformation.address, req.body.billingInformation.city, "19100", req.body.billingInformation.country, req.body.billingInformation.phone)

         res.json({clientSecret: paymentIntent.client_secret});

})

router.post('/webhook', express.raw({type: 'application/json'}),async (request, response) => {
    let event = request.body;

    if (endpointSecret) {
        const signature = request.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            await mailer(paymentIntent)
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});


module.exports = router;