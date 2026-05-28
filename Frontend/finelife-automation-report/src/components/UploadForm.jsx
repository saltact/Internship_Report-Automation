import React, { useState } from 'react';
import { uploadExcelFile } from '../services/api';
import './UploadForm.css';
function UploadForm({ onUploadSuccess }) {
    const [ngayGiaoDich, setNgayGiaoDich] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ngayGiaoDich) return alert('Please enter imported date for this file!');
        if (!file) return alert('Please choose/ upload Excel file for importing!');

        setLoading(true);

        try {
            const response = await uploadExcelFile(file, ngayGiaoDich);
            alert(response.data.message || 'Importing successfully');

            setFile(null);
            document.getElementById('excel-file-input').value = '';


            if (onUploadSuccess) {
                onUploadSuccess();

            }
        } catch (err) {
            console.error(err);
            alert("Importing Error: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }

    };

    return(
        <div className="upload-container">
            <h3 className="upload-title"> Nhap du lieu doanh so moi</h3>

            <form className="upload-form" onSubmit={handleSubmit}>
                <div className='input-group'>
                    <label className="input-label">1. Ngay Nhap: </label>
                    <input
                        type="date"
                        value={ngayGiaoDich}
                        onChange={(e) => setNgayGiaoDich(e.target.value)}
                        required
                        className="date-input"
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">2. Chon File Excel: </label>
                    <input
                        id="excel-file-input"
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                        className='file-input'
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                >
                    {loading ? 'Processing...' : 'Start importing'}
                </button>
            </form>
        </div>
    )
}

export default UploadForm;