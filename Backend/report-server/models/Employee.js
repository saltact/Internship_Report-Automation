const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    ma_nv: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    ten_nv: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ['admin', 'tester', 'marketer', 'manager', 'accountant'],
        defaul: 'accountant'

    },
    trang_thai: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    SDT: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema)