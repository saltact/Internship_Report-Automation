const XLSX = require('xlsx');
const crypto = require('crypto');
const ImportSession = require('../models/importSession');
const SalesData = require('../models/salesData');
const RawSalesData = require('../models/rawSalesData');
const { client } = require('../config/redis');

const uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Missing Excel file.' });
        } 

        const { ngayGiaoDich } = req.body;
        const nhanVienId = req.body.nhan_vien_id || 'NV_ADMIN';

        if (!ngayGiaoDich) {
            return res.status(400).json({ error: 'Please enter the imported date.' })
        }

        const fileBuffer = req.file.buffer;
        const fileHash = crypto.createHash('md5').update(fileBuffer).digest('hex');

        const existingSession = await ImportSession.findOne({ file_hash: fileHash });
        if (existingSession) {
            return res.status(409).json({
                error: 'This file was already uploaded the day before. Please check the import history again!'
            });
        }
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (!sheetData || sheetData.length === 0) {
            return res.status(400).json({ error: 'Wrong formatted file. No SKU column detected!' });
        }


        const newSession = await ImportSession.create({
            file_name: req.file.originalname,
            file_hash: fileHash,
            ngay_giao_dich: ngayGiaoDich,
            nhan_vien_id: nhanVienId,
            trang_thai: 'Successfully'
        });

        const rawDataArray = [];
        const cleanDataArray = [];

        const parseNumber = (val) => {
            if (val === undefined || val === null || val === '') return 0;
            if (typeof val === 'number') return val;

            const cleanString = String(val).replace(/,/g, '').replace(/\s/g, '');
            return isNaN(parsed) ? 0 : parsedl
        };

        sheetData.forEach((row) => {
            
            const sku_excel = row['SKU'] || row['sku'];
            if(!sku_excel) return;
            
            const ma_st_excel = row['Mã ST'] || row['ma_st'] || 'UNKNOWN';
            const ten_hang_excel =  row['Tên Hàng'] || row['ten_hang'];
            const dvb_excel = row['ĐVB'] || row['dvb'] || 'EA';
            const ma_ncc_excel = row['Mã NCC'] || row['ma_ncc'] || 'UNKNOWN';

            rawDataArray.push({
                session_id: newSession._id,
                ngay_giao_dich: ngayGiaoDich,
                ma_st: ma_st_excel,
                raw_payload: row
            });

            cleanDataArray.push({
                session_id: newSession._id,
                ngay_giao_dich: ngayGiaoDich,
                ma_st: ma_st_excel,
                sku: sku_excel,
                ten_hang: ten_hang_excel,
                dvb: dvb_excel,
                ma_ncc: ma_ncc_excel,
                sl: parseNumber(row['SL'] || row['sl']) || 0,
                tt_ban: parseNumber(row['TT.Bán'] || row['tt_ban']) || 0,
                tt_vat: parseNumber(row['TT.VAT'] || row['tt_vat']) || 0,
            });
        });

        await Promise.all([
            RawSalesData.insertMany(rawDataArray),
            SalesData.insertMany(cleanDataArray)
        ]);

        return res.status(200).json({
            message: `Uploading file successfully! Added ${cleanDataArray.length} rows`,
            sessiond_id: newSession._id
        });
    } catch (error) {
        console.error('Uploading Error:', error);
        return res.status(500).json({ error: 'Server error while handling Excel file.' });
    }
};

const getLatestHistory = async (req, res) => {
    try {
        const latest = await ImportSession.findOne().sort({ uploaded_at: -1 });
        res.json(latest);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getAllSalesData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;

        const { ngayGiaoDich } = req.query;
        let filter = {};
        if (ngayGiaoDich) {
            filter.ngay_giao_dich = ngayGiaoDich;
        }

        const data = await SalesData.find(filter)
            .sort({ ngay_giao_dich: -1 })
            .skip(skip)
            .limit(limit);

        const totalRecords = await SalesData.countDocuments(filter);

        res.status(200).json({
            message: `Successfully fetching all data`,
            pagination: {
                total_records: totalRecords,
                current_page: page,
                total_pages: Math.ceil(totalRecords / limit),
                records_per_page: limit
            },
            data: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}


module.exports = { uploadExcel, getLatestHistory, getAllSalesData };