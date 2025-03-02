import { FadeLoader } from 'react-spinners';
import { Project } from '../../../types/types';
import ProjectComponent from './ProjectComponent';
import { Link } from 'react-router-dom';

function ProjectsContainer({projects, message}: {projects: Array<Project> | undefined, message: string}) {
  return (
    <div className='projects-container'>
        {projects ? projects.length > 0 ? projects.map(project => {
            return (
                <ProjectComponent project={project} />
            )
        }): (
            <div>
            <h2>{message}</h2>
            <br />
            <Link to='/sessions-manager/new-project'>Add new Project</Link>
            </div>
        ) : (
            <FadeLoader color='#808080' height={18} width={6} />
        )}
    </div>
  )
}

export default ProjectsContainer;