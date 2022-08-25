//DEPENDENCIES
require("dotenv").config()

const port = 3000;
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
const {syncFilesOnStartup} = require("./helpers/syncFilesOnStartup");
//MIDDLEWARES
app.use((req, res, next) => {

    if (req.originalUrl === '/stripe/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});
app.use("/public", express.static('public/img'));

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}))
/* app.use((req, res, next) => {
    const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL];
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin);
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,DELETE,POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});
*/

app.get("/", (req, res) => {
    res.send("JSEM ZAPLEJ!")
})
app.get("/mailtest", async (req, res) => {

    try {
        await mailer({
            id: "pi_3LagHeFLfwWiF0fG116PAOKu"
        })
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }

})



app.use('/item', itemRoute)
app.use('/order', orderRoute)
app.use('/discountCode', discountRoute)
app.use('/shipping', shippingMethodRoute)
app.use('/categories', categoryRoute)
app.use('/images', imageRoute)
app.use("/colors", colorRoute)
app.use("/sizes", sizeRoute)
app.use("/stripe", stripeRoute)
app.listen(process.env.PORT || port, () => {
    console.log("Server is running..")
    if(process.env.SYNC_FILES) syncFilesOnStartup()
})
