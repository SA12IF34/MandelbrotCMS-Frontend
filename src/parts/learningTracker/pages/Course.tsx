import {useState, useEffect, MouseEvent} from 'react';
import ReactDOM from 'react-dom/client'
import { useParams } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { FaRegStar, FaStar } from "react-icons/fa";
import {api, handleError} from '../api';
import type { Course } from '../../../types/types';
import { AxiosError } from 'axios';

function Course() {
  const {id} = useParams();

  const [course, setCourse] = useState<Course>();
  const [maxLinkLength, setMaxLinkLength] = useState(50);

  async function handleGetCourse() {
    try {
        setCourse(undefined);
        const response = await api.get(`courses/${id}/`);

        if (response.status === 200) {
            const data = await response.data;
            document.title = data['title'];
            setCourse(data)
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                window.location.href = '/learning-tracker/not-found';
            }
        }
        handleError(error);
    }
  } 

  async function handleUpdateCourse(data: object) {
    try {
        const response = await api.patch(`courses/${id}/`, data);

        if (response.status === 202) {
            handleGetCourse();
        }

    } catch (error) {
        handleError(error);
    }
  }

  async function handleDeleteCourse() {
    try {
        const response = await api.delete(`courses/${id}/`);

        if (response.status === 204) {
            window.history.back();
        }

    } catch (error) {
        handleError(error)
    }
  }

  async function handleCheckSection(e: MouseEvent<HTMLLabelElement>, sectionID: number) {
    try {
        e.preventDefault();
        if (course?.status === 'done') {
            return;
        } 
        

        const input = (e.target as HTMLLabelElement).firstElementChild as HTMLInputElement;

        const value = !input.checked;

        const response = await api.patch(`update-section/${sectionID}/`, {
            done: value
        })

        if (response.status === 202) {
            input.checked = value;
            
            if (value) {
                if (course?.status === 'later') {
                    handleUpdateCourse({'status': 'current'});
                }
                ReactDOM.createRoot((e.target as HTMLLabelElement).lastElementChild as HTMLButtonElement).render(
                    <FaStar color="gold" /> 
                )
            } else {
                const doneSections = document.querySelectorAll(".section input:checked");

                if (doneSections.length === 0) {
                    handleUpdateCourse({'status': 'later'});
                }

                ReactDOM.createRoot((e.target as HTMLLabelElement).lastElementChild as HTMLButtonElement).render(
                    <FaRegStar color="#c0c0c0" />
                )
            }
        } else if (response.status === 200) {
            window.location.reload();
        }

    } catch (error) {
        handleError(error);
    }
  }


  useEffect(() => {

    if (window.matchMedia('(max-width: 545px)').matches) {
        setMaxLinkLength(20);
    }

    handleGetCourse();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div className="page course-page">
        {!course ? (
            <FadeLoader color="#c0c0c0" height={18} width={6} />
        ): (
            <>
            <div>
                <div className="image">
                    <img src={course.image} alt="" />
                </div>
                <h2>
                    {course.title}
                </h2>
                <div className="info">
                    <span className='status'>
                        {course.status}
                    </span>
                    <span className="source">
                        source: <a target='_blank' href={course.link}>{course.link.length > maxLinkLength ? course.link.slice(0, maxLinkLength+1) + '...' : course.link}</a>
                    </span>
                </div>
            </div>
            <div>
                {course.list ? (
                    <>
                        <h2>Sections</h2>
                        <br />
                        <div className="sections">
                            {course.sections?.map(section => {
                                return (
                                    <div className="section">
                                        <h4>{section.title}</h4>
                                        <label onClick={(e) => {handleCheckSection(e, section.id)}} htmlFor="done-section">
                                            <input checked={section.done ? true : false} type="checkbox" name="" id="done-section" />
                                            <button>
                                                {section.done ? (
                                                    <FaStar color="gold" />    
                                                ): (
                                                    <FaRegStar color="#c0c0c0" />
                                                )}
                                            </button>
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                ): course.status === 'later' ? (
                    <>
                    <button onClick={() => {handleUpdateCourse({'status': 'current'})}} className="change-status">Start Course</button>
                    </>
                ): course.status === 'current' ? (
                    <>
                    <button onClick={() => {handleUpdateCourse({'status': 'done'})}} className="change-status">
                        Done <FaRegStar color='#c0c0c0' />
                    </button>
                    </>
                ) : (
                    <>
                    <button className="done-status">
                        Done <FaStar color='gold' />
                    </button>
                    </>
                )}
            </div>
            <button onClick={handleDeleteCourse} className="delete-course">Delete</button>
            </>
        )}
    </div>
  )
}

export default Course