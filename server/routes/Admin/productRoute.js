require('dotenv').config();
const express = require('express');
const router = express.Router()
const shortid = require('shortid');
const multer = require('multer');
const path = require('path');
const Admin = require('../../models/adminModel')
const AdminToken = require('../../models/adminTokenmodel')
const Category = require('../../models/Category')
const Product = require('../../models/Product')
const fs = require('fs');

const proDir = path.join(path.resolve(__dirname, '../../'), 'products')

// storage setup
const proStore = multer.diskStorage({
    destination: './products/',
    filename: function (req, file, cb) {
        const iname = shortid.generate()
        cb(null, iname + path.extname(file.originalname))
    }
})

// initialize multer 
const uploadpro = multer({
    storage: proStore,
    limits: { fileSize: 1024000 }
})


router.post('/addproduct', uploadpro.single('product_thumb'), async (req, res) => {


    const pro_cat = req.body.pro_cat
    const product_name = req.body.product_name
    const product_thumb = req.file.filename
    const product_short_desc = req.body.product_short_desc
    const product_long_desc = req.body.product_long_desc
    const product_org_price = req.body.product_org_price
    const product_sale_price = req.body.product_sale_price
    const product_sale_start_date = req.body.product_sale_start_date
    const product_sale_end_date = req.body.product_sale_end_date

    const newPro = new Product({
        pro_cat,
        product_name,
        product_thumb,
        product_short_desc,
        product_long_desc,
        product_org_price,
        product_sale_price,
        product_sale_start_date,
        product_sale_end_date
    })


    await newPro.save();
    res.json({ "sts": 0, "msg": "Product Uploaded Successfully" })



})



router.get('/viewproduct', async (req, res) => {
    try {
        const products = await Product.find().populate('pro_cat')
        if (!products) {
            return res.json({ "viewprosts": 1, "msg": "Data not found" })
        } else {
            const formatedProducts = products.map(product => {
                return {
                    _id: product._id,
                    product_name: product.product_name,
                    product_short_desc: product.product_short_desc,
                    product_long_desc: product.product_long_desc,
                    product_thumb: product.product_thumb,
                    product_org_price: product.product_org_price,
                    product_sale_price: product.product_sale_price,
                    product_sale_start_date: product.product_sale_start_date,
                    product_sale_end_date: product.product_sale_end_date,
                    product_status: product.product_status,
                    Category: product.pro_cat.cat_name



                }
            })
            return res.json({ "viewprosts": 0, product: formatedProducts })
        }
    } catch (error) {
        console.error(error);
    }
})


router.post('/changestatus', async (req, res) => {
    const { productIds, newStatus } = req.body;

    try {
        await Product.updateMany(
            { _id: { $in: productIds } },
            { $set: { product_status: newStatus } }

        )
        res.json({ "msg": "Product Status updated successfully" })
    } catch (error) {
        console.error(error);
    }
})


router.post('/deleteproduct', async (req, res) => {
    const { productIds } = req.body;

    try {
        const result = await Product.deleteMany({ _id: { $in: productIds } })
        res.json({ "msg": `Total ${result.deletedCount} Product Deleted` })
    } catch (error) {
        console.error(error);
    }
})


module.exports = router



