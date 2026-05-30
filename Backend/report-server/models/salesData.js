const mongoose = require('mongoose');

const salesDataSchema = new mongoose.Schema({
    session_id: {
        type: mongoose.Types.ObjectId,
        ref: 'ImportSession',
        required: true
    },
    ngay_giao_dich: {type : String, required: true},
    ma_st: {type : String, required: true, uppercase:true},
    sku: {type : String, required: true},
    ten_hang: {type : String},
    ma_ncc: {type : String, required: true, uppdercase:true},
    sl: {type : Number},
    dvb: {type : String, required: true},
    tt_ban: {type : Number, required: true},
    tt_vat: {type : Number, required: true}
})

module.exports = mongoose.model('SalesData', salesDataSchema);