import axios from 'axios';


const API_URL = 'http://localhost:3000';
const api = axios.create({
  baseURL: `${API_URL}/api/v1`, 
  withCredentials: true,
});


export default api;