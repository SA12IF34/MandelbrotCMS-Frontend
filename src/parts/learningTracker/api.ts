import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL+'learning_tracker/apis/',
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withXSRFToken: true
});

export {
    handleError
} from '../../api';