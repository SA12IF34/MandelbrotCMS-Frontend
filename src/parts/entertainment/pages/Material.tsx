import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { api, handleError } from '../api';
import { FadeLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';
import { Entertainment } from '../../../types/types';

import RelatedEntriesContainer from '../components/RelatedEntriesContainer';
import { AxiosError } from 'axios';

function Material() {
  const {id} = useParams();

  const {theme} = useContext(ThemeContext);
  
  const [material, setMaterial] = useState<Entertainment>();
  const [changeUserRate, setChangeUserRate] = useState<boolean>(false);

  async function handleGetMaterial() {
    try {
      const response = await api.get(`materials/${id}/`);

      if (response.status === 200) {
        const data = await response.data;
        document.title = data.title+' - Entertainment';
        setMaterial(data);
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          window.location.href = '/entertainment/not-found';
        }
      }

      handleError(error);
    }
  }

  async function handleUpdateMaterial(data: object) {
    try {
      const response = await api.patch(`materials/${id}/`, data);
      if (response.status === 202) {
        const data = await response.data;
        setMaterial(data);
      }
    } catch(error) {
      handleError(error);
    }

    handleGetMaterial();
  }

  async function handleDeleteMaterial() {
    try {
      const response = await api.delete(`materials/${id}/`);

      if (response.status === 204) {
        window.history.back();
      }

    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    handleGetMaterial();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (material && material.locked) {
      const div = document.createElement('div');
      const page = document.querySelector('.material-page');

      div.className = 'locked';
      div.innerHTML = `
        <div>
          <h2>&quot;${material.title}&quot; is locked</h2>
          ${material.lock_reason ? `
          <br>
          <h3>You must either finish or delete <a style="text-decoration-line: underline !important;" href="/goals/${material.lock_reason}">this goal</a> first.</h3>
          `: ''}
          
        </div>
      `

      page?.appendChild(div);

    }
  }, [material])

  return (
    <div className='page material-page'>
      {!material ? (
        <FadeLoader color={theme === 'light' ? '#350d0b' : '#f5f5f5'} height={18} width={6} />
      ): (
        <>
          <div className="material-container">
            <div className="image-container">
              <img src={material.image_upload || material.image} alt="" />
            </div>
            <div>
              <h2 className='title'>{material.title}</h2>
              <br />
              <div className="genres">
                {material.genres.map((genre, index) => (
                  <span key={index}>{genre}</span>
                ))} 
              </div>
              <br />
              <div className="rates">
                <span>Avg rate: {material.rate ? material.rate + '/10' : 'N/A'}</span>
                {changeUserRate ? (
                  <select onChange={(e) => {
                    handleUpdateMaterial({user_rate: e.target.value})
                    setChangeUserRate(false);
                  }} >
                    <option value="">none</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                ): (
                  <span style={{cursor: 'pointer'}} title='set your rate' onClick={() => {
                    setChangeUserRate(true)
                  }}>My rate: {material.user_rate ? material.user_rate + '/10' : 'N/A'}</span>
                )}
              </div>
              <br />
              <a href={material.link} target='_blank' className="link">{material.link}</a>
            </div>
            <div>
              <select onChange={(e) => {
                handleUpdateMaterial({status: e.target.value})
              }} className='status' defaultValue={material['status']} >
                <option selected={material['status'] === 'current' ? true : false} value={'current'}>current</option>
                <option selected={material['status'] === 'done' ? true : false} value={'done'}>done</option>
                <option selected={material['status'] === 'future' ? true : false} value={'future'}>future</option>
              </select>
              <button onClick={() => {
                handleUpdateMaterial({special: !material.special})
              }} className={material.special ? 'special' : ''}>
                {material.special ? 'Special' : 'Not Special'}
              </button>
            </div>
            <div className="desc">
              <p dangerouslySetInnerHTML={{ __html: material.description }} />             
            </div>
            <button onClick={handleDeleteMaterial} className='delete'>
              Delete
            </button>
          </div>
          {material.relatives && material.relatives.length > 0 && (
            <>
              <div className="line-sep"></div>
              <div className="related-entries">
                <h3>Related Entries</h3>
                <br />
                <div>
                  <RelatedEntriesContainer materials={material.relatives as Entertainment[]} />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Material;