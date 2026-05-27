const mongoose = require('mongoose');

const salesDataSchema = new mongoose.Schema({
    session_id: mongoose.Types.ObjectId,
    ngay_giao_dich: String,
    ma_st: String,
    sku: String,
    ten_hang: String,
    ma_ncc: String,
    sl: Number,
    dvb:String,
    tt_ban: Number,
    tt_vat:Number
})

module.exports = mongoose.model('SalesData', salesDataSchema);