import { useEffect } from 'react';
import {FaGithub} from 'react-icons/fa';
import { createApi } from '../api';

const api = createApi(import.meta.env.VITE_API_BASE_URL)

function GithubLogin() {

  const authorizeURL = import.meta.env.VITE_GITHUB_AUTHORIZE;

  const authorize = () => {
    window.location.assign(authorizeURL)
  }


  async function handleLogin(accessToken: string) {
    try {
        const response = await api.post('authentication/apis/rest-auth/github/', {
            access_token: accessToken
        });

        if (response.status === 200) {
            window.location.assign('/');
        }
    } catch (error) {
        console.log(error)
    }
  }

  const handleGetAccessToken = async (code:string) => {

    try {
        const response = await api.post('authentication/apis/rest-auth/access_token/github/', {
            code
        });

        if (response.status === 200) {
            const data = await response.data;
            console.log(data);
            handleLogin(data['access_token' as keyof typeof data])
        }

    } catch (error) {
        console.log(error)
    }

  }

  let num = 0;
  useEffect(() => {

    if (num < 1) {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('code')) {
            const code = searchParams.get('code');
            handleGetAccessToken(code as string)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        num += 1;
    }

  }, [])

  return (
    <button onClick={() => authorize()} className='LoginBtn GithubLogin'>
        <FaGithub />
    </button>
  )
}

export default GithubLogin;