import apiClient from '../../lib/axios';

export const uploadAndGenerateReport = async (excelFile, configData) => {
  // Bọc file Excel và thông số vào FormData
  const formData = new FormData();
  formData.append('file', excelFile);
  formData.append('vendorId', configData.vendorId);
  formData.append('taxRate', configData.taxRate);

  // Gửi lên Backend Ubuntu và yêu cầu trả về file (blob)
  const response = await apiClient.post('/api/generate-report', formData, {
    responseType: 'blob', 
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};