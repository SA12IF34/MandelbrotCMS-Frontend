import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { createApi } from '../api';
import { AxiosError } from 'axios';

import GoogleLogin from '../components/GoogleLogin';
import GithubLogin from '../components/GithubLogin';

import '../styles/index.css'

const api = createApi(import.meta.env.VITE_API_BASE_URL+'authentication/apis/');

function Register() {

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);


  async function handleSubmitForm() {
    try {
        const response = await api.post('signup/', {
            username: usernameRef.current?.value,
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        });

        if (response.status === 200) {
            window.location.assign('/central/');
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.status === 400) {
                if (error.response?.data['data'] === 1) {
                    alert('Email already exists.')
                } else if (error.response?.data['data'] === 2) {
                    alert('Please enter all required fields correctly.')
                }

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
            <h1>Sign up</h1>
            <input required ref={usernameRef} type="text" placeholder='Username' />
            <input required ref={emailRef} type="email" placeholder='Email' />
            <input required ref={passwordRef} type="password" placeholder='Password' />
            <input type="submit" value="Submit" />
            <span style={{textAlign: 'center'}}>Or signup with</span>
            <div className='OAuthContainer'>
              <GoogleLogin />
              <GithubLogin />
            </div>
            <span style={{textAlign: 'center'}}>Already have an account? <Link to={'/login'}>Login</Link></span>
        </form>
    </div>
  )
}

export default Register;