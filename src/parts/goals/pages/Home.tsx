import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';

import { api, handleError } from '../api';
import { Goal } from '../../../types/types';
import { FadeLoader } from 'react-spinners';

function Home() {
  document.title = 'Goals - Home';
  const [goals, setGoals] = useState<Goal[]>();

  async function handleGetGoals() {
    try {
      const res = await api.get('/goals/');
      
      if (res.status === 200) {
        const data = await res.data;

        setGoals(data);
      }

    } catch (err) {
      handleError(err);
    }
  }


  useEffect(() => {
    handleGetGoals();

// eslint-disable-next-line
  }, [])


  return (
    <div className='home-page page'>
        {!goals ? (
            <FadeLoader color='#c0c0c0' height={18} width={6} />
        ): goals.length === 0 ? (
            <>
            <h2>You have not created any goals yet</h2>
            <Link className='go-home' to={'/goals/create-goal'}>Create a Goal Here</Link>
            </>
        ) : goals.map(goal => {
            return (
                <Link to={`/goals/goal/${goal.id}`} key={goal.id} className='goal-element'>
                    <h2>{goal.title.length > 35 ? goal.title.slice(0, 36)+'...': goal.title}</h2>
                </Link>
            )
        })}
    </div>
  )
}

export default Home