import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // 프록시 서버 주소 나중에 env 변수 설정
  timeout: 5000,
});

export default axiosInstance;