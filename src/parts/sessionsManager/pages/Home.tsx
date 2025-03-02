import {useEffect, useState} from 'react'
import ProjectsContainer from '../components/ProjectsContainer'
import { api, handleError } from '../api'
import { Project } from '../../../types/types';

function Home() {
  document.title = 'Sessions Manager - Home';
  const [projects, setProjects] = useState<Array<Project>>();

  async function handleGetProjects() {
    try {
      const response = await api.get('projects/');

      if (response.status === 200) {
        const data = await response.data;

        setProjects(data);
      }

    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    handleGetProjects();
  }, [])


  return (
    <div className='page home-page'>
      <ProjectsContainer message={'You have not added any projects yet..'} projects={projects} />
    </div>
  )
}

export default Home