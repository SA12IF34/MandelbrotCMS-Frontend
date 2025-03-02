import { Project } from '../../../types/types';
import { Link } from 'react-router-dom';

function ProjectComponent({project}: {project: Project}) {
  return (
    <Link to={`/sessions-manager/projects/${project.id}`}>
        <div className='project-element'>
            <h3>{project.title}</h3>
            <br />
            <div className="dates">
                <p>Started on: {project.start_date}</p>
                <p>Finished on: {project.finish_date}</p>
            </div>
        </div>
    </Link>
  )
}

export default ProjectComponent;