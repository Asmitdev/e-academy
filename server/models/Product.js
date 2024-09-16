const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    pro_cat: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'eshop_category'
    },
    product_name: {
        type: String,
        required: true,
    },
    product_short_desc: {
        type: String,
        required: true
    },
    product_long_desc: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_org_price: {
        type: Number,
        required: true
    },
    product_sale_price: {
        type: Number,
        required: true
    },
    product_sale_start_date: {
        type: Date,
        required: true
    },
    product_sale_end_date: {
        type: Date,
        required: true
    },
    product_status: {
        type: String,
        enum: ['pending', 'enable', 'disable'],
        default: 'pending'
    }

})

productSchema.pre('find', function (next) {
    this.populate('pro_cat')
    next()
})

module.exports = mongoose.model('eshop_product', productSchema)