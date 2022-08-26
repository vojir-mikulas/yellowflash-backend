const AWS = require("aws-sdk")
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
})
const path = require("path");
const fs = require("fs");
const {ensureExists} = require("./filesystem");

const syncInvoicesOnStartup = ()=>{
    let keys = [];
    let invoices = []
    s3.listObjects({Bucket: "yellowflashpublicbucket", Prefix: 'invoices/'}, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            keys = data.Contents.map((content) => (content.Key))
            console.log(keys)
            invoices = keys.map((key)=>{
                let arr = key.split("/")
                return arr[1]
            })

            invoices.forEach((invoice)=>{
                let params = {
                    Bucket: "yellowflashpublicbucket",
                    Key: `invoices/${invoice}`,
                }

                s3.getObject(params, (err, data) => {
                    if (err) console.error(err);

                    // fs.writeFileSync("./image.jpg", data.Body.toString());
                    fs.writeFile(`./public/invoices/${invoice}`, data.Body,(err) =>{
                        if (err) throw err;
                        console.log('Pdf saved!');
                    })

                });
            })
        }
    });

}
const syncFilesOnStartup = () => {
    let keys = [];
    let folders = []
    let foldersWithItems = []
    s3.listObjects({Bucket: "yellowflashpublicbucket", Prefix: 'images/'}, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            keys = data.Contents.map((content) => (content.Key))
            folders = [...new Set(keys.map((key) => {
                let arr = key.split("/")
                return arr[1]
            }))]

            foldersWithItems = folders.map((folder) => {
                let images = []
                keys.forEach((key) => {
                    let arr = key.split("/")

                    if (folder === arr[1]) {
                        images.push(arr[2])
                    }
                })
                return {name: folder, images: images}
            })
            foldersWithItems.forEach((folder)=>{
                ensureExists(`public/img/${folder.name}`, 0o744, (err) => {
                    if (err) console.error(`Složka v public/img/${folder.name} již existuje`);
                })
                folder.images.forEach((image)=>{

                    let params = {
                        Bucket: "yellowflashpublicbucket",
                        Key: `images/${folder.name}/${image}`,
                    }

                    s3.getObject(params, (err, data) => {
                        if (err) console.error(err);

                        // fs.writeFileSync("./image.jpg", data.Body.toString());
                        fs.writeFile(`./public/img/${folder.name}/${image}`, data.Body,(err) =>{
                            if (err) throw err;
                            console.log('Image saved!');
                        })

                    });
                })
            })
        }
    });



}

module.exports = {
    syncFilesOnStartup:syncFilesOnStartup,
    syncInvoicesOnStartup:syncInvoicesOnStartup
}