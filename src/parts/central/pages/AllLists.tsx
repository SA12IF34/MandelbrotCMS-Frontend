import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { IoCheckmark } from 'react-icons/io5';
import {FadeLoader} from 'react-spinners';
import { api, handleError } from '../api';
import { MissionsList } from '../../../types/types';

function AllLists({title}: {title: string}) {
  
  const [lists, setLists] = useState<MissionsList[]>([]);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'none'>('loading');

  async function handleGetAllLists() {
    try {
      const response = await api.get('lists/');

      if (response.status === 200) {
        const data:MissionsList[] = await response.data;
        if (data.length === 0) {
          setStatus('none');
        } else {
          setStatus('loaded');
          setLists(data);
        }
      }

    } catch (error) {
      return handleError(error);
    }
  }


  async function handleDeleteList(listID: number)  {
    try {
      const response = await api.delete(`lists/${listID}/`);

      if (response.status === 204) {
        handleGetAllLists();
      }

    } catch (error) {
      return handleError(error)
    }
  }

  useEffect(() => {
    handleGetAllLists();
    document.title = title;
    // eslint-disable-next-line
  }, [])


  return (
    <div className="page all-lists-page">
      {status === 'loading' ? (
        <FadeLoader color='#c0c0c0' height={18} width={6} />
      ): status === 'none' ? (
        <>
        <h3>
          You have not created any missions list yet..
        </h3>
        <br />
        <Link to='/create-new-list/'>Create New List</Link>
        </>
      ) : lists.map(list => {
        return (
          <div className="list-container">
            <Link title={`go to list's page`} to={`/central/lists/${list.id}/`}>
              <h3>{list.title}</h3>
            </Link>
            <button title='delete list' onClick={() => {handleDeleteList(list.id)}} className="del-list">
              Delete
            </button>
            {list.done && (
              <span title='you have done this list' className="done-list">
                <IoCheckmark />
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default AllLists