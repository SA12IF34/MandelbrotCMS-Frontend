import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { createApi } from '../api';
import { AxiosError } from 'axios';

import '../styles/index.css'


const api = createApi(import.meta.env.VITE_API_BASE_URL+'authentication/apis/');

function Login() {

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);


  async function handleSubmitForm() {
    try {
        const response = await api.post('login/', {
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        })

        if (response.status === 200) {
            window.location.assign('/central/');
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.status === 404) {
                alert('Account does not exist or you entered wrong data.');
            
            } else if (error.status === 500) {
                alert('Something went wrong, please try again.')
            }
        }
    }
  }

  return (
    <div className='authentication-page'>
        <form
        onSubmit={(e) => {
            e.preventDefault();
            handleSubmitForm();
        }}
        action="">
            <h1>Login</h1>
            <input required ref={emailRef} type="email" placeholder='Email' />
            <input required ref={passwordRef} type="password" placeholder='Password' />
            <input type="submit" value="Submit" />
            <span style={{textAlign: 'center'}}>Don't have an account? <Link to={'/register'}>create one</Link></span>
        </form>
    </div>
  )
}

export default Login