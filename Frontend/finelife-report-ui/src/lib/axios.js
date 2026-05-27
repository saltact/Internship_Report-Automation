import axios from 'axios';

// Khởi tạo một instance của Axios, tự động lấy IP từ file .env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // Chờ tối đa 30s vì xử lý file Excel có thể lâu
});

export default apiClient;