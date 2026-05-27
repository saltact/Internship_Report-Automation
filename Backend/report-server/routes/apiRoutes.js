const express = require('express');
const router = express.Router();
const multer = require('multer');
const {uploadExcel, getLatestHistory, getAllSalesData} = require('../controllers/uploadController');


const upload = multer({storage: multer.memoryStorage() });

router.post('/upload-excel', upload.single('file'),uploadExcel);
router.get('/import-history/latest',getLatestHistory);
router.get('/sales-data', getAllSalesData);


module.exports = router;