import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL+'entertainment/apis/',
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFTOKEN',
    withXSRFToken: true
})

export {
    handleError
} from '../../api';