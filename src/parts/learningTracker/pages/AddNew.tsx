import {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { api, handleError } from '../api';
import { Course } from '../../../types/types';

function AddNew() {
  document.title = 'Add New Course';
  const [course, setCourse] = useState<Course>();
  const [previewOn, setPreviewOn] = useState<boolean>(false);
  const linkRef = useRef<HTMLInputElement | null>(null);
  const statusRef = useRef<HTMLSelectElement | null>(null); 

  const navigator = useNavigate();

  async function handlePreviewCourse() {
    if (linkRef.current?.value.length === 0) {
      alert('Please enter course link');
      return;
    }

    try {
      setPreviewOn(true);

      const response = await api.post('get-course-data/', {link: linkRef.current?.value})
    
      if (response.status === 200) {
        const data = await response.data;

        setCourse(data);
        setPreviewOn(false)
      }

    } catch (error) {
      handleError(error)
    }
  }

  async function handleAddCourse() {
    if (linkRef.current?.value.length === 0) {
      alert('Please enter course link');
      return;
    } else if (statusRef.current?.value === '') {
      alert('Please specify course status');
      return;
    }

    try {
      const response = await api.post('courses/', {
        link: linkRef.current?.value,
        status: statusRef.current?.value
      });

      if (response.status === 201) {
        const data = await response.data;

        navigator(`/learning-tracker/courses/${data.id}/`)
      }

    } catch (error) {
      handleError(error)
    }
  }
  
  return (
    <div className='page add-new-page'>
      <div className='form'>
        <div className="field-container">
          <input ref={linkRef} type="text" placeholder='Enter a coursera or youtube link' />
          <select ref={statusRef} defaultValue={''} name="" id="">
            <option value="">Status</option>
            <option value="current">current</option>
            <option value="done">done</option>
            <option value="later">later</option>
          </select>
        </div>
        {course && (
          <div className="preview-course">
            <img src={course.image} alt="" />
            <h3>{course.title}</h3>
            <div>
              {course.sections?.map(section => {
                return (
                  <div>
                  <h4>{section.title}</h4>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {previewOn && (
          <FadeLoader color='#c0c0c0' />
        )}
        <div className="btns">
          <button onClick={handlePreviewCourse}>Preview</button>
          <button onClick={handleAddCourse}>Add</button>
        </div>
      </div>
    </div>
  )
}

export default AddNew