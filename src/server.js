//DEPENDENCIES
require("dotenv").config()

const express = require('express');
const app = express();
const cors = require("cors")
//ROUTES
const itemRoute = require("./routes/items")
const imageRoute = require("./routes/images")
const colorRoute = require("./routes/colors")
const sizeRoute = require("./routes/sizes")
const categoryRoute = require("./routes/categories")
const stripeRoute = require("./routes/stripe")
const shippingMethodRoute = require("./routes/shippingMethod")
const orderRoute = require("./routes/order")
const discountRoute = require("./routes/discountCode")
const {mailer} = require("./helpers/mailer");
//MIDDLEWARES
app.use((req, res, next) => {
    if (req.originalUrl === '/stripe/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});
app.use("/public", express.static('public/img'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get("/mail",(req,res) =>{
try{
    mailer()
    res.status(200).send()
}catch(e){
    console.log(e)
    res.status(500).send()
}
})

app.use('/item', itemRoute)
app.use('/order',orderRoute)
app.use('/discountCode',discountRoute)
app.use('/shipping',shippingMethodRoute)
app.use('/categories', categoryRoute)
app.use('/images', imageRoute)
app.use("/colors", colorRoute)
app.use("/sizes", sizeRoute)
app.use("/stripe",stripeRoute)
app.listen(3000)
