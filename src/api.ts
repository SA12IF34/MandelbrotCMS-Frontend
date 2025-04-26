import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true

export function createApi(baseURL: string) {
    return axios.create({
        baseURL
    })
}

export function handleError(error: unknown) {
    if (error instanceof axios.AxiosError) {
        if (error.status === 500) {
            alert('Something happened on our side, please try again later.');
        } else if (error.status === 400) {
            alert('Please make sure you entered all required data correctly.')
        } else if ((error.status === 403 || error.status === 401) 
                    && (!window.location.pathname.includes('login') 
                    && !window.location.pathname.includes('register')
                    && !(window.location.pathname === '/'))) {
            window.location.assign('/login');
        }
    
    } else {
        alert("Something went wrong, please try again.")
        
    }

    console.log(error);
}


export async function handleGetSettings() {
    try {
        const response = await axios.get(import.meta.env.VITE_API_BASE_URL+'authentication/apis/settings/');

        if (response.status === 200) {
            const data = await response.data;
            localStorage.setItem('settings', JSON.stringify(data));
            return data;
        }

    } catch (error) {
        handleError(error);
    }
}


export async function handleGetProject(id: number) {
    try {
        const response = await axios.get(
            import.meta.env.VITE_API_BASE_URL+`sessions_manager/apis/projects/${id}/`
        );

        if (response.status === 200) {
            return await response.data
        }

    } catch (error) {
        return handleError(error)
    }
}

export async function handleGetCourse(id: number) {
    try {
        const response = await axios.get(
            import.meta.env.VITE_API_BASE_URL+'learning_tracker/apis/courses/'+id+'/'
        );

        if (response.status === 200) {
            return await response.data;
        }
    } catch (error) {
        return handleError(error);        
    }
}

export async function handleGetEntertainment(id: number) {
    try {
        const response = await axios.get(
            import.meta.env.VITE_API_BASE_URL+`entertainment/apis/materials/${id}/`
        );

        if (response.status === 200) {
            return await response.data;
        }

    } catch (error) {
        return handleError(error)
    }
}

export async function handleGetFullEntertainment(id: number) {
    try {
        const data = await handleGetEntertainment(id);

        if (data.relatives.length > 0) {
            for (let i=0; i < data.relatives.length; i++) {
                const relative = await handleGetEntertainment(data.relatives[i]);
                data.relatives[i] = relative;
            }
        }

        return data;

    } catch (error) {
        return handleError(error);
    }
}