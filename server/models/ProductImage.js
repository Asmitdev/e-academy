const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
    product_image: {
        type: String,
        required: true
    },
    proId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'eshop_product'
    }
})

module.exports = mongoose.model('eshop_product_image', productImageSchema)