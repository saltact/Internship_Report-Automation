const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
    ma_st: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    ten_store: { type: String, required: true },
    dia_chi: { type: String, required: true },
    khu_vuc: { type: String },
    MST: { type: String },
    nv_quan_ly: { type: String },
    sdt_store: { type: String },
    type: {
        type: String,
        enum: ['foodcorner', 'foodstore', 'supermarket'],
        required: true
    },
    trang_thai: {
        type: String,
        enum: ['open', 'closed', 'maintenance'],
        default: 'open'
    }

}, { timestamps: true })

module.exports = mongoose.model('Vendor', vendorSchema);