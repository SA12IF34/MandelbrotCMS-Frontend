import { useEffect } from 'react';
import {FaGithub} from 'react-icons/fa';
import { createApi } from '../api';

const api = createApi(import.meta.env.VITE_API_BASE_URL)

function GithubLogin() {

  const authorizeURL = import.meta.env.VITE_GITHUB_AUTHORIZE;

  const authorize = () => {
    window.location.assign(authorizeURL)
  }

  interface GithubUserInfo {
    access_token: string;
    email: string;
    username: string;
    name: string;
}

  async function handleLogin(accessToken: string, email: string, username: string) {
    try {
        const response = await api.post('authentication/apis/rest-auth/github/', {
            access_token: accessToken,
            email: email,
            username: username
        });

        if (response.status === 200) {
            window.location.assign('/');
        }
    } catch (error) {
        console.log(error)
    }
  }

  const handleGetAccessToken = async (code: string) => {
    try {
        const response = await api.post('authentication/apis/rest-auth/access_token/github/', {
            code
        });

        if (response.status === 200) {
            const data = response.data as GithubUserInfo;
            handleLogin(data.access_token, data.email, data.username);
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