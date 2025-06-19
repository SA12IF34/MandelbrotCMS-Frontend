import {useState, useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { IoClose, IoCheckmark } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { AxiosError } from 'axios';
import {api, handleError} from '../api';
import type { Project } from '../../../types/types';


function Project() {
  const [project, setProject] = useState<Project>();
  const [editStartDate, setEditStartDate] = useState<boolean>(false);
  const [editFinishDate, setEditFinishDate] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [editDescription, setEditDescription] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const startDateRef = useRef<HTMLInputElement>(null);
  const finishDateRef = useRef<HTMLInputElement>(null);
  const {id} = useParams();
  const navigator = useNavigate();

  async function handleGetProjectData() {
    try {
      const response = await api.get(`projects/${id}/`);

      if (response.status === 200) {
        const data = await response.data;
        document.title = data['title']
        setTitle(data['title']);
        setDesc(data['description']);
        setProject(data);
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 404) {
          navigator('/sessions-manager/not-found/');
        }
        else {
          handleError(error)
        }
      }
    }
  }

  async function handleUpdateProject(data: object) {
    try {
      const response = await api.patch(`projects/${id}/`, data);

      if (response.status === 202) {
        handleGetProjectData();
      }

    } catch (error) {
      handleError(error);
    }
  }

  async function handleDeleteProject() {
    try {
      const response = await api.delete(`projects/${id}/`);

      if (response.status === 204) {
        navigator('/sessions-manager/');
      }

    } catch (error) {
      handleError(error);
    }
  }

  async function handleRemovePartition(partitionID: number) {
    try {
      let confirmDel = true;
      if (project?.partitions?.length === 1) {
        if (!confirm('Deleting the last partition will delete the whole project.')) {
          confirmDel = false
        }
      }
      if (confirmDel) {
        const response = await api.delete(`partitions/${partitionID}/`);

        if (response.status === 202) {
          handleGetProjectData();
        } else if (response.status === 204) {
          handleDeleteProject();
        }
      }

    } catch (error) {
      handleError(error);
    }
  }

  async function handleUpdatePartition(partitionID: number, done: boolean) {
    try {
      const response = await api.patch(`partitions/${partitionID}/`, {done: done});

      if (response.status === 202) {
        handleGetProjectData();
      } else if (response.status === 200) {
        window.location.reload();
      }

    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    handleGetProjectData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className='page project-page'>
      {!project ? (
        <FadeLoader color='#808080' height={18} width={6} />
      ) : (
        <>
          <div className="info">
            {editTitle ? (
              <div>
                <input autoFocus
                       onChange={(e) => {setTitle(e.target.value)}} 
                       type="text" id="title" 
                       value={title}
                 />
                <button className="prepare-btn">
                  <IoCheckmark onClick={() => {
                    const input = document.getElementById('title') as HTMLInputElement
                    if (input?.value) {
                      handleUpdateProject({title: input?.value});
                      setEditTitle(false);
                    } else {
                      setEditTitle(false);
                    }
                  }} />
                </button>
              </div>
            ): (
              <h2>
                {project.title}
                <button onClick={() => {setEditTitle(val => !val)}} className="prepare-btn">
                  <CiEdit />
                </button>
              </h2>
            )}
            <br />
            {editDescription ? (
              <div>
                <textarea autoFocus
                          name="desc" id="desc" 
                          onChange={(e) => {setDesc(e.target.value)}} 
                          value={desc}
                ></textarea>
                <button className="prepare-btn" onClick={() => {
                  const input = document.getElementById('desc') as HTMLTextAreaElement
                  if (input?.value) {
                    handleUpdateProject({description: input?.value});
                    setEditDescription(false);
                  } else {
                    setEditDescription(false);
                  }
                }}>
                  <IoCheckmark />
                </button>
              </div>
            ): (
                <p>
                  {project.description}
                  <button onClick={() => {setEditDescription(val => !val)}} className="prepare-btn">
                    <CiEdit />
                  </button>
                </p>
              ) }
          </div>
          <div className="dates">
            <div style={{alignItems: 'center'}}>
              <h3>
                Start Date: 
              </h3>
              {editStartDate ? (<>
                <input ref={startDateRef} type="date" name="" id="" />
                <button className='prepare-btn' onClick={() => {
                  if (startDateRef.current?.value) {
                    handleUpdateProject({start_date: startDateRef.current.value});
                    setEditStartDate(false);
                  } else {
                    handleUpdateProject({start_date: null});
                    setEditStartDate(false);
                  }
                }}>
                  <IoCheckmark />
                </button>
              </>) : (
                <>
                  <h3>
                  &nbsp;&nbsp;{project.start_date ? project.start_date : (<span style={{fontStyle: 'italic'}}>Indertermined</span>)}
                  </h3>
                  &nbsp;&nbsp;
                  <button className='prepare-btn' onClick={() => {setEditStartDate(true)}}>
                    <CiEdit />
                  </button>
                </>
              )}
            </div>
            <div>
              <h3>
                Finish Date: 
              </h3>
              {editFinishDate ? (<>
                <input ref={finishDateRef} type="date" />
                <button className='prepare-btn' onClick={() => {
                  if (finishDateRef.current?.value) {
                    handleUpdateProject({finish_date: finishDateRef.current.value});
                    setEditFinishDate(false);
                  } else {
                    handleUpdateProject({finish_date: null});
                    setEditFinishDate(false);
                  }
                }}>
                  <IoCheckmark />
                  </button>
              </>): (
                <>
                  <h3>
                  &nbsp;&nbsp;{project.finish_date ? project.finish_date : (<span style={{fontStyle: 'italic'}}>Indetermined</span>)}
                  </h3>
                  &nbsp;&nbsp;
                  <button className='prepare-btn' onClick={() => {setEditFinishDate(true)}}>
                    <CiEdit />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="partitions">
            <h2>Partitions</h2>
            <br />
            <div className="partitions-container">
              {project.partitions?.map(partition => {
                return (
                  <div className={`partition ${partition.done && 'done'}`}>
                    <h3>{partition.title}</h3>
                    {partition.description && (<>
                      <br />
                      <p>{partition.description}</p>
                    </>)}
                    {!partition.done ? (
                      <button onClick={() => {handleUpdatePartition(partition.id, true)}} title='complete partition' className='complete-partition prepare-btn'>
                        <IoCheckmark />
                      </button>
                    ) : (
                      <button onClick={() => {handleUpdatePartition(partition.id, false)}} className='partition-done'>
                        Completed
                      </button>
                    ) }
                    <button onClick={() => {handleRemovePartition(partition.id)}} title='remove partition' className='remove-partition prepare-btn'>
                      <IoClose />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
          <button onClick={handleDeleteProject} title='delete project' className="delete-project">
            Delete Project
          </button>
        </>
      )}
    </div>
  )
}

export default Project