import type { Course } from '../../../types/types';
import { FadeLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

function CoursesContainer({courses}: {courses: Array<Course> | undefined}) {
  
  return (
    <div className='courses-container'>
        {!courses ? (
          <FadeLoader color='#c0c0c0' />
        ): courses.length === 0 ? (
          <h3>No courses</h3>
        ) : courses.map(course => {
          return (
            <Link to={`/learning-tracker/courses/${course.id}/`}>
              <div className='course-element'>
                <div className="course-img">
                  <img src={course.image} alt="" />
                </div>
                <h4 className='course-title'>{course.title}</h4>
                <div className='course-progress'>
                  <div style={{width: `${course.progress}%`}} className="progress"></div>
                  <div style={{width: 12, height: 12, top: `50%`, left: `${course.progress}%`}} className="progress-pointer"></div>
                </div>
              </div>
            </Link>
          )
        })}
    </div> 
  )
}

export default CoursesContainer;