import {useState, useEffect} from 'react';
import ProjectsContainer from '../components/ProjectsContainer';
import {api, handleError} from '../api';

import {Project} from '../../../types/types';

function InProgress() {
  document.title = 'In Progress Projects';
  const [projects, setProjects] = useState<Array<Project>>();

  async function handleGetInProgressProjects() {
    try {
      const response = await api.get('projects/in-progress/');

      if (response.status === 200) {
        const data = await response.data;

        setProjects(data);
      }

  
    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    handleGetInProgressProjects();
  }, []);

  return (
    <div className='page in-progress-page'>
      <ProjectsContainer message={'There are no in progress projects..'} projects={projects} />
    </div>
  )
}

export default InProgress