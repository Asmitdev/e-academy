const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    admin_name: {
        type: String,
        required: true
    },
    admin_email: {
        type: String,
        required: true
    },
    admin_pass: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Eshop_Admin', adminSchema)