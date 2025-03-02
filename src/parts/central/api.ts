import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL+'missions/apis/'
});


export { 
    handleError,
    handleGetProject,
    handleGetCourse,
    handleGetEntertainment,
    createApi
} from '../../api';


