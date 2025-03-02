import GoalContainer from '../components/GoalContainer';

function CreateGoal() {
  document.title = 'Create Goal';
  return (
    <div className='create-goal-page page'>
      <GoalContainer form={true} />
    </div>
  )
}

export default CreateGoal