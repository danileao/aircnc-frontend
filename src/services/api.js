import axios from 'axios';

const api = axios.create({
    baseURL: 'https://d3m-aircnc-backend.herokuapp.com'
});

export default api;