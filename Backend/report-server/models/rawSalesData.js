const mongoose = require('mongoose')


const rawSalesDataSchema = new mongoose.Schema({
    session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImportSession',
        required: true
    },
    ngay_giao_dich: { type: String, required: true },
    ma_st: { type: String, required: true, uppercase: true },
    raw_payload: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
},{ timestamps: true });




module.exports = mongoose.model('RawSalesData', rawSalesDataSchema);