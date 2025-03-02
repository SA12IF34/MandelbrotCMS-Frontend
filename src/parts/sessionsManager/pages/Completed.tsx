import { useState, useEffect } from 'react';
import ProjectsContainer from '../components/ProjectsContainer';
import {api, handleError} from '../api';
import { Project } from '../../../types/types';

function Completed() {
  document.title = 'Completed Projects';
  const [projects, setProjects] = useState<Array<Project>>();

  async function handleGetCompletedProjects() {
    try {
      const response = await api.get('projects/completed/');

      if (response.status === 200) {
        const data = await response.data;

        setProjects(data);
      }

    } catch (error) {
      handleError(error)
    }
  }


  useEffect(() => {
    handleGetCompletedProjects();
  }, [])

  return (
    <div className='page completed-page'>
      <ProjectsContainer message={'You have not completed any project yet..'} projects={projects} />
    </div>
  )
}

export default Completed