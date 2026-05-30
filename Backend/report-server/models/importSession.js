const mongoose = require('mongoose');

const importSessionSchema = new mongoose.Schema({
    file_name: String,
    status: String,
    ngay_giao_dich: String,
    file_hash: String,
    uploaded_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ImportSession', importSessionSchema);