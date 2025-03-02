import {useState, useEffect} from 'react';
import type { Course } from '../../../types/types';
import {api, handleError} from '../api';

import CoursesContainer from '../components/CoursesContainer';

function Home() {
  document.title = 'Learning Tracker - Home';
  const [currentCourses, setCurrentCourses] = useState<Array<Course>>();
  const [doneCourses, setDoneCourses] = useState<Array<Course>>();
  const [laterCourses, setLaterCourse] = useState<Array<Course>>();


  async function handleGetCourses() {
    try {
        const response = await api.get('courses/');

        if (response.status === 200) {
            const data = await response.data;

            setCurrentCourses(data['current']);
            setDoneCourses(data['done']);
            setLaterCourse(data['later']);
        }

    } catch (error) {
        handleError(error);
    }
  }

  useEffect(() => {
    handleGetCourses();

  }, [])

  return (
    <div className='page home-page'>
      <section>
        <h2>Currently taking</h2>
        <br />
        <CoursesContainer courses={currentCourses} />
      </section>
      <section>
        <h2>Done</h2>
        <br />
        <CoursesContainer courses={doneCourses} />
      </section>
      <section>
        <h2>Will take</h2>
        <br />
        <CoursesContainer courses={laterCourses} />
      </section>
    </div>
  )
}

export default Home