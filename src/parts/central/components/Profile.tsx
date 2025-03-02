import {useState, useEffect, useRef} from 'react';
import { MdEdit } from "react-icons/md";
import {IoCheckmark} from 'react-icons/io5'
import { FadeLoader } from 'react-spinners';
import {createApi, handleError} from '../api';
import {Account} from '../../../types/types';

const api = createApi(import.meta.env.VITE_API_BASE_URL+'authentication/apis/');

function Profile() {

  const [profile, setProfile] = useState<Account>();
  const [editAbout, setEditAbout] = useState<boolean>(false);
  const aboutRef = useRef<HTMLTextAreaElement | null>(null);

  async function handleGetProfile() {
    try {
      const response = await api.get('my-account/');

      if (response.status === 200) {
        const data: Account = await response.data;

        setProfile(data);
      }

    } catch(error) {
      return handleError(error)
    }
  }

  async function handleLogout() {
    try {
      const response = await api.post('logout/');

      if (response.status === 200) {
        window.location.reload();
      }

    } catch (error) {
      return handleError(error);
    }
  }


  async function handleDeleteAccount() {
    try {
      const response = await api.post('close/');

      if (response.status === 204) {
        window.location.reload();
      }

    } catch (error) {
      return handleError(error);
    }
  }

  async function handleUpdateProfile(data: object) {
    try {

      const response = await api.patch('my-account/', data, {
        headers: {
          'Content-Type': "multipart/form-data"
        }
      });
      
      if (response.status === 202) {
        const data: Account = await response.data;

        setProfile(data);
      }

    } catch (error) {
      return handleError(error)
    }
  }

  useEffect(() => {
    handleGetProfile();
  }, [])

  return (
    <div className='profile-container'>
      {profile ? (
        <>
          <div className="profile-pic">
            <div>
            <img src={import.meta.env.VITE_API_BASE_URL+(profile.picture as string)} alt="" />
            </div>
            <div className="edit-pic">
              <label title='edit picture' htmlFor="edit-pic-field">
                <MdEdit />
              </label>
              <input onChange={(e) => { 
                const fileInput = e.target as HTMLInputElement;
                if (fileInput.files && fileInput.files[0]) {
                  handleUpdateProfile({picture: fileInput.files[0]});
                }
              }} type="file" id='edit-pic-field' />
            </div>
          </div>
          <div className="profile-about">
            <h4>About</h4>
            {editAbout ? (
              <div className="textarea">
                <textarea ref={aboutRef} autoFocus>
                  {profile.about}
                </textarea>
                <button onClick={() => {
                  if (aboutRef.current?.value !== profile.about) {
                    handleUpdateProfile({about: aboutRef.current?.value});
                  }
                  setEditAbout(false);
                }} title='finish edit'>
                  <IoCheckmark />
                </button>
              </div>
            ): (
              <p>
                {profile.about}
              </p>
            )}
            <button onClick={() => {setEditAbout(true)}} title='edit about' className='edit-about'>
              <MdEdit />
            </button>
          </div>
          <div className="profile-info">
            <h4>Username: {profile.username}</h4>
            <h4>Email: {profile.email}</h4>
          </div>
          <div className="profile-action">
            <button title='logout' onClick={handleLogout}>Logout</button>
            <button title='delete account' onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </>
      ): (
        <FadeLoader color={'#c0c0c0'} />
      )}
    </div>
  )
}

export default Profile