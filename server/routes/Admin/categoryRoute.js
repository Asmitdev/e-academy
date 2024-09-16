require('dotenv').config();
const express = require('express');
const router = express.Router()
const shortid = require('shortid');
const multer = require('multer');
const path = require('path');
const Admin = require('../../models/adminModel')
const AdminToken = require('../../models/adminTokenmodel')
const Category = require('../../models/Category')
const fs = require('fs');

const catDir = path.join(path.resolve(__dirname, '../../'), 'products')

// storage setup
const catStore = multer.diskStorage({
    destination: './categories/',
    filename: function (req, file, cb) {
        const iname = shortid.generate()
        cb(null, iname + path.extname(file.originalname))
    }
})

// initialize multer 
const uploadCat = multer({
    storage: catStore,
    limits: { fileSize: 1024000 }
})

router.post('/addcategory', uploadCat.single('cat_img'), async (req, res) => {
    const { cat_name } = req.body;
    // Check if req.file is defined before accessing its properties
    if (!req.file) {
        return res.status(400).json({ 'sts': 1, 'msg': 'No image uploaded' });
    }
    const { filename: cat_img } = req.file; // Access filename property of req.file
    const newCat = new Category({
        cat_name,
        cat_img
    });
    try {
        await newCat.save();
        res.json({ 'sts': 0, "msg": "Category Uploaded" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'sts': 1, 'msg': 'Internal Server Error' });
    }
});


router.get('/getcat', async (req, res) => {
    try {
        const cat = await Category.find()
        if (!cat) {
            return res.json({ "viewcatsts": 1, "msg": "Data not found" })
        } else {
            return res.json({ "viewcatsts": 0, cat })
        }

    } catch (error) {
        console.error(error);
    }
})

router.delete('/deletecat/:id', async (req, res) => {

    const scat = await Category.findById(req.params.id)
    const cImage = scat.cat_img

    const filepath = path.join(catDir, cImage)
    try {
        const cat = await Category.findByIdAndDelete(req.params.id)
        if (!cat) {
            return res.json({ "delsts": 1, "msg": "Category not deleted" })
        } else {
            fs.unlinkSync(filepath)
            return res.json({ "delsts": 0, "msg": "Category deleted" })

        }
    } catch (error) {
        console.error(error);
    }
})

module.exports = router

