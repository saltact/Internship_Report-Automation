const XLSX = require('xlsx');
const ImportSession = require('../models/importSession');
const SalesData = require('../models/salesData');
const {client} = require('../config/redis');
const crypto = require('crypto');

const uploadExcel = async(req,res) => {
    try {
        const {ngayGiaoDich} = req.body;
        if(!ngayGiaoDich) return res.status(400).json({error:"Missing imported date!"});
        if(!req.file) return res.status(400).json({error: "Missing Excel file!"});
        console.log(`Starting to processing file: ${req.file.originalname} for the day of ${ngayGiaoDich}`);

        // 1. Hasing for prevent duped files while uploadaing
        const fileHash = crypto.createHash('md5').update(req.file.buffer).digest('hex');

        // 2. Checking if the file have been uploaded before?
        const existingSession = await ImportSession.findOne({file_hash: fileHash});
        if (existingSession){
            return res.status(409).json({
                error: `This file have already been uploaded to the database at ${existingSession.ngay_giao_dich}! Please don't reupload the same file.`
            });
        }

        console.log(`Getting file: ${req.file.originalname} for the day of ${ngayGiaoDich}`);

        // 3. Overwriting existed raw data of this day (if have)
        const deleteResult = await SalesData.deleteMany ({ngay_giao_dich: ngayGiaoDich});
        if (deleteResult.deletedCount > 0){
            console.log(`⚠️ Done cleaning ${deleteResult.deletedCount} rows of old data at ${ngayGiaoDich} for overwriting`)
        }


        const session = await ImportSession.create({
            file_name: req.file.originalname,
            status:'processing',
            ngay_giao_dich: ngayGiaoDich,
            file_hash: fileHash
        });
    
    const workbook = XLSX.read(req.file.buffer, {type:'buffer'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(worksheet);

    const documents = [];
    for (let row of rawRows){
        if(row['SKU']){
            documents.push({
                session_id: session._id,
                ngay_giao_dich: ngayGiaoDich,
                ma_st: row['Mã ST']?.toString().trim(),
                sku:row['SKU']?.toString().trim(),
                ten_hang: row['Tên Hàng']?.toString().trim(),
                ma_ncc: row['Mã NCC']?.toString().trim(),
                sl:parseFloat(row['SL']) ||  0,
                dvb:row['ĐVB']?.toString().trim(),
                tt_ban:parseFloat(row['TT.Bán']?.toString().replace(/,/g, '')) ||row['TT.Ban']?.toString().replace(/,/g, '') || 0,
                tt_vat: parseFloat(row['TT.VAT']?.toString().replace(/,/g, '')) || 0,
            });
        }
    }
    if (documents.length > 0) {
        await SalesData.insertMany(documents);
        console.log(`Saved ${documents.length} rows sucessfully to DB.`);
    }

    await client.lPush('excel_tasks', session._id.toString());
    console.log(` Pushed task [${session._id}] into Queue for worker!`);

    res.status(200).json({message: "Import sucessfully", session_id:session._id});
    } catch(err){
        console.error(err);
        res.status(500).json({error:err.message});
    }
};

const getLatestHistory = async(req,res) => {
    try {
        const latest = await ImportSession.findOne().sort({uploaded_at: -1});
        res.json(latest);
    }catch (err){
        res.status(500).json({error: err.message});
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
            .sort({ngay_giao_dich: -1})
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
    } catch(err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
} 


module.exports = {uploadExcel, getLatestHistory, getAllSalesData};