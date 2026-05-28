import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const uploadExcelFile = async (file, ngayGiaoDich) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ngayGiaoDich', ngayGiaoDich);
    return axios.post(`${API_BASE_URL}/upload-excel`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


export const getLatestHistory = async () => {
    return axios.get(`${API_BASE_URL}/import-history/latest`);
};

export const getAllSalesData = async (page = 1, limit = 100, ngayGiaoDich = '') => {

    let url=`${API_BASE_URL}/sales-data?page=${page}&limit=${limit}`;
    
    if (ngayGiaoDich) {
        url += `&ngayGiaoDich=${ngayGiaoDich}`;
    }
    return axios.get(url);
}