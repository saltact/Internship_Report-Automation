const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    ma_ncc: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    ten_ncc: { type: String, required: true },
    nhom_nganh_hang: { type: String },
    dia_chi: { type: String },
    MST: { type: String },
    nguoi_lien_he: { type: String },
    SDT: { type: String },
    email_lien_he: { type: String },
    trang_thai:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    } ,
}, { timestamps: true })

module.exports = mongoose.model('Supplier', supplierSchema)