import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL+'sessions_manager/apis/',
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken'
})

export {
    createApi,
    handleError,
    handleGetProject
} from '../../api';