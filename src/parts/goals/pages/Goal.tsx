import {useParams} from 'react-router-dom';

import GoalContainer from '../components/GoalContainer';

function Goal() {
  const {id} = useParams();

  return (
    <div className='goal-page page'>
      <GoalContainer form={false} id={id} />
    </div>
  )
}

export default Goal